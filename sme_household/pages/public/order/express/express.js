var util = require('../../../../utils/util.js')
var reg = require('../../../../utils/reg.js')
var app = getApp()
Page({
  data: {
    title:"快递单"
  },
  address: function (e) {
    var that = this
    wx.chooseAddress({
      success: function (res) {
        switch (e.currentTarget.dataset.type) {
          case ("consignee"):
            that.setData({
              "sender.address": res.detailInfo,
              "sender.mobile": res.telNumber,
              "sender.userName": res.userName,
              "sender.provinceName": res.provinceName ,
              "sender.cityName": res.cityName,
              "sender.countyName":res.countyName,
              "sender.postalCode": res.postalCode,
              "regobject.sender":{}
            })
            break;
          case ("deliver"):
            that.setData({
              "receiver.address": res.detailInfo,
              "receiver.mobile": res.telNumber,
              "receiver.userName": res.userName,
              "receiver.provinceName": res.provinceName,
              "receiver.cityName": res.cityName,
              "receiver.countyName": res.countyName,
              "receiver.postalCode": res.postalCode,
              "regobject.receiver": {}
            })
            break;
        }

      }
    })
  },
  // 请求数据
  logisticInit:function(){
    var that = this
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'order/logisticInit',
      data: {
        payorderno: that.data.orderNo,
        sellerstoreid: app.globalData.storeId,
        buyerstoreid: that.data.buyerstoreid,
        openid: app.globalData.openid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var sender = res.data[1]
        var receiver = res.data[0]
        console.log(sender.city)
        var sender_city = sender.city.split(',')
        var receiver_city = receiver.city.split(',')
        sender.provinceName = sender_city[0] == 'null' ? '' : sender_city[0]
        sender.cityName = sender_city[1] == 'null' ? '' : sender_city[1]
        sender.countyName = sender_city[2] == 'null' ? '' : sender_city[2]
        receiver.provinceName = receiver_city[0] == 'null' ? '' : receiver_city[0]
        receiver.cityName = receiver_city[1] == 'null' ? '' : receiver_city[1]
        receiver.countyName = receiver_city[2] == 'null' ? '' : receiver_city[2]
        sender.city
        that.setData({
          sender: res.data[1],
          receiver: res.data[0],
          item: res.data[2],
        })
      }
    })
  },
  // 正则验证
  reg: function (e) {
    var type = e.currentTarget.dataset.type;
    var name = e.currentTarget.dataset.name;
    var boolean = false;
    var regobject = "regobject." + type + '.' + name;
    var param = {};
    boolean = reg.iSnull(e.detail.value);
    param[regobject] = !boolean;
    this.setData(param)
  },
  // 提交表单
  expressSubmit: function (e) {
    var value = e.detail.value
    var sender = this.data.sender || {}
    var receiver = this.data.receiver || {}
    var regobject = {}
    regobject.sender = {}
    regobject.receiver = {}
    console.log(value)
    switch ('') {
      case (value.consigneeCompany):
        regobject.sender.company = true
        break;
      case (value.senderUserName):
        regobject.sender.contact = true
        break;
      case (value.senderMobile):
        regobject.sender.tel = true
        break;
      case (value.senderAddress):
        regobject.sender.address = true
        break;
      case (sender.cityName && sender.provinceName && sender.countyName):
        regobject.sender.city = true
        break;

      case (value.deliverCompany):
        regobject.receiver.company = true
        break;
      case (value.receiverUserName):
        regobject.receiver.contact = true
        break;
      case (value.receiverMobile):
        regobject.receiver.tel = true
        break;
      case (value.receiverAddress):
        regobject.receiver.address = true
        break;
      case (receiver.cityName && receiver.provinceName && receiver.countyName):
        regobject.receiver.city = true
        break;
      default:

        switch (this.data.logistics){
          case ('顺丰'):
            this.expressSF(e)
            break;
          case ('中通'):
            this.expressZTO(e)
            break;
          case ('韵达'):
            this.expressYD(e)
            break;
          case (''||undefined):
            wx.showToast({
              title: '您还没有选择快递公司',
            })
            break;
          default :
          wx.showToast({
            title: '暂不支持这种快递',
          })
        }
    }
    this.setData({
      regobject: regobject,
    })
  },
  // 提交快递单/顺丰
  expressSF:function(e){
    var that = this;
    var value = e.detail.value 
    var sender = this.data.sender || {}
    var receiver = this.data.receiver || {}

    var consigneeInfo = {}
    consigneeInfo.address = value.senderAddress
    consigneeInfo.city = sender.cityName
    consigneeInfo.company = value.consigneeCompany
    consigneeInfo.contact = sender.userName
    consigneeInfo.country = "中国"
    consigneeInfo.province = sender.provinceName
    consigneeInfo.tel = value.senderMobile
    consigneeInfo.shipperCode = sender.postalCode
    
    var deliverInfo = {}
    deliverInfo.address = receiver.address
    deliverInfo.city = receiver.cityName
    deliverInfo.company = value.deliverCompany
    deliverInfo.contact = receiver.userName
    deliverInfo.country = "中国"
    deliverInfo.province = receiver.provinceName
    deliverInfo.tel = receiver.mobile
    deliverInfo.shipperCode = receiver.postalCode

    var cargoInfo = {}
    cargoInfo.cargo = '衣物'
    cargoInfo.cargoAmount
    cargoInfo.cargoCount
    cargoInfo.cargoTotalWeight
    cargoInfo.cargoUnit
    cargoInfo.cargoWeight
    cargoInfo.parcelQuantity
    
    var object = {}
    object.consigneeInfo = consigneeInfo
    object.deliverInfo = deliverInfo
    object.cargoInfo = cargoInfo
    object.orderId = this.data.orderNo
    object.expressType = 2
    object.payMethod = 1
    object.isDoCall = 1
    object.isGenBillNo = 1
    console.log(object)
        wx.showNavigationBarLoading();
        util.api.request({
          url: 'logistic/orderSF',
          data: object,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.hideNavigationBarLoading();
            wx.showToast({
              title: res.head.message,
            })
          }
        })
  },
  expressZTO: function (e) {
    var value = e.detail.value
    var Sender = this.data.sender || {}
    var Receiver = this.data.receiver || {}

    var sender = {}
    sender.id = app.globalData.storeId
    sender.name = Sender.userName
    sender.company = value.consigneeCompany
    sender.mobile = Sender.mobile
    sender.prov = Sender.provinceName
    sender.city = Sender.cityName
    sender.county = Sender.countyName
    sender.address = Sender.address
    sender.zipcode = Sender.postalCode

    var receiver = {}
    receiver.id = that.data.buyerstoreid
    receiver.name = Receiver.userName
    receiver.company = value.deliverCompany
    receiver.mobile = Receiver.mobile
    receiver.prov = Receiver.provinceName
    receiver.city = Receiver.cityName
    receiver.county = Receiver.countyName
    receiver.address = Receiver.address
    receiver.zipcode = Receiver.postalCode

    var item = {}
    item.id//货品ID？订单号？
    item.name = value.name
    item.category//分类
    item.material//材质
    item.size//大小
    item.weight//重量（单位：克)
    item.unitprice//单价(单位:分)
    item.quantity//货品数量
    item.remark//货品备注

    var object = {}
    object.sender = sender
    object.receiver = receiver
    object.item = item
    object.type = 1
    object.status = 0
    object.partnerCode = this.data.orderNo
    object.sendstarttime = new Date(date())
    object.sendendtime = new Date(new Date().getTime() - (86400000 * 7))
    console.log(object)
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'logistic/createOrderToZTO',
      data: object,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: res.head.message,
        })
      }
    })

  },
  expressYD: function (e) {
    var value = e.detail.value
    var Sender = this.data.sender || {}
    var Receiver = this.data.receiver || {}

    var sender = {}
    sender.name = Sender.userName
    sender.company = value.consigneeCompany
    sender.mobile = Sender.mobile
    sender.city = Sender.provinceName + ',' + Sender.cityName + ',' + Sender.countyName
    sender.address = Sender.address
    sender.postcode = Sender.postalCode

    var receiver = {}
    receiver.name = Receiver.userName
    receiver.company = value.deliverCompany
    receiver.mobile = Receiver.mobile
    receiver.city = Receiver.provinceName + ',' + Receiver.cityName + ',' + Receiver.countyName
    receiver.address = Receiver.address
    receiver.zipcode = Receiver.postalCode

    var item = {}
    item.name = value.name

    var object = {}
    object.sender = sender
    object.receiver = receiver
    object.item = item
    object.orderid = this.data.orderNo
    object.sendstarttime = "2010-06-19 08:00:00"
    object.sendendtime = "2010-06-19 08:00:00"
    object.customerid = this.data.buyerstoreid
    console.log(object)
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'logistic/createOrderToYD',
      data: object,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: res.head.message,
        })
      }
    })

  },
  onLoad:function(e){
    this.setData({
      orderNo: e.orderNo,
      logistics: e.logistics,
      buyerstoreid: e.buyerstoreid,
    })
    this.logisticInit()
  }

})