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
    level: '',
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
    var screen = 'screen1';
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
  // 单选
  radioSelect: function (e) {
    var type = e.target.dataset.type;
    var name = e.target.dataset.name;
    var object = {};
    object[type] = name;
    this.setData(object);
  },
  selectOptions: function (e) {
    var value = e.target.dataset.name;
    this.setData({
      enterValue: value
    });
    this.searchClick()
  },
  searchClick: function () {
    var region = this.data.region;
    if (this.data.region.length == 0){
      region = null
    }
    app.region = region;


    // var season = [];
    // season.push(this.data.season);
    // var status = [];
    // status.push(this.data.status);
    // var getFilterData = [
    //   {
    //     filed: 'productTypeArray',
    //     value: this.data.cate
    //   },
    //   {
    //     filed: 'productBrandArray',
    //     value: this.data.brand
    //   }
    // ]
    // if (this.data.season !== '') {
    //   getFilterData.push({
    //     filed: 'productSeasonArray',
    //     value: season
    //   })
    // }
    // if (this.data.enterValue) {
    //   app.searchValue = this.data.enterValue;
    // };
    // if (this.data.status !== '') {
    //   getFilterData.push({
    //     filed: 'status',
    //     value: status
    //   })
    // };
    wx.navigateBack({
      delta: 1
    })
  },
  // keyup: function (e) {
  //   if (e == "") {
  //     this.setData({
  //       changeBoolean: false
  //     })
  //   } else {
  //     var endArray4 = util.api.objectPushArry(this.data.product, e)
  //     this.setData({
  //       keyArray: endArray4,
  //       changeBoolean: true
  //     })
  //   }
  // },

  // downData: function () {
  //   util.api.downData();
  //   var that = this;
  //   wx.getStorage({
  //     key: 'GoodsData',
  //     success: function (res) {
  //       that.setData({
  //         product: res.data
  //       })
  //     }
  //   })
  // },
  onLoad: function (options) {
    // this.downData();
    // var screen_content1 = app.screen_brandList;
    // var screen_content2 = app.screen_productTypeList;
    // for (var p in screen_content1) {
    //   screen_content1[p].screen_checked = false;
    // }
    // for (var p in screen_content2) {
    //   screen_content2[p].screen_checked = false;
    // }
    // this.setData({
    //   screen_content1: screen_content1,
    //   screen_content2: screen_content2,
    // })
    this.setData({
      screen1: app.districtList,
      screen2: app.custProdPriceList
    })
  }
})