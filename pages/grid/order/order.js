var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    ordertype:1,
    ordertype2:1,
    product:[],
    page:1,
    openid: 1,
    url:"order/getOrders",
    statusUrl:'order/orderOperate',
    loadMore: true,
    requestSwitch: true,
    logisticsModal: true,
    numberModal: true,
    expressModal: true,
    countNum:{}
  },
  // 一级标签切换
  ordertype:function(e){
    var num = e.target.dataset.ordertype;
    this.setData({
      ordertype : num,
      ordertype2: 1,
      page:1
    })
    this.order_request();
  },
   // 二级标签切换
  ordertype2:function(e){
    var num = e.target.dataset.ordertypetwo;
    this.setData({
      ordertype2: num,
      page: 1,
      requestSwitch:true
    })
    this.order_request();
  },
  // ajax请求
  order_request:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: this.data.url,
      data: {
        openid: this.data.openid,
        ordertype: this.data.ordertype,
        orderstatus: this.data.ordertype2,
        pageNum: this.data.page
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = that.data.product;
        var booleanre = that.data.requestSwitch;
        for (var p in res.data) {
          res.data[p].ordertime = util.toDate(res.data[p].ordertime)
        }
        if (that.data.page == 1) {
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
  // 订单操作
  changeOrderStatus:function(e){
     var orderInfo = e.target.dataset;
     var that = this;
     var param = {
       orderNo: orderInfo.orderno,
       operate: orderInfo.status,
       sellerstoreid: orderInfo.sellerstoreid,
       buyerstoreid: orderInfo.buyerstoreid,
       openid: 1
     };
     console.log(orderInfo)
     wx.showModal({
       title: '提示',
       content: '确定更改？',
       success: function (res) {
         if (res.confirm) {
           wx.showNavigationBarLoading();
           util.api.request({
             url: that.data.statusUrl,
             data: {
               orderNo: orderInfo.orderno,
               operate: orderInfo.status,
               sellerstoreid: orderInfo.sellerstoreid,
               buyerstoreid: orderInfo.buyerstoreid,
               openid: 1
             },
             method: 'POST',
             header: {
               'content-type': 'application/x-www-form-urlencoded'
             },
             success: function (res) {
               wx.hideNavigationBarLoading();
               wx.showToast({
                 title: '成功',
                 mask: true,
                 duration: 2000
               })
             }
           })
         }
       }
     })
    
  },
  // 加载订单列表页面汇总数量
  countOrders:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: "order/countOrders",
      data: {
        openid:1,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          countNum:res.data
        })
        
      }
    })
   
  },
  // 选物流模态框
  logisticsView: function () {
    this.setData({
      logisticsModal: false,
    })
  },
  // 关闭模态框
  cancel: function () {
    this.setData({
      logisticsModal: true,
      numberModal: true,
      expressModal: true,
   })
  },
  // 打开输入单号模态框
  numberView: function () {
    this.cancel()
    this.setData({
      numberModal: false,
    })
  },
  // 打开选快递公司模态框
  expressView: function () {
    this.cancel()
    this.setData({
      expressModal: false,
    })
  },
  //滚动到底部触发事件  
  onReachBottom: function () {
    console.log('到底不了')
    this.setData({
      page: this.data.page + 1,
      loadMore: false
    });
    console.log(this.data.page)
    if (this.data.requestSwitch) {
      this.order_request();
    }
  },
  onLoad:function(){
    this.order_request();
    this.countOrders();
  },
  onShow:function(){
    if (app.payOrderno){
      var product = this.data.product;
      var totole = this.data.countNum;
      console.log(app.payOrderno)
      for (var p in product){
        if (product[p].payorderno == app.payOrderno){
          product.splice(p,1);
          totole.pNoPayCount -=1; 
          totole.pNoShipCount += 1; 
          this.setData({
            product: product,
            countNum: totole
          })
          console.log(app.payOrderno)
          break;
        }
      }
      
      app.payOrderno = ""
    }
  }
})