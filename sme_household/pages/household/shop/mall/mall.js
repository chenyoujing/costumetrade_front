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
    getSortData: {
      value: 'timeUpOp',
      op: 'desc'
    },
    name: "店铺详情",
    requeseName: null,
    code: null,
    getFilterData: [],
    prompt:0,
    state:"recommend",
    rank:'rank',
    urlAjax:'product/getAllPromotionalProduct'
  },
  // 跳转搜索页面
  bindfocus:function(){
    wx.navigateTo({
      url: '../../../original/Goods/GoodsScreen/GoodsScreen?type=shop&storeId=' + this.data.id
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
  page_request:function(url){
    var that = this;
    var header = this.data.state == 'recommend' ? "application/x-www-form-urlencoded" :'application/json'
    wx.showNavigationBarLoading();
    util.api.request({
      url: url,
      data: {
        storeId: that.data.id,
        sort: that.data.getSortData,
        rules: that.data.getFilterData,
        pageNum: that.data.pageNum,
        name: that.data.requeseName,
        code: that.data.code,
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': header
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = that.data.product;
        var booleanre = that.data.requestSwitch;
        res.data = res.data == 1000 ? [] : res.data;
        for (var p in res.data) {
          res.data[p].timeUp = util.toDate(res.data[p].timeUp);
          res.data[p].createTime = util.toDate(res.data[p].createTime);
          for (var j in res.data[p].products){
            res.data[p].products[j].timeUp = util.toDate(res.data[p].products[j].timeUp);
          }
          data.push(res.data[p])
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
    var url = status == 'recommend' ? "product/getAllPromotionalProduct" :"product/getProducts";
    this.setData({
      state: status,
      getSortData: {
        value: status,
        op: "desc"
      },
      urlAjax: url,
      pageNum: 1,
      product: [],
      requestSwitch: true
    });
    this.page_request(url);
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
      name: options.promoterName,
      storephoto: options.storephoto,
      url: util.api.imgUrl
    });
    console.log(app.globalData)
    console.log(options.id)
    this.page_request(this.data.urlAjax);
  },
  onShow:function(){
    this.promptNum();
    if (app.getFilterData || app.searchValue) {
      console.log(11)
      this.setData({
        pageNum: 1,
        product: [],
        requestSwitch: true,
        code: app.searchValue ? app.searchValue : null,
        requeseName: app.searchValue ? app.searchValue : null,
        getFilterData: app.getFilterData ? app.getFilterData : undefined
      })
      this.page_request(this.data.urlAjax);
      app.searchValue = null;
    }
  },
  onUnload:function(){
    app.getFilterData = [];
  }
})
