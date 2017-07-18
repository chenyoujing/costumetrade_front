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
    logisticsname_index:0,
    logisticFees:[],
    updateModal:true,
  },
  EventHandle:function(e){
    this.setData({
      logisticsno:e.detail.value
    })
  },
  // 扫物流单号
  logistics_sacn:function(){
    var that = this
    wx.scanCode({
      success: (res) => {
        that.setData({
          logisticsno: res.result
        })
      }
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
    var num = e.currentTarget.dataset.ordertype;
    var ordertype2
    if (num == 1) {
      ordertype2 = 1
    }else if (num == 2) {
      ordertype2 = 4
    }
    this.setData({
      ordertype : num,
      ordertype2: ordertype2,
      page:1
    })
    this.order_request();
  },
   // 二级标签切换
  ordertype2:function(e){
    var num = e.currentTarget.dataset.ordertypetwo;
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
        openid: app.globalData.openid,
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
          res.data[p].ordertime = util.toDate(res.data[p].ordertime);
          if (res.data[p].debetamt > 0){
            res.data[p].debetText = "收付款"
          }
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
       }
         break;
      case '3':
        totole.sNoShipCount += 1;
        totole.sNoAuditCount -= 1;
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
      case "8":
        totole.sNoPayCount -= 1;
        totole.sNoAuditCount += 1;
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
      openid: app.globalData.openid
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
        if (data.status == "3" && res.data == "1013") {
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
        } else if (res.data == 1018) {
          wx.showToast({
            title: res.msg,
          })
        }else{
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
  // 修改
  updateOrder:function(){
    var that = this;
    var order = {}
    var stoDetails = {}
    for (var p in this.data.product){
      if (this.data.product[p].payorderno == this.data.payorderno){
        order.payorderno = this.data.product[p].payorderno
        order.sellerstoreid = this.data.product[p].sellerstoreid
        order.buyerstoreid = this.data.product[p].buyerstoreid
        order.logisticsCode = this.data.product[p].logisticsCode  
        order.paycate1 = that.data.paycact[that.data.payInfo.paycact_index1] ? that.data.paycact[that.data.payInfo.paycact_index1].dictValue : null
        order.paycost1 = that.data.payInfo.payCost1
        order.paycate2 = that.data.paycact[that.data.payInfo.paycact_index2] ? that.data.paycact[that.data.payInfo.paycact_index2].dictValue : null
        order.paycost2 = that.data.payInfo.payCost2 
        order.debetamt = that.data.payInfo.debetamt  
        stoDetails.id = this.data.product[p].id
        stoDetails.price = that.data.update_price
      }
    }
    var object = {}
    object.openid = app.globalData.openid
    object.order = order
    object.stoDetails = stoDetails
    console.log(object)
    wx.showNavigationBarLoading();
    util.api.request({
      url: "order/updateOrder",
      data: object,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        for (var p in that.data.product) {
          if (that.data.product[p].payorderno == that.data.payorderno) {
            that.data.product[p].paycate1 = order.paycate1
            that.data.product[p].paycost1 = order.paycost1
            that.data.product[p].paycate2 = order.paycate2
            that.data.product[p].paycost2 = order.paycost2
            that.data.product[p].debetamt = order.debetamt
          }
        }
        that.setData({
          product: that.data.product
        })
        that.cancel()
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
       openid: app.globalData.openid
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
        openid: app.globalData.openid,
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
      openid: app.globalData.openid
    };
    this.setData({
      colloctNum: orderInfo.debet,
      collectModal: false,
      incomeData: param
    });
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
        openid: app.globalData.openid,
        income: that.data.colloctNum
      },
      method: 'POST',
      header: {
         'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
         wx.hideNavigationBarLoading();
         var product = that.data.product;
         that.changecountOrders(2,'sal');
         for (var p in product){
           if (product[p].payorderno == that.data.incomeData.orderNo){
             product[p].debetText = "已收款";
             product[p].debetamt = Number(product[p].debetamt) - Number(that.data.colloctNum);
             product[p].debeButton = true; 
           }
         }
         that.setData({
           collectModal: true,
           product: product
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
  // 打开“销售-全部-修改”模态框
  updateModal:function(e){
    var that = this
    var payorderno = e.target.dataset.no
    for (var p in that.data.product) {
      if (that.data.product[p].payorderno == payorderno) {
        for (var j in that.data.paycact) {
          if (that.data.product[p].paycate1 == that.data.paycact[j].dictValue) {
            var paycact_index1 = j
          }
          if (that.data.product[p].paycate2 == that.data.paycact[j].dictValue) {
            var paycact_index2 = j
          }
        }
        var payInfo = {
          paycact_index1: paycact_index1 || null,
          paycact_index2: paycact_index2 || null,
          payCost1: that.data.product[p].paycost1,
          payCost2: that.data.product[p].paycost2,
          totalamt: that.data.product[p].totalamt,
          debetamt: that.data.product[p].debetamt
        }
      }
    }
    this.setData({
      updateModal: false,
      payInfo: payInfo,
      payorderno: payorderno
    })
  },
  // 清零
  clear: function (e) {
    var num = e.target.dataset.num;
    var type = e.target.dataset.type;
    var payInfo = this.data.payInfo;
    payInfo.debetamt = (parseInt(num) + parseInt(payInfo.debetamt)).toFixed(2);
    if (payInfo.debetamt > parseInt(payInfo.totalamt)) {
      payInfo.debetamt = payInfo.totalamt;
    }
    payInfo[type] = "";
    this.setData({
      payInfo: payInfo
    });
  },
  changePaycost: function (e) {
    var type = e.target.dataset.type;
    var payInfo = this.data.payInfo;
    payInfo[type] = e.detail.value;
    if (type == 'payCost2' && payInfo['debetamt'] == 0) {
      payInfo.payCost1 = (payInfo.totalamt - e.detail.value).toFixed(2);
    };
    this.setData({
        payInfo: payInfo
      });
    this.debet()
  },
  debet: function () {
    var payInfo = this.data.payInfo;
    payInfo.debetamt = (payInfo.totalamt - (payInfo.payCost1 || 0) - (payInfo.payCost2||0)).toFixed(2);
    if (payInfo.debetamt < 0 && payInfo.totalamt >= 0) {
      payInfo.debetamt = 0;
    }
    this.setData({
      payInfo: payInfo,
    })
  },
  // 关闭模态框
  cancel: function () {
    this.setData({
      logisticsModal: true,
      numberModal: true,
      expressModal: true,
      collectModal:true,
      updateModal: true,
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
  // 销售-全部-修改
  paycactPicker: function (e) {
    switch (e.target.dataset.paycate){
      case ('paycate1'):
        this.setData({
          "payInfo.paycact_index1": e.detail.value,
        })
        break;
      case ('paycate2'):
        this.setData({
          "payInfo.paycact_index2": e.detail.value,
        })
        break;
    }
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
  // 更改标题
  changeTitle: function () {
    var that = this;
    var title = that.data.ordertype == 1 ?"采购单":"销售单";
    wx.setNavigationBarTitle({
      title: title
    })
  },
  onLoad:function(e){
    if (!app.logisticFees && app.globalData.userIdentity !== 2){
      util.api.getProductInit()
    }
    this.setData({
      logisticFees: app.logisticFees,
      paycact: app.payTypeList,
      openid:app.globalData.openid,
      ordertype: e.ordertype,
      ordertype2: e.ordertype2 || 1,
      shopkeeper: e.shopkeeper
    })
    this.order_request();
    this.countOrders();
    this.changeTitle()
    console.log(app.logisticFees)
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
  },
  onHide:function(){
    this.cancel()
  }
})