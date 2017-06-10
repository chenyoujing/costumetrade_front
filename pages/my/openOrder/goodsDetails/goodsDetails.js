var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    keyboard_width:"",
    keyboard_height:"",
    color: [],
    size: [],
    keyboardNum:1,
    GoodsDetail:{},
    stockNum:[],
    unitChange:false,
    disabled:false
  },
  // 键盘事件
  keyboardtap: function (e) {
    var index = e.target.dataset.index;
    var num = this.data.keyboardNum;
    switch (index) {
      case '-':
        num = num == "" ? "" : parseInt(-num);
        break;
      case 'clear':
        num = String(num);
        num = num.substring(0, num.length - 1);
        break;
      default:
        num = num + String(index);
        break;
    }
    this.setData({
      keyboardNum: num
    })
    
  },
  // 手件切换
  changeGroup:function(){
    var unitString = !this.data.unitChange;
    this.setData({
      unitChange: unitString,
      disabled: unitString
    })
  },
  // 请求库存
  stock_request: function (id) {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/takingStock',
      data: {
        storeId: 1,
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var num = 0;
        for(var p in res.data){
          num += res.data[p].stocknum
        }
        that.setData({
          stockNum: num
        })
      }
    })
  },
  // 货品详情
  showGoodsInfo: function (id) {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductInit',
      data: {
        storeId: 1,
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(app.screen_unitList)
        for (var p in app.screen_unitList){
          if (app.screen_unitList[p].id == res.data.unit){
            res.data.unit = app.screen_unitList[p].unit
          }
        }
        that.setData({
          GoodsDetail:res.data,
          size: res.data.sizes.split(','),
          color: res.data.colors.split(',')
        })

        console.log(res.data)
      }
    })
  },
  onLoad: function (options) {
    if (!app.screen_unitList){
      util.api.getProductInit();
    }
    this.showGoodsInfo(options.id);
    this.stock_request(options.id)
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          keyboard_width: (res.windowWidth - 8) / 4 - 4,
          keyboard_height: res.windowHeight / 6 - 10
        })
      }
    })
  },
})