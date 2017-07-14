var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      '',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    contacts: [{
      type:'A',
      value: [{ 'name': '啊啊' },{'name': '啊' },{'name': '哎' }]
    }, {
      type: 'B',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }, {
      type: 'C',
      value: [{ 'name': '啊啊' }, { 'name': '啊' }, { 'name': '哎' }]
    }],
    nav_right: ['↑', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#',],
    infotype:'0',
    nav_position:'relative',
    hiddenChat: true
  },
  infotype: function(e){
    this.setData({
      infotype: e.target.dataset.infotype,
      hiddenChat: true,
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 180){
      this.setData({
        nav_position: 'fixed',
      })
    }else{
      this.setData({
        nav_position: 'relative',
      })
    }
  },
  chat:function(){
    this.setData({
      hiddenChat:false
    })
  },
  onShareAppMessage: function () {
  
  },
  onLoad:function(){
    
  },
  onShow:function(){
    if (app.infotype){
      this.setData({
        infotype: app.infotype
      })
    }
    app.infotype = null
  }
})