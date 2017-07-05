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
    scanModal: true
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
    this.setData({
      contacts: contacts
    })
  },
  selectName:function(e){
    app.selectName = e.target.dataset;
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
      var endArray4 = util.api.objectPushArry(this.data.product, e.detail.value)
      this.setData({
        product: endArray4
      })
      this.classifyFastcode(endArray4)
    }
  },
  downData: function (type) {
    util.api.supplierRefresh('client/getClients', "UnitData", 'updataTimeunit', this.callback);
  },
  setdata: function (data) {
    this.setData(data)
  },
  // 获取二维码
  scan: function () {
    util.api.scan(this.data.type, this.setdata)
  },
  // 关闭扫码模态框
  cancel: function () {
    this.setData({
      scanModal: true
    })
  },
  // 扫描成功的回调
  callback2: function (data) {
    app.addCustomerInfo = data
    wx.navigateTo({
      url: '../../client/clientAdd/clientAdd?client=' + this.data.type + "&clientId=" + this.data.id + "&scan=" + true
    })
  },
  // 扫好了
  confirm: function () {
    var that = this
    util.api.scanOk(that.data.client, that.data.id, this.callback2)
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