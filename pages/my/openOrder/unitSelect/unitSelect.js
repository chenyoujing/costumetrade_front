var util = require('../../../../utils/util.js')
var app = getApp()
Page({
   data: {
     title:"客户",
     product:[],
     type:1, 
    contacts: [],
    nameSearch:"",
    supplier_type:'A',
    nav_right: ['↑', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#',],
    scanModal: true,
  },
  supplier_select:function(e){
    let data = e.target.dataset
    this.setData({
      supplier_type: data.type
    })
  },
  // 拆分助记码
  classifyFastcode:function(product){
    var contacts = [];
    for(var p in product){
      var boolean2 = true;
      for(var j in contacts){
        if (contacts[j].type == product[p].fastcode && product[p].fastcode !== undefined){
          contacts[j].value.push(product[p]);
          boolean2 = false;
          break;
        }
      }
      if(boolean2){
        var value = [];
        value.push(product[p])
        contacts.push({
          type: product[p].fastcode,
          value: value
        })
      }
    }
    contacts = contacts.sort(util.api.by('type'));
    console.log(contacts)
    this.setData({
      contacts: contacts
    })
  },
  selectName:function(e){
    app.selectName = e.target.dataset;
    console.log(app.selectName)
    wx.navigateBack({
      delta: 1,
    })
  },
  callback:function(){
    var that = this;
    wx.getStorage({
      key: 'UnitData' + that.data.type,
      complete: function (res) {
        that.setData({
          product: res.data
        })
       
        that.classifyFastcode(res.data)
      }
    })
  },
  // 客户筛选信息
  search:function(e){
    console.log(e.detail.value.length)
    if (e.detail.value == "" || e.detail.value == " ") {
      this.callback()
    } else {
      console.log(this.data.product)
      var endArray4 = util.api.objectPushArry(this.data.product, e.detail.value)
      this.setData({
        product: endArray4
      })
      console.log(endArray4)
      this.classifyFastcode(endArray4)
    }
  },
  downData: function (type) {
    util.api.supplierRefresh('client/getClients', "UnitData", 'updataTimeunit', this.callback);
  },
  // 获取二维码/添加客户、供应商
  scan: function (e) {
    this.setData({
      scanModal: false,
    })
    let data = e.target.dataset
    var client = this.data.type
    var that = this
    var id = util.api.DateFormat(new Date())
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/scanQRCode',
      data: {
        type: client,
        storeId: "1",
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          scan: res.data,
          id: id
        })
      }
    })
  },
  // 关闭扫码模态框
  cancel: function () {
    this.setData({
      scanModal: true
    })
  },
  // 扫好了
  confirm: function () {
    var that = this
    wx.showNavigationBarLoading()
    var client = this.data.type
    var id = this.data.id
    util.api.request({
      url: 'client/scanQRCodeOk',
      data: {
        type: client,
        storeId: "1",
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (!res.data.id) {
          wx.showToast({
            title: res.msg,
            duration: 2000
          })
        } else {
          app.addCustomerInfo = res.data
          wx.navigateTo({
            url: '../../client/clientAdd/clientAdd?client=' + that.data.client
          })
        }
      }
    })
    this.cancel()
  },
  onLoad: function (options) {
    this.setData({
      type: options.type,
      title: options.type==1?'客户':"供应商"
    })
    console.log(options);
    this.downData(options.type)
  }
})