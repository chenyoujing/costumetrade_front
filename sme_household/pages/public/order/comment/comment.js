var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    productid: "",
    msg: "",
    url: 'order/saveReview',
    fileList: [],
    storeId:""
  },
  back: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  textareaChange: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },
  // 上传图片
  photoSubmit: function (file, i, index) {
    console.log(index)
    var that = this;
    wx.uploadFile({
      url: util.api.host + 'product/uploadImage',
      filePath: file[i],
      name: 'file',
      success: function (res) {
        console.log(JSON.stringify(res));
        var url = util.api.imgUrl + JSON.parse(res.data).data.url;
        var fileArray = that.data.fileList;
        if (index) {
          fileArray[index] = url
        } else {
          fileArray.push(url);
        }
        console.log(fileArray)
        that.setData({
          fileList: fileArray
        })
      }
    })
  },
  // 选择图片
  chooseImg: function (index) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.photoSubmit(tempFilePaths, 0, index);
      }
    })
  },
  // 上传图片,点击加号
  updataM: function () {
    if (this.data.fileList.length >= 10) {
      wx.showToast({
        title: '最多上传10个图片，您可以点击相应的图片更改',
        mask: true,
        duration: 2000
      })
    } else {
      this.chooseImg(null);
    }
  },
  // 更改图片
  changeImage: function (e) {
    var index = e.target.dataset.index;
    this.chooseImg(index);
  },
  order_request: function () {
    var that = this;
    var fileList = this.data.fileList;
    for (var p in fileList){
      fileList[p] = fileList[p].replace(/http:\/\/ot84hx5jl.bkt.clouddn.com\//g, '');
    }
    wx.showNavigationBarLoading();
    util.api.request({
      url: this.data.url,
      data: {
        storeId: that.data.storeId,
        productid: that.data.productid,
        url: that.data.fileList,
        msg: that.data.msg
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
        that.back();
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      productid: options.productid,
      storeId: options.storeId
    })
  }
})