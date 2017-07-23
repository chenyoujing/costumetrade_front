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
    changeBoolean:false,
    type:""
  },
  // 输入框操作
  bindKeyInput:function(e){
    var value = e.detail.value;
    this.setData({
      enterValue: value
    })
    this.keyup(value)
  },
  // 清空输入框
  clear:function(){
    this.setData({
      enterValue: ""
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
    var original = this.data[type];
    var object = {};
    object[type] = original == name?"":name;
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
    if (this.data.status !== '') {
      getFilterData.push({
        filed: 'status',
        value: status
      })
    };
    if(this.data.type == "report"){
      getFilterData.push({
        filed: 'operatorArray',
        value: this.data.operatorArray
      })
      getFilterData.push({
        filed: 'productColorArray',
        value: this.data.productColorArray
      })
      getFilterData.push({
        filed: 'productSizeArray',
        value: this.data.productSizeArray
      })
    }
    if (this.data.enterValue){
      app.searchValue = this.data.enterValue;     
    };
   
    console.log(getFilterData)
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
 callback:function(){
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
  downData:function(){
    util.api.supplierRefresh('product/getProducts', "GoodsData", 'updataTime', this.callback);
  },
  // 报表里面的过滤条件
  reportslect:function(){
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/filterQuery',
      data: {
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res)
        var clientCustomers = [];
        var clientSuppliers = [];
        var cplorList = [];
        var employeeList = [];
        var sizeList = [];
        that.setData({
          clientCustomers: res.data.clientCustomers,
          clientSuppliers: res.data.clientSuppliers,
          cplorList: res.data.cplorList,
          employeeList: res.data.employeeList,
          sizeList: res.data.sizeList,
          purchaseReportQuerys: res.data.purchaseReportQuerys,
        })
      }
    })
  },
  // 商城里请求品牌种类
  shopBrandandProduct: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductInit',
      data: {
        storeId: that.data.storeId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var screen_content1 = res.data.brandList;
        var screen_content2 = res.data.productTypeList;
        for (var p in screen_content1) {
          screen_content1[p].screen_checked = false;
        }
        for (var p in screen_content2) {
          screen_content2[p].screen_checked = false;
        }
        console.log(res)
        that.setData({
          screen_content1: screen_content1,
          screen_content2: screen_content2
        })
      }
    })
  },
  // 恢复以前的选择
  recoverSelect:function(){
      var cate = [];
      var brand = [];
      var season = '';
      var status = '';
      var enterValue = '';
      var productSizeArray ='';
      var productColorArray = '';
      var operatorArray = '';
    for (var p in app.getFilterData){
      if (app.getFilterData[p].filed == 'productTypeArray'){
        cate = app.getFilterData[p].value
      } else if (app.getFilterData[p].filed == 'productBrandArray'){
        brand = app.getFilterData[p].value
      } else if (app.getFilterData[p].filed == 'productSeasonArray') {
        season = app.getFilterData[p].value[0]
      } else if (app.getFilterData[p].filed == 'status') {
        status = app.getFilterData[p].value[0]
      } else if (app.getFilterData[p].filed == 'productSizeArray') {
        productSizeArray = app.getFilterData[p].value
      } else if (app.getFilterData[p].filed == 'productColorArray') {
        productColorArray = app.getFilterData[p].value
      } else if (app.getFilterData[p].filed == 'operatorArray') {
        operatorArray = app.getFilterData[p].value
      }
    }
    this.setData({
      cate: cate,
      brand: brand,
      season: season,
      status: status,
      enterValue: enterValue,
      productSizeArray: productSizeArray,
      productColorArray: productColorArray,
      operatorArray: operatorArray
    })
  },
  onLoad: function (options) {
    console.log(app.getFilterData)
    if (!app.logisticFees && app.globalData.userIdentity !== 2) {
      util.api.getProductInit()
    }
    this.setData({
      type: options.type,
      storeId: options.storeId
    })
    if (app.globalData.userIdentity !== 2 & options.type !== 'shop'){
      var screen_content1 = app.screen_brandList;
      var screen_content2 = app.screen_productTypeList;
      for (var p in screen_content1) {
        screen_content1[p].screen_checked = false;
      }
      for (var p in screen_content2) {
        screen_content2[p].screen_checked = false;
      }
      this.setData({
        screen_content1: screen_content1,
        screen_content2: screen_content2,
      })
      this.downData();
    }else{
      this.shopBrandandProduct()
    }
    if (options.type == 'report'){
      this.reportslect();
    }
    this.recoverSelect()
  }
})