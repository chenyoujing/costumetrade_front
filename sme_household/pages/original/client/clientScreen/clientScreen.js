// pages/my/Goods/GoodsScreen/GoodsScreen.js
var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    screen1: [
      { value: '杭州市' },
      { value: '北京市' },
      { value: '成都市' },
      { value: '上海市' },
    ],    
    screen2: [
      { id: '1', custtypename: '普通' },
      { id: '2', custtypename: '银卡' },
      { id: '3', custtypename: '金卡' },
      { id: '4', custtypename: '铂金' },
      { id: '5', custtypename: '钻石' },
    ],
    region: [],
    level: [],
    enterValue: '',
    product: [],
    keyArray: [],
    changeBoolean: false
  },

  // 输入框操作
  bindKeyInput: function (e) {
    var value = e.detail.value;
    this.setData({
      enterValue: value
    })
    this.keyup(value)
  },
  // 多选
  multipleSelect: function (e) {
    var boolean2 = true;
    var type = e.target.dataset.type;
    var screen = type == 'region'?'screen1':'screen2';
    var name = e.target.dataset.name;
    var index = e.target.dataset.index;
    var object = {};
    object[type] = this.data[type];
    object[screen] = this.data[screen];
    for (var p in object[type]) {
      if (object[type][p] == e.target.dataset.name) {
        object[type].splice(p, 1);
        object[screen][index].screen_checked = false;
        boolean2 = false;
        break;
      }
    }
    if (boolean2) {
      object[type].push(name);
      object[screen][index].screen_checked = true;
    }
    this.setData(object)
  },
  searchClick: function () {
    var getClientData = []
    if (this.data.season !== '') {
      getClientData.push({
        filed: 'districtList',
        value: this.data.region
      })
    }
    if (this.data.status !== '') {
      getClientData.push({
        filed: 'cateList',
        value: this.data.level
      })
    };
    console.log(getClientData)
    app.searchValue = this.data.enterValue;
    app.getClientData = getClientData
    wx.navigateBack({
      delta: 1
    })
  },
  // 搜索框输入
  keyup: function (e) {
    if (e == "") {
      this.setData({
        changeBoolean: false
      })
    } else {
      var endArray4 = util.api.objectPushArry(this.data.product, e)
      this.setData({
        keyArray: endArray4,
        changeBoolean: true
      })
    }
  },
  // 清空搜索框
  clearValue:function(){
    this.setData({
      enterValue:"",
      changeBoolean: false
    })
  },
  callback: function () {
    var that = this;
    wx.getStorage({
      key: 'UnitData1',
      complete: function (res) {
        that.setData({
          product: res.data
        })
        console.log(res.data)
      }
    })
  },
  downData: function () {
    util.api.supplierRefresh('client/getClients', "UnitData", 'updataTimeunit', this.callback());
  },
  onLoad: function (options) {
    this.downData();

    this.setData({
      screen1: app.districtList,
      screen2: app.custProdPriceList,
    })
  },
  onShow:function(){
    this.setData({
      enterValue: app.searchValue
    })
  }
})