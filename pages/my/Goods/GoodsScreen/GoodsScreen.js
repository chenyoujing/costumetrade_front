// pages/my/Goods/GoodsScreen/GoodsScreen.js
var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    screen_content1: [],
    screen_content2: [],
    screen_content3: [
      { name: 'SEASON_SPRING', value: '春' },
      { name: 'SEASON_SUMMER', value: '夏' },
      { name: 'SEASON_AUTUMN', value: '秋' },
      { name: 'SEASON_WINTER', value: '冬' }
    ],
    screen_content4: [
      { name: '0', value: '上架' },
      { name: '2', value: '下架' },
      { name: '1', value: '待处理' },
      { name: '3', value: '报废' },
    ],
    cate:[],
    brand:[],
    season:'',
    status:'',
    enterValue:'',
    product:[],
    keyArray:[],
    changeBoolean:false
  },
  // 输入框操作
  bindKeyInput:function(e){
    var value = e.detail.value;
    this.setData({
      enterValue: value
    })
    this.keyup(value)
  },
  // 品牌、种类多选
  multipleSelect:function(e){
    var boolean2 = true;
    var type = e.target.dataset.type;
    var screen = e.target.dataset.type == 'cate' ? 'screen_content2' :'screen_content1';
    var name = e.target.dataset.name; 
    var index = e.target.dataset.index;
    var object = {};
    object[type] = this.data[type];
    object[screen] = this.data[screen];
    for (var p in object[type]){
      if(object[type][p] == e.target.dataset.name){
        object[type].splice(p,1);
        object[screen][index].screen_checked = false;
        boolean2 = false;
        break;
      }
    }
    if (boolean2){
      object[type].push(name);
      object[screen][index].screen_checked = true;
    }
    this.setData(object)
  },
   // 季节、状态单选
  radioSelect:function(e){
    var type = e.target.dataset.type;
    var name = e.target.dataset.name; 
    var object = {};
    object[type] = name;
    this.setData(object);
  },
  selectOptions:function(e){
    var value = e.target.dataset.name;
    this.setData({
      enterValue: value
    });
    this.searchClick()
  },
  searchClick:function(){
    var season =[];
    season.push(this.data.season);
    var status = [];
    status.push(this.data.status);
    var getFilterData = [
      {
      filed: 'productTypeArray',
      value: this.data.cate
      },
      {
        filed: 'productBrandArray',
        value: this.data.brand
      }      
    ] 
    if (this.data.season !== ''){
      getFilterData.push({
        filed: 'productSeasonArray',
        value: season
      })
    }  
    if (this.data.enterValue){
      app.searchValue = this.data.enterValue;     
    };
    if (this.data.status !== '') {
      getFilterData.push({
        filed: 'status',
        value: status
      })
    };
    app.getFilterData = getFilterData;
    wx.navigateBack({
      delta: 1
    })  
  },
  keyup:function(e){
    if(e == ""){
      this.setData({
        changeBoolean:false
      })
    } else{
      var endArray4 = util.api.objectPushArry(this.data.product,e)
      this.setData({
        keyArray: endArray4,
        changeBoolean: true
      })
    }
  },
 
  downData:function(){
    util.api.downData();
    var that = this;
    wx.getStorage({
      key: 'GoodsData',
      success: function (res) {
        that.setData({
          product: res.data
        })
      }
    })
  },
  onLoad: function (options) {
    this.downData();
    var screen_content1 = app.screen_brandList;
    var screen_content2 = app.screen_productTypeList;
    for (var p in screen_content1){
      screen_content1[p].screen_checked = false;
    }
    for (var p in screen_content2) {
      screen_content2[p].screen_checked = false;
    }
    this.setData({
      screen_content1: screen_content1,
      screen_content2: screen_content2
    })
  }
})