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
    countNum:{},
    collectModal:true,
    colloctNum:0,
    incomeData:{},
    selectLogistics:{},
    logisticsCompany:[],
    logisticsno:'',
    logisticsname:'顺丰',
    logisticsname_index:0
  },
  goto_info: function (e) {
    app.infotype = e.target.dataset.infotype
    wx.switchTab({
      url: '../info/info',
    })
  },
  EventHandle:function(e){
    this.setData({
      logisticsno:e.detail.value
    })
  },
  bindSelectorChange:function(e){
    var style = e.currentTarget.dataset.style;
    var param = this.data.logisticsCompany;
    var logisticsname = this.data.logisticsCompany[e.detail.value].id;
        this.setData({
          grade_index: e.detail.value,
          logisticsname_index: logisticsname
        })

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
  // 更改汇总图标
  changecountOrders:function(status,type){
    console.log(status)
    console.log(status == "2")
    var totole = this.data.countNum;
    switch (status){
      case 2:
       if(type=="buy"){
         totole.pNoPayCount -= 1;
         totole.pNoShipCount += 1; 
       }else{
         totole.sNoPayCount -= 1;
         totole.sNoAuditCount += 1; 
       }
         break;
      case '3':
        console.log(totole)
        console.log(11)
        totole.sNoAuditCount -= 1;
        totole.sNoShipCount += 1;
        break;
      case '4':
        totole.sNoShipCount -= 1;
        break;
      case '5':
        totole.pNoReceiptCount -= 1;
        break;
      case '6':
        if (this.data.ordertype == 2 && this.data.ordertype2 == 1){
          totole.sNoPayCount -= 1;
        } else if (this.data.ordertype == 2 && this.data.ordertype4 == 1){
          totole.sNoAuditCount -= 1;
        }
        break;
    }
    this.setData({
      countNum:totole
    })
  },
  // 订单操作请求
  ajaxChange:function(data){
    console.log('res.code')
    var that= this;
    var fliter = {
      orderNo: data.orderno,
      operate: data.status,
      sellerstoreid: data.sellerstoreid,
      buyerstoreid: data.buyerstoreid,
      openid: 1
    };
    if (data.isContinue){
      fliter.isContinue = true;
    }
    wx.showNavigationBarLoading();
    util.api.request({
      url: that.data.statusUrl,
      data: fliter,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (data.status == "3" && res.data == 1013) {
          data.isContinue = true;
          wx.showModal({
            title: '提示',
            content: '缺少库存,是否继续操作?',
            success: function (res) {
              if (res.confirm) {
                that.ajaxChange(data);
                that.changecountOrders(data.status, null)                
              }
            }
          })
        } else {
          if (data.status !== "3"){
            that.changecountOrders(data.status, null)
          }
          var product = that.data.product;
          for (var p in product) {
            if (product[p].payorderno == data.orderno) {
              product.splice(p, 1);
              that.setData({
                product: product
              })
              break;
            }
          }
          wx.showToast({
            title: '成功',
            mask: true,
            duration: 2000
          })
        }
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
           that.ajaxChange(orderInfo);
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
  // 付款模态框
  collectView: function (e) {
    var orderInfo = e.target.dataset;
    var that = this;
    var param = {
      orderNo: orderInfo.orderno,
      operate: orderInfo.status,
      sellerstoreid: orderInfo.sellerstoreid,
      buyerstoreid: orderInfo.buyerstoreid,
      openid: 1
    };
    this.setData({
      colloctNum: orderInfo.debet,
      collectModal: false,
      incomeData: param
    });
    console.log(orderInfo.debet)
  },
  // 收款确定按钮
  sureCollect:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
    url: 'order/orderPay',
      data: {
        orderno: that.data.incomeData.orderNo,
        operate: that.data.incomeData.operate,
        buyerid: that.data.incomeData.buyerstoreid,
        sellerid: that.data.incomeData.sellerstoreid,
        openid: 1,
        income: that.data.colloctNum
      },
      method: 'POST',
      header: {
         'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
         wx.hideNavigationBarLoading();
         var product = that.data.product;
         that.changecountOrders(2,'sal')
          for(var p in product){
              console.log(product[p].payorderno)
              if (product[p].payorderno == that.data.incomeData.orderNo){
                product.splice(p,1);
                that.setData({
                  product: product
                })
                break;
              }
            }
         that.setData({
           collectModal: true
         })
         wx.showToast({
            title: '成功',
            mask: true,
            duration: 2000
         })
      }
    })  
  },
  SureLogicson:function(){
    if (this.data.logisticsno){
      this.ajaxLogicson()
    }else{
      wx.showToast({
        title: '请输入物流单号',
        mask: true,
        duration: 2000
      })
    }
  },
  // 确认物流
  ajaxLogicson: function () {
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url:'order/confirmLogistic',
       data: {
         orderNo: this.data.selectLogistics.orderNo,
         logisticstype: this.data.selectLogistics.logisticstype,
        logisticsno: this.data.logisticsno,
        logisticsname: this.data.logisticsname,
        storeid: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.navigateTo({
          url: "express/express"
        })
        console.log(res)
        that.setData({
          numberModal: true
        })
      }
    })
  },
  // 选物流模态框
  logisticsView: function (e) {
    var selectLogistics = {};
    selectLogistics.logisticstype = e.target.dataset.logisticstype;
    selectLogistics.orderNo = e.target.dataset.payorderno;
    this.setData({
      logisticsModal: false,
      selectLogistics: selectLogistics
    })
  },
  // 关闭模态框
  cancel: function () {
    this.setData({
      logisticsModal: true,
      numberModal: true,
      expressModal: true,
      collectModal:true
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
      console.log(app.payOrderno)
      for (var p in product){
        if (product[p].payorderno == app.payOrderno){
          product.splice(p,1);
          this.changecountOrders(2,'buy')
          this.setData({
            product: product
          })
          console.log(app.payOrderno)
          break;
        }
      }
      
      app.payOrderno = ""
    }
  }
})