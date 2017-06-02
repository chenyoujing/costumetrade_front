var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    url:'',
    name:'',
    envalue:'',
    addname:''
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  EventHandle: function (e) {
    this.setData({
      envalue:e.detail.value
    })
  },
  // 添加新选项
  addOptions: function () {
    var that = this;
    if (this.data.envalue) {
      wx.showNavigationBarLoading();
      var param = { storeId: 1 };
      param[this.data.addname] = this.data.envalue;
      util.api.request({
        url: this.data.url,
        data: param,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          app.changeData = that.data.envalue;
          app.changeId = res.data;
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 2000
          })
          that.back();
        }
      })
    } else {
      wx.showToast({
        title: '请填写内容',
        mask: true,
        duration: 2000
      })
    }
  },
  onLoad: function (options) {
     this.setData({
       url: options.url,
       name: options.name,
       addname: options.addname
     })
  }
})