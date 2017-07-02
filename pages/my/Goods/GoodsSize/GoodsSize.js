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
    this.setData({
      selected:e.detail.value.split(',')
    })
    console.log(e)
  },
  request_data: function (url,arrayName) {
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
        if (arrayName == 'size'){
          app.sizeArray = res.data
        }
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
        break;
      }
    }
    this.setData({
      selected: selected
    })
  },
  saveData:function(){
    app.nameChange = '尺码';
    app.changeData = util.api.getFilterArray(this.data.selected);
    this.back()
  },
  onLoad: function (options) {
    this.request_data(this.data.url,'size');
    this.request_data(this.data.groupUrl,'sizeProduct');
  },
  onShow: function () {
    if (app.changeData) {
      if (app.changesizename == 'sizename'){
        var arry = this.data.size;
        var object = {
          id: app.changeId
        };
        object[app.changesizename] = app.changeData;
        arry.push(object);
        this.setData({
          size: arry
        })
        app.changesizename = ""
      }else{
        console.log(app.changeId)
        var arry = this.data.sizeProduct;
        var object = {
          value: app.changeId.value
        };
        object[app.changesizename] = app.changeData;
        arry.push(object);
        console.log(object)
        this.setData({
          sizeProduct: arry
        })
        app.changeId = ''
      } 
      app.changeData = "" ;   
    }
  }
})