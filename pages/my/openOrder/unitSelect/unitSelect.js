var util = require('../../../../utils/util.js')
var app = getApp()
Page({
   data: {
     title:"客户",
     product:[],
     type:1, 
    contacts: [],
    supplier_type:'A',
    nav_right: ['↑', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#',]
  },
  supplier_select:function(e){
    let data = e.target.dataset
    this.setData({
      supplier_type: data.type
    })
  },
  // 拆分助记码
  classifyFastcode:function(product){
    var contacts = this.data.contacts;
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
  downData: function (type) {
    util.api.supplierRefresh('client/getClients', "UnitData", 'updataTimeunit', this.callback);
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