var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    url: 'size/getAllSizes',
    groupUrl: "size/getAllSizeCustom",
    size: [],
    sizeProduct: [],
    selected: []
  },
  changeBoxBind: function (e) {
    this.setData({
      selected: e.detail.value.split(',')
    })
    console.log(e)
  },
  request_data: function (url, arrayName) {
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: url,
      data: {
        storeId: app.globalData.storeId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var param = {};
        if (arrayName == 'size') {
          app.sizeArray = res.data
        }
        param[arrayName] = res.data;
        param[arrayName + "String"] = JSON.stringify(res.data);
        that.setData(param);
        console.log(param)
      }
    })
  },
  // 删除按钮
  delete: function (e) {
    var ids = [];
    var size = e.target.dataset.size;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    console.log(Boolean(size))
    var url = size == "true" ? 'size/deleteSize' :'size/deleteSizeCustom';
    var that = this;
    ids.push(id)
    wx.showNavigationBarLoading();
    util.api.request({
      url: url,
      data: {
        ids: ids
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var product = size == "true" ? that.data.size : that.data.sizeProduct;
        var name = size == "true" ? 'size' :"sizeProduct"
        var param = {};
        product.splice(index, 1)
        param[name] = product
        that.setData(param)
      }
    })
  },
  // 删除询问
  questSure: function (e) {
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
    this.request_data(this.data.url, 'size');
    this.request_data(this.data.groupUrl, 'sizeProduct');
  },
  onShow: function () {
    if (app.changeData) {
      if (app.changesizename == 'sizename') {
        var arry = this.data.size;
        var object = {
          id: app.changeId
        };
        object[app.changesizename] = app.changeData;
        arry.push(object);
        this.setData({
          size: arry,
          sizeString: JSON.stringify(arry)
        })
        app.sizeArray = arry;
        app.changesizename = ""
      } else {
        var arry = this.data.sizeProduct;
        var object = {
          value: app.changeId.value,
          id: app.changeId.id
        };
        object[app.changesizename] = app.changeData;
        arry.push(object);
        console.log(object)
        this.setData({
          sizeProduct: arry,
          sizeProductString: JSON.stringify(arry)
        })
        app.changeId = ''
      }
      app.changeData = "";
    }
  }
  
})