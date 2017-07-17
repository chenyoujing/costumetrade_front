var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    type_index:0,
    title:'',
    client:'',
    clientId:'',
  },
  // 标题内容
  client_add_title: function (){
    var client = this.data.client
    var title2 = ''
    switch (client){
      case '1':
        title2 = '客户';
        break;
      case '2':
        title2 = '供应商';
        break;
      case '3':
        title2 = '朋友';
        break;
    }
    this.setData({
      title: "修改" + title2 + "信息"
    })
  },
  // 修改客户界面查询
  getClient: function (){
    var that = this
    wx.showNavigationBarLoading()
    var clientId = this.data.clientId
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
        wx.hideNavigationBarLoading();
        for (var p in that.data.initCustomerList){
          if (that.data.initCustomerList[p].id == res.data.cate){
            that.setData({
              type_index: p
            })
          }
        }
        that.setData({
          CustomerInfo: res.data
        })
      }
    })

  },
  // 备注名如果为空值为null
  null:function(name){
    if (!name) {
      name = null
    }
    return name
  },
  // 修改，添加客户
  saveClient:function(e){
    var reg = /^[A-Za-z0-9\u4e00-\u9fa5]*$/
    var that = this
    var object = e.detail.value
    var boolean = true;
    boolean = util.api.regular(object.remarkName, reg, '不可输入特殊符号')
    if (!object.remarkName && !object.reallyName && !object.nickName) {
      wx.showToast({
        title: '昵称、真实姓名、备注名称必须存在一个',
      })
      boolean = false;
    }
    if (boolean){
      // 备注名如果为空值为null
      object.id = this.data.clientId
      object.remarkName = this.null(object.remarkName)
      object.reallyName = this.null(object.reallyName)
      object.nickName = this.null(object.nickName)
      object.storeId = app.globalData.storeId
      object.type = this.data.client
      object.cate = this.data.initCustomerList[this.data.type_index].id
      console.log(object)
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'client/saveClient',
        data: object,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          util.api.updataStorage(object, that.data.client)
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          if (that.data.openOrder){
            res.data.name = res.data.remarkName || res.data.name || res.data.nickName;
            app.selectName = res.data;
          }
          setTimeout(() => {
            wx.navigateBack({
              delta: that.data.openOrder?2:1
            })
          }, 2000)
        }
      })
    }
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
    var that = this
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          "CustomerInfo.remarkName": res.userName,
          "CustomerInfo.phoneBack": res.telNumber,
          "CustomerInfo.addressBack": res.detailInfo,
          "CustomerInfo.province": res.provinceName,        
          "CustomerInfo.city": res.cityName,        
          "CustomerInfo.district": res.countyName,        
        })
      }
    })

  },
  onLoad: function (e) {
    this.setData({
      client: e.client,
      clientId: e.clientId,
      initCustomerList: app.custProdPriceList,
      scan: e.scan||"",
      openOrder: e.openOrder||""
    })
    if (!this.data.scan){
      this.getClient()
    }else{
      this.setData({
        CustomerInfo: app.addCustomerInfo
      })
    }
    console.log(e.client)
    this.client_add_title()
  },
})