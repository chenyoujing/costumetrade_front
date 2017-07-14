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
  // 提交快递单
  expressSubmit:function(e){
    var that = this;
    var value = e.detail.value 
    var address1 = this.data.address1 ? this.data.address1 : ''
    var address2 = this.data.address2 ? this.data.address2 : ''
    var object = {}
    var consigneeInfo = {}
    consigneeInfo.address = address1.detailInfo
    consigneeInfo.city = address1.cityName
    consigneeInfo.company = value.consigneeCompany
    consigneeInfo.contact = address1.userName
    consigneeInfo.country = address1.countyName
    consigneeInfo.province = address1.provinceName
    consigneeInfo.tel = address1.telNumber
    consigneeInfo.shipperCode = address1.nationalCode
    
    var deliverInfo = {}
    deliverInfo.address = address2.detailInfo
    deliverInfo.city = address2.cityName
    deliverInfo.company = value.consigneeCompany
    deliverInfo.contact = address2.userName
    deliverInfo.country = address2.countyName
    deliverInfo.province = address2.provinceName
    deliverInfo.tel = address2.telNumber
    deliverInfo.shipperCode = address2.nationalCode

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
  onLoad:function(e){
    this.setData({
      orderNo: e.orderNo
    })
  }

})