var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
    id:'',
    title:'',
    product:[],
    sequenceNum:null,
    sellers_index:0,
  },
  // 返回
  backdelta:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 点击更改改变库存
  uploadStock:function(e){
    var num = e.target.dataset.id;
    this.setData({
      sequenceNum: num
    })
  },
  //失去焦点
  bindblurInput:function(e){
    var value = e.detail.value;
    if (value.length > 0) {
      console.log(value.length);
      var num = e.target.dataset.id;
      var param = this.data.product;
      for (var p in param) {
        if (param[p].id == num) {
          param[p].stocknum = value; 
          param[p].update = true;
          break;
        }
      }
      this.setData({
        product: param,
        sequenceNum:null
      })
    }else{
      this.setData({
        sequenceNum: null
      })
    }
  },
  // 选择供货商
  sellers:function(){
    if (this.data.sellers_scroll_active){
      var active = ""
    }else{
      var active = "sellers_scroll_active"
    }
    this.setData({
      sellers_scroll_active: active
    })
  },
  sellers_cover:function(){
    this.setData({
      sellers_scroll_active: ""
    })
  },
  sellers_select:function(e){
    this.setData({
      sellers_index: e.currentTarget.dataset.index
    })
  },
  // 请求库存
  stock_request:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/takingStock',
      data: {
        storeId: app.globalData.storeId,
        id:that.data.id
      },
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          product: res.data.stocks,
          sellers: res.data.sellers
        })
      }
    })
  },
  // 相应的跳转
  skipUrl: function (e) {
    var id = this.data.id;
    var store = this.data.sellers[this.data.sellers_index]
    var url = "";
    if (this.data.clientType == 1) {
      url = "../../openOrder/openOrder?id=" + id + '&ClientData=true'
    } else {
      if (store){
        url = "../../../grid/shop/goods_detail/goods_detail?strod=" + store.sellerstoreid + "&ID=" + id + '&ClientData=true'
      }else{
        wx.showToast({
          title: '该货品没有供货商',
        })
      }
    };
    if(url){
      wx.navigateTo({
        url: url
      })
    }
  },
  // 点击保存
  saveStock:function(){
    var array = [];
    var that = this;
    for (var p in this.data.product){
      if (this.data.product[p].update){
        array.push({
          storeid: this.data.product[p].storeid,
          id: this.data.product[p].id,
          productid: this.data.product[p].productid,
          stocknum: this.data.product[p].stocknum
        });
      }
    }
    console.log(JSON.stringify(array))
    if (array.length>0){
      util.api.request({
        url: 'product/updateStock',
        data: array,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '更改成功',
            mask: true,
            duration: 2000
          })
        }
      })
    }else{
      wx.showToast({
        title: '没有更改',
        mask: true,
        duration: 2000
      })
    }
   
  },
  onLoad(options){
    this.setData({
      id: options.ID,
      title: options.title
    });
    this.stock_request();
  }
})