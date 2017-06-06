// pages/grid/info/info.js
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      '',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    nav_right: ['↑', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#',],
    infotype:'0',
    nav_position:'relative',
  },
  infotype: function(e){
    this.setData({
      infotype: e.target.dataset.infotype
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
  onShareAppMessage: function () {
  
  },
  onLoad:function(){
    
  }
})