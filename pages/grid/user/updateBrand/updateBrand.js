var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    url: "color/getAllColors",
    deleteUrl:"",
    product:[]
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
  // 删除按钮
  delete:function(e){
    var ids = [];
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    var that = this;
    ids.push(id)
    wx.showNavigationBarLoading();
    util.api.request({
      url: that.data.deleteUrl,
      data: {
        ids: ids
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var product = that.data.product;
        product.splice(index,1)
        that.setData({
          product: product
        })
      }
    })
  },
  // 删除询问
  questSure:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗?',
      success: function (res) {
        if (res.confirm) {
          that.delete(e);
        }
      }
    })
  },
  onLoad: function (options) {
    var titlename = '';
    var addurl = '';
    var addname = '';
    var geturl = '';
    var deleteUrl = ""
    switch (options.title) {
      case '商品种类':
        titlename = '商品种类';
        geturl = options.url;
        addname = 'catename';
        addurl = 'cate/saveCate',
        deleteUrl = "cate/deleteCate"
        break;
      case '品牌':
        titlename = '品牌名称';
        geturl = options.url;
        addname = 'brandname';
        addurl = 'brand/saveBrand',
        deleteUrl = "brand/deleteBrand"
        break;
      case '单位':
        titlename = '单位名称';
        geturl = options.url;
        addname = 'unit';
        addurl = 'unit/saveUnit',
        deleteUrl = "unit/deleteUnit"
        break;
      case '颜色选择':
        titlename = '颜色名称';
        geturl = options.url;
        addname = 'colorname';
        addurl = 'color/saveColor',
        deleteUrl = "color/deleteUrl"
        break;
    }
    this.setData({
      title: options.title,
      url: options.url,
      titlename: titlename,
      addurl: addurl,
      addname: addname,
      geturl: geturl,
      deleteUrl: deleteUrl
    });
    console.log({
      title: options.title,
      url: options.url,
      titlename: titlename,
      addurl: addurl,
      addname: addname,
      geturl: geturl
    })
    this.request_dadta()
  },
})