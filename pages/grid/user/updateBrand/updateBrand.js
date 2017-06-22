var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    url: "color/getAllColors",
  },
  request_dadta: function () {
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: that.data.url,
      data: {
        storeId: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          product: res.data
        })
      }
    })
  },
  onLoad: function (options) {
    var titlename = '';
    var addurl = '';
    var addname = '';
    var geturl = '';
    switch (options.title) {
      case '商品种类':
        titlename = '商品种类';
        geturl = options.url;
        addname = 'catename';
        addurl = 'cate/saveCate'
        break;
      case '品牌':
        titlename = '品牌名称';
        geturl = options.url;
        addname = 'brandname';
        addurl = 'brand/saveBrand'
        break;
      case '单位':
        titlename = '单位名称';
        geturl = options.url;
        addname = 'unit';
        addurl = 'unit/saveUnit'
        break;
      case '颜色选择':
        titlename = '颜色名称';
        geturl = options.url;
        addname = 'colorname';
        addurl = 'color/saveColor'
        break;
    }
    this.setData({
      title: options.title,
      url: options.url,
      titlename: titlename,
      addurl: addurl,
      addname: addname,
      geturl: geturl
    });
    this.request_dadta()
  },
})