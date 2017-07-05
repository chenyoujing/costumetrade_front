// pages/my/Goods/GoodsDetails/GoodsDetails.js
Page({
  data: {
    titlename: '商品详情',
    textModal: true,
  },
  text:function(){
    this.setData({
      textModal:false,
    })
  },
  textarea:function(){},
  textModal:function(){
    
  },
  cancel:function(){
    this.setData({
      textModal: true,
    })
  },
  image:function(){
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },
  text_align:function(e){
    var align = e.currentTarget.dataset.align
    this.setData({
      align: align,
    })
  },
  onLoad: function (options) {
  
  },
})