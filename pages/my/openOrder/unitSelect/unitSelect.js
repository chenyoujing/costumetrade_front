var util = require('../../../../utils/util.js')
var app = getApp()
Page({
   data: {
     product:'',
    contacts: [{
      type: 'A',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'B',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'C',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'D',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'E',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'F',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'G',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'H',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }],
    supplier_type:'A',
    nav_right: ['↑', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#',]
  },
  supplier_select:function(e){
    let data = e.target.dataset
    this.setData({
      supplier_type: data.type
    })
  },
  
  downData: function (type) {
    util.api.supplierRefresh('client/getClients', "UnitData", 'updataTimeunit');
    var that = this;
    wx.getStorage({
      key: 'UnitData'+type,
      complete: function (res) {
        that.setData({
          product: res.data
        })
        console.log(res.data)
      }
    })
  },
  onLoad: function (options) { 
    this.downData(options.type)
  }
})