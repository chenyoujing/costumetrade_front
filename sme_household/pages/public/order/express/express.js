var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    title:"快递单"
  },
  address: function (e) {
    var that = this
    wx.chooseAddress({
      success: function (res) {
        switch (e.target.dataset.type) {
          case ("consignee"):
            that.setData({
              address1: res
            })
            break;
          case ("deliver"):
            that.setData({
              address2: res
            })
            break;
        }
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  // 请求数据
  logisticInit:function(){
    var that = this
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'logistic/logisticInit',
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
        that.setData({
          product: res.data
        })
      }
    })
  },
  expressSubmit: function (e) {
    console.log(1)
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

  },
  // 提交快递单/顺丰
  expressSF:function(e){
    var that = this;
    var value = e.detail.value 
    var address1 = this.data.address1 || []
    var address2 = this.data.address2 || []
    var object = {}
    var consigneeInfo = {}
    consigneeInfo.address = address1.detailInfo
    consigneeInfo.city = address1.cityName
    consigneeInfo.company = value.consigneeCompany
    consigneeInfo.contact = address1.userName
    consigneeInfo.country = "中国"
    consigneeInfo.province = address1.provinceName
    consigneeInfo.tel = address1.telNumber
    consigneeInfo.shipperCode = address1.postalCode
    
    var deliverInfo = {}
    deliverInfo.address = address2.detailInfo
    deliverInfo.city = address2.cityName
    deliverInfo.company = value.deliverCompany
    deliverInfo.contact = address2.userName
    deliverInfo.country = "中国"
    deliverInfo.province = address2.provinceName
    deliverInfo.tel = address2.telNumber
    deliverInfo.shipperCode = address2.postalCode

    var cargoInfo = {}
    cargoInfo.cargo = '衣物'
    cargoInfo.cargoAmount
    cargoInfo.cargoCount
    cargoInfo.cargoTotalWeight
    cargoInfo.cargoUnit
    cargoInfo.cargoWeight
    cargoInfo.parcelQuantity
    
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
    var address1 = this.data.address1 || []
    var address2 = this.data.address2 || []

    var sender = {}
    sender.id//发件人在合作商平台中的ID号？？
    sender.name = address1.userName
    sender.company = value.consigneeCompany
    sender.mobile = address1.telNumber
    sender.prov = address1.provinceName
    sender.city = address1.cityName
    sender.county = address1.countyName
    sender.address = address1.detailInfo
    sender.zipcode = address1.postalCode

    var receiver = {}
    receiver.id//收件人在合作商平台中的ID号？？
    receiver.name = address2.userName
    receiver.company = value.deliverCompany
    receiver.mobile = address2.telNumber
    receiver.prov = address2.provinceName
    receiver.city = address2.cityName
    receiver.county = address2.countyName
    receiver.address = address2.detailInfo
    receiver.zipcode = address2.postalCode

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
    object.sendstarttime//取件起始时间
    object.sendendtime//取件截止时间
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
    var address1 = this.data.address1 || []
    var address2 = this.data.address2 || []

    var sender = {}
    sender.name = address1.userName
    sender.company = value.consigneeCompany
    sender.mobile = address1.telNumber
    sender.city = address1.provinceName + ',' + address1.cityName + ',' + address1.countyName
    sender.address = address1.detailInfo
    sender.postcode = address1.postalCode

    var receiver = {}
    receiver.name = address2.userName
    receiver.company = value.deliverCompany
    receiver.mobile = address2.telNumber
    receiver.city = address2.provinceName + ',' + address2.cityName + ',' + address2.countyName
    receiver.address = address2.detailInfo
    receiver.zipcode = address2.postalCode

    var item = {}
    item.name = value.name

    var object = {}
    object.sender = sender
    object.receiver = receiver
    object.item = item
    object.orderid = this.data.orderNo
    object.sendstarttime//取件起始时间
    object.sendendtime//取件截止时间
    object.customerid//客户id
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