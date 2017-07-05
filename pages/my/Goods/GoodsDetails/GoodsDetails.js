var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    titlename: '商品详情',
    textModal: true,
    description: [],
  },
  text:function(){
    this.setData({
      textModal:false,
    })
  },
  textarea:function(e){
    this.setData({
      text: e.detail.value
    })
  },
  textModal:function(){
    var description = this.data.description
    description.push({
      text: this.data.text
    })
    this.setData({
      textarea: "",
      description: description
    })
    this.cancel()
  },
  cancel:function(){
    this.setData({
      textModal: true,
    })
  },
  // 上传图片
  photoSubmit: function (file, i) {
    var that = this;
    console.log(file[i])
    wx.uploadFile({
      url: util.api.host + 'product/uploadImage',
      filePath: file[i],
      name: 'file',
      success: function (res) {
        if (JSON.parse(res.data).code == 0) {
          var url =  JSON.parse(res.data).data.url;
          var description = that.data.description
          description.push({
            image: url,
          })
          that.setData({
            description: description,
          })
          wx.showToast({
            title: '上传成功',
            mask: true,
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '失败',
            mask: true,
            duration: 2000
          })
        }
        console.log(JSON.stringify(res));

      }
    })
  },
  // 上传图片
  imageCallback: function (e, res) {
    var tempFilePaths = res.tempFilePaths;
    this.photoSubmit(tempFilePaths, 0);
  },
  chooseImg: function (e) {
    util.api.chooseImg(e, this.imageCallback)
  },
  text_align: function (e) {
    var align = e.currentTarget.dataset.align
    this.setData({
      align: align,
    })
  },
  submit:function(){
    app.description = this.data.description
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function (options) {
    if (app.description){
      this.setData({
        url: util.api.imgUrl,
        description: app.description
      })
    }
  },
})