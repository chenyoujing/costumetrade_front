var util = require('../../../../utils/util.js')
var app = getApp()
Page({
   data: {
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
        if (contacts[j].type == product[p].fastcode){
          contacts[j]['value'].push(product[p]);
          boolean2 = false;
          break;
        }
      }
      if(boolean2){
        var value = [];
        contacts.push({
          type: product[p].fastcode,
          value: value.push(product[p])
        })
      }
    }
    console.log(contacts);
    this.setData({
      contacts: contacts
    })
  },
  callback:function(){
    var that = this;
    wx.getStorage({
      key: 'UnitData1',
      complete: function (res) {
        that.setData({
          product: res.data
        })
        that.classifyFastcode(res.data)
        console.log(res.data)
      }
    })
  },
  downData: function (type) {
    this.callback()
    util.api.supplierRefresh('client/getClients', "UnitData", 'updataTimeunit', this.callback());
    // console.log('UnitData' + that.data.type);
  },
  onLoad: function (options) {
    console.log(options);
    this.downData(options.type)
  }
})