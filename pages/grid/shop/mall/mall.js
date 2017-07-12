var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    container_width: "100%",
    image_width: "115",
    id:"",
    product:[],
    pageNum: 1,
    loadMore: true,
    requestSwitch: true,
    Op: 'desc',
    getSortData: {
      value: 'timeUpOp',
      op: 'desc'
    },
    name: "店铺详情",
    requeseName:'',
    code:'',
    getFilterData: [],
    prompt:0
  },
  // 跳转搜索页面
  bindfocus:function(){
    wx.navigateTo({
      url: '../../../my/Goods/GoodsScreen/GoodsScreen?type=shop'
    })
    this.setData({
      inputFocus: false,
    })
  },
  // 返回时提示购物车未清空
  mall_back:function(){
    if (this.data.prompt){
      wx.showModal({
        title: '购物车未清空',
        content: '您的购物车还有商品未支付，在别的店铺将不能看到该店铺购物车中的商品，您是否确认退出？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  changeSortData:function(){
  },
  rank: function () {
    var that = this
    if (!this.data.rank) {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            image_width: res.windowWidth / 2 - 10,
            rank: 'rank'
          })
        }
      })
    } else {
      that.setData({
        image_width: "115",
        rank: ''
      })
    }
  },
  // 店铺货品列表
  page_request:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProducts',
      data: {
        storeId: that.data.id,
        sort: that.data.getSortData,
        rules: that.data.getFilterData,
        pageNum: that.data.pageNum,
        name: that.data.requeseName,
        code: that.data.code,
        openid:app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = that.data.product;
        var booleanre = that.data.requestSwitch;
        for (var p in res.data) {
          res.data[p].timeUp = util.toDate(res.data[p].timeUp)
          res.data[p].image = res.data[p].image ? util.api.imgUrl + res.data[p].image : ""
        }
        if (that.data.pageNum == 1) {
          data = res.data;
        } else {
          for (var p in res.data) {
            data.push(res.data[p])
          }
        }
        if (res.data.length < 10) {
          booleanre = false;
        } else {
          booleanre = true;
        }
        that.setData({
          product: data,
          loadMore: true,
          requestSwitch: booleanre
        })
      }
    })
  },
  //滚动到底部触发事件  
  onReachBottom: function () {
    console.log('到底不了')
    this.setData({
      pageNum: this.data.pageNum + 1,
      loadMore: false
    });
    console.log(this.data.pageNum)
    if (this.data.requestSwitch) {
      this.page_request();
    }
  },
  // 三种排序效果切换
  changeSortData: function (e) {
    var status = e.currentTarget.dataset.sort;
    var op = this.data.Op ? this.data.Op : 'desc';
    if (op == 'desc') {
      op = 'asc'
    } else {
      op = 'desc'
    }
    this.setData({
      state: status,
      Op: op,
      getSortData: {
        value: status,
        op: op
      },
      pageNum: 1,
      product: [],
      requestSwitch: true
    });
    this.page_request();
  },
  // 跳转货品详情
  goods_detail: function (e) {
    let data = e.target.dataset
    console.log(data.orderid)
  },

  onShareAppMessage: function () {
    return {
      title: this.data.name+"的推荐"
    }
  },
  // 判断有多少件商品 购物车里面
  promptNum:function(){
    var that = this;
    var name = 'shopCartUp' +this.data.id;
    var prompt = 0;
    wx.getStorage({
      key: name,
      complete: function(res) {
        console.log(res)
        if(res.data){
          for(var p in res.data){
            if (res.data[p].sizeGroup){
              prompt += res.data[p].count * res.data[p].handtag
            }else{
              prompt += res.data[p].count 
            }
          }
          console.log(prompt)
        } else {
          prompt = 0;
        }
        that.setData({
          prompt: parseInt(prompt)
        })
      }
    })
    console.log(prompt)
    
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name: app.globalData.storeInfo[0].name,
      storephoto: options.storephoto
    });
    console.log(app.globalData)
    console.log(options.id)
    this.page_request();
  },
  onShow:function(){
    this.promptNum();
    if (app.getFilterData || app.searchValue) {
      console.log(11)
      this.setData({
        pageNum: 1,
        product: [],
        requestSwitch: true,
        code: app.searchValue ? app.searchValue : '',
        requeseName: app.searchValue ? app.searchValue : '',
        getFilterData: app.getFilterData ? app.getFilterData : undefined
      })
      this.page_request();
      app.getFilterData = [];
      app.searchValue = "";
    }
  }
})
