var util = require('../../../../utils/util.js')
var reg = require('../../../../utils/reg.js')
var app = getApp()
Page({
  data: {
    title:"快递单",
    sender: {},
    receiver: {},
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
              "sender.name": res.userName,
              "sender.prov": res.provinceName ,
              "sender.cityName": res.cityName,
              "sender.county":res.countyName,
              "sender.postCode": res.postalCode,
              "regobject.sender":{}
            })
            break;
          case ("deliver"):
            that.setData({
              "receiver.address": res.detailInfo,
              "receiver.mobile": res.telNumber,
              "receiver.name": res.userName,
              "receiver.prov": res.provinceName,
              "receiver.cityName": res.cityName,
              "receiver.county": res.countyName,
              "receiver.postCode": res.postalCode,
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
        console.log(res.data)
        var sender_city = sender.city.split(',')
        var receiver_city = receiver.city.split(',')
        sender.prov = sender_city[0] == 'null' ? '' : sender_city[0]
        sender.cityName = sender_city[1] == 'null' ? '' : sender_city[1]
        sender.county = sender_city[2] == 'null' ? '' : sender_city[2]
        receiver.prov = receiver_city[0] == 'null' ? '' : receiver_city[0]
        receiver.cityName = receiver_city[1] == 'null' ? '' : receiver_city[1]
        receiver.county = receiver_city[2] == 'null' ? '' : receiver_city[2]
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
  // 打印快递单
  print: function (e){
    var that = this
    var value = e.detail.value
    var Sender = this.data.sender || {}
    var Receiver = this.data.receiver || {}
    
    var sender = {}
    sender.id = app.globalData.storeId
    sender.name = value.senderName
    sender.company = value.consigneeCompany
    sender.mobile = value.senderMobile
    sender.prov = Sender.prov
    sender.city = Sender.cityName
    sender.county = Sender.county
    sender.address = value.senderAddress
    // sender.zipcode = Sender.postCode

    var receiver = {}
    receiver.id = that.data.buyerstoreid
    receiver.name = value.receiverName
    receiver.company = value.deliverCompany
    receiver.mobile = value.receiverMobile
    receiver.prov = Receiver.prov
    receiver.city = Receiver.cityName
    receiver.county = Receiver.county
    receiver.address = value.receiverAddress
    // receiver.zipcode = Receiver.postCode

    var data = {
      sender: sender,
      receiver: receiver,
      orderId: this.data.orderNo,
      cargo: value.name,
      logistics: this.data.logistics,
      nowStr: util.formatTime(new Date()),
    }

    data = JSON.stringify(data)
    console.log(data)
    util.api.request({
      url: 'print/printer',
      data: {
        storeId: app.globalData.storeId,
        data: data,
        reportName: "快递"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '打印成功',
        })
      }
    })

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
      case (value.senderName):
        regobject.sender.contact = true
        break;
      case (value.senderMobile):
        regobject.sender.tel = true
        break;
      case (value.senderAddress):
        regobject.sender.address = true
        break;
      case (sender.cityName && sender.prov && sender.county):
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
      case (receiver.cityName && receiver.prov && receiver.county):
        regobject.receiver.city = true
        break;
      default:
        if (e.detail.target.dataset.type =="print"){
          this.print(e)
        }else{
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
    consigneeInfo.contact = value.senderName
    consigneeInfo.county = sender.county
    consigneeInfo.country = "中国"
    consigneeInfo.province = sender.prov
    consigneeInfo.tel = value.senderMobile
    consigneeInfo.shipperCode = sender.postCode
    
    var deliverInfo = {}
    deliverInfo.address = receiver.address
    deliverInfo.city = receiver.cityName
    deliverInfo.company = value.deliverCompany
    deliverInfo.contact = receiver.name
    deliverInfo.county = receiver.county
    deliverInfo.country = "中国"
    deliverInfo.province = receiver.prov
    deliverInfo.tel = receiver.mobile
    deliverInfo.shipperCode = receiver.postCode

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
    object.expressType = 1
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
              title: res.msg,
            })
          }
        })
  },
  expressZTO: function (e) {
    var that = this
    var value = e.detail.value
    var Sender = this.data.sender || {}
    var Receiver = this.data.receiver || {}

    var sender = {}
    sender.id = app.globalData.storeId
    sender.name = value.senderName
    sender.company = value.consigneeCompany
    sender.mobile = value.senderMobile
    sender.prov = Sender.prov
    sender.city = Sender.cityName
    sender.county = Sender.county
    sender.address = value.senderAddress
    sender.zipcode = Sender.postCode

    var receiver = {}
    receiver.id = that.data.buyerstoreid
    receiver.name = value.receiverName
    receiver.company = value.deliverCompany
    receiver.mobile = value.receiverMobile
    receiver.prov = Receiver.prov
    receiver.city = Receiver.cityName
    receiver.county = Receiver.county
    receiver.address = value.receiverAddress
    receiver.zipcode = Receiver.postCode

    var item = {}
    item.id = 1//货品ID？订单号？
    item.name = value.name
    item.category = 1//分类
    item.material = 1//材质
    item.size = 1//大小
    item.weight = 1//重量（单位：克)
    item.unitprice = 1//单价(单位:分)
    item.quantity = 1//货品数量
    item.remark = 1//货品备注

    var object = {}
    object.sender = sender
    object.receiver = receiver
    object.item = item
    object.type = 1
    object.status = 0
    object.partnerCode = this.data.orderNo
    object.sendstarttime = "2010-06-19 08:00:00"
    object.sendendtime = "2010-06-19 08:00:00"
    object.tradeId = 1
    object.mailNo = 1
    object.siteName = 1
    object.weight = 1
    object.size = 1
    object.quantity = 1
    object.price = 1
    object.freight = 1
    object.premium = 1
    object.packCharges = 1
    object.otherCharges = 1
    object.orderSum = 1
    object.collectMoneytype = 1
    object.collectSum = 1
    object.remark = 1
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
          title: res.msg,
        })
      }
    })

  },
  expressYD: function (e) {
    var value = e.detail.value
    var Sender = this.data.sender || {}
    var Receiver = this.data.receiver || {}

    var sender = {}
    sender.name = value.senderName
    sender.company = value.consigneeCompany
    sender.mobile = value.senderMobile
    sender.city = Sender.prov + ',' + Sender.cityName + ',' + Sender.county
    sender.address = value.senderAddress
    sender.postcode = Sender.postCode

    var receiver = {}
    receiver.name = value.receiverName
    receiver.company = value.deliverCompany
    receiver.mobile = value.receiverMobile
    receiver.city = Receiver.prov + ',' + Receiver.cityName + ',' + Receiver.county
    receiver.address = value.receiverAddress
    receiver.zipcode = Receiver.postCode

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
          title: res.msg,
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