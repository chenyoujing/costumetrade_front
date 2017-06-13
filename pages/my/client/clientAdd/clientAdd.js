var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    type_index:'0',
    title:'',
    client:'',
    clientId:'',
    scanModal:true,
  },
  // 标题内容
  client_add_title: function (){
    var client = this.data.client
    var clientId = this.data.clientId
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
      title: title1 + title2 + title3
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
    if (reg.test(object.remarkName) != true) {
      wx.showToast({
        title: '不可输入特殊符号',
        duration: 2000
      })
      boolean = false;
    }
    if (!object.remarkName && !object.reallyName && !object.nickName) {
      wx.showToast({
        title: '昵称、真实姓名、备注名称必须存在一个',
        duration: 2000
      })
      boolean = false;
    }
    if (boolean){
      //判断id，是上传还是修改
      if (this.data.clientId){
        object.id = this.data.clientId
      }else{
        object.id = this.data.id || util.api.DateFormat(new Date())
      }
      // 备注名如果为空值为null
      object.remarkName = this.null(object.remarkName)
      object.reallyName = this.null(object.reallyName)
      object.nickName = this.null(object.nickName)
      object.storeId = 1
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
          if(that.data.clientId){
            var title = '修改'
          }else{
            var title = '添加'
          }
          wx.showToast({
            title: title+'成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
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
      initCustomerList: app.custProdPriceList
    })
    if (e.clientId){
      this.getClient()
    }else{
      this.setData({
        CustomerInfo: app.addCustomerInfo
      })
    }
    this.client_add_title()

  },
})