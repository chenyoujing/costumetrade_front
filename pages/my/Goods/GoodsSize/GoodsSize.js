var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    url:'size/getAllSizes',
    groupUrl:"size/getAllSizeCustom",
    size: [],
    sizeProduct: [],
    selected: []
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  changeBoxBind: function (e) {
    console.log(e)
  },
  request_data: function (url,arrayName) {
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: url,
      data: {
        storeId: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var param = {};
        param[arrayName] = res.data;
        that.setData(param);
        console.log(param)
      }
    })
  },
  add: function (e) {
    var size = e.target.dataset.size;
    var selected = this.data.selected;
    selected.push(size);
    this.setData({
      selected: selected
    })
  },
  reduce: function (e) {
    var size = e.target.dataset.size;
    var selected = this.data.selected;
    for (var index in selected) {
      var row = selected[index];
      if (row == size) {
        selected.splice(index,1);
      }
    }
    this.setData({
      selected: selected
    })
  },
  onLoad: function (options) {
    this.request_data(this.data.url,'size');
    this.request_data(this.data.groupUrl,'sizeProduct');
  },
  onShow: function () {
    if (app.changeData) {
      var arry = this.data.product;
      var object = {
        id: app.changeId
      };
      object[this.data.addname] = app.changeData;
      arry.push(object)
      this.setData({
        product: arry
      })
    }
  }
})