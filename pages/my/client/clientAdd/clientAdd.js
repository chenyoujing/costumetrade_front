var util = require('../../../../utils/util.js')
var app = getApp()
Page({

  data: {
    type_index:'0',
    title:''
  },
  // 标题内容
  client_add_title: function (client, clientId){
    var title1 = ''
    var title2 = ''
    var title3 = ''
    if (clientId){
      title3 = '信息'
    }else{
      title1 = '添加'
    }
    switch (client){
      case '1':
        title2 = '客户'
        break;
      case '2':
        title2 = '供应商'
        break;
      case '3':
        title2 = '朋友'
        break;
    }
    this.setData({
      title: title1 + title2 + title3
    })
  },
  // 客户等级查询
  initCustomer:function(){
    var that = this
    util.api.request({
      url:'client/initCustomer',
      data: {
        storeId: 1,
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          initCustomerList: res.data
        })
      }
    })
  },
  // 修改客户界面查询
  getClient: function (clientId){
    var that = this
    util.api.request({
      url: 'client/getClient',
      data: {
        clientId: clientId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          CustomerInfo: res.data
        })
      }
    })

  },
  
  // 修改，添加客户
  saveClient:function(e){
    var that = this
    var object = e.detail.value
    if (this.data.clientId){
      object.clientId = this.data.clientId
    }
    object.type = this.data.client
    object.telephone = '0571-12345678'
    object.cate = this.data.initCustomerList[this.data.type_index].id
    console.log(object)
    util.api.request({
      url: 'client/saveClient',
      data: object,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  // 选择客户类型
  bindSelectorChange:function(e){
    this.setData({
      type_index: e.detail.value
    })
  },
  // 剪贴板
  Clipboard:function(){
    wx.setClipboardData({
      data: "wechatNumber",
      success: function (res) {
        wx.showModal({
          title: '微信号已复制',
          content: "name" + '的微信号' + "wechatNumber" + '已复制，您可到微信中直接黏贴，添加'+"name"+'为好友',
          showCancel:false,
          confirmText:'我知道了',
        })
      }
    })
  },
  // 地址？
  address:function(){
    wx.chooseAddress({
      success: function (res) {
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
  onLoad: function (e) {
    this.initCustomer()
    this.client_add_title(e.client, e.clientId)
    this.setData({
      client: e.client,
      clientId: e.clientId
    })
  },
})