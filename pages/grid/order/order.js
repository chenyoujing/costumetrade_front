var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    ordertype:0,
    ordertype2:0
  },
  ordertype:function(e){
    var num = e.target.dataset.ordertype;
    this.setData({
      ordertype : num,
      ordertype2: 0
    })
  },
  ordertype2:function(e){
    var num = e.target.dataset.ordertypetwo;
    this.setData({
      ordertype2: num
    })
  }
})