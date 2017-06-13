var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    more_function_display: "none",
    animation: "",
    scrollTop: '800',
    keyboardNum:'',
    inputBoolean:false,
    keyHidden:false,
    nameUnit:'',
    headImage:'../../../images/image_none.png',
    type:1,
    products_info:false,
    placeholder:"货号",
    product:[],
    keyArray:[],
    shopCart:[],
    selectName:{},
    saleChangeName:'tagprice',
    color: [],
    size: [],
    GoodsDetail: {},
    stockNum: [],
    unitChange: false,
    disabled: false,
    oneKeyshow:1,
    selectSize:'',
    seleceColor: '', 
    totalData: {
      totalNum: 0,
      realcostArray: 0
    },
    aa:false
  },
  //买单
  order: function () {
    wx.navigateTo({
      url: './orderSure/orderSure?type='+this.data.type
    })
  },
  orderid:function(e){
    console.log(e)
    this.setData({
      orderid: e.target.dataset.id,
      keyboardNum:'',
      keyHidden:false,
      aa:false
    })
    if (!app.screen_unitList) {
      util.api.getProductInit();
    }
    this.showGoodsInfo(e.target.dataset.id);
    this.stock_request(e.target.dataset.id)
  },
  order_back:function(){
    this.setData({
      orderid: ""
    })
  },
  // 键盘事件
  keyboardtap:function(e){
    var index = e.target.dataset.index;
    var num = this.data.keyboardNum;
    var boolean2 = this.data.products_info;
    switch (index){
      case '-':
        num = num ==""? "": parseInt(-num);
        break;
      case 'clear':
        console.log(num.length)
        num = String(num);
        num = num.substring(0,num.length-1);
        boolean2 = num?true: false;
        break;
      default:
        num = num +String(index);
        boolean2 = true;
        break;
    }
    this.setData({
      keyboardNum:num,
      products_info: boolean2
    })
    if (boolean2){
      this.searchGoods()
    }
  },
  // input改变事件
  input_change:function(e){
    var value = e.detail.value;
    var boolean = e.detail.value?true:false;
    this.setData({
      keyboardNum: value,
      products_info: boolean
    })
    this.searchGoods()
    console.log(this.data.products_info)
  },
  // 货号名称切换
  changeCodeName:function(){
    var place = this.data.inputBoolean? '货号' : '名称';
    this.setData({
      inputBoolean: !this.data.inputBoolean,
      keyboardNum:'',
      placeholder: place,
      products_info:false,
      keyHidden: false
    })
  },
  // 切换单据类型
  changeType:function(e){
    var type = e.target.dataset.type;
    this.sale();
    this.localData(this.data.shopCart);
    this.setData({
      type: type,
      shopCart:[]
    })
    this.getData();
    console.log(e.target.dataset.type)
    this.more_function_close()
  },
  // 判断货品显示的价格
  sale:function(){
    var salPrice = 'tagprice';
    switch (this.data.selectName.cate){
      case '1':
        salPrice = 'firsthPrice';
        break;
      case '2':
        salPrice = 'secondPrice';
        break;
      case '3':
        salPrice = 'thirdPrice';
        break;
      case '4':
        salPrice = 'fourthPrice';
        break;
      case '5':
        salPrice = 'fifthPrice';
        break;
      default:
        salPrice = 'tagprice';
        break;
    }
    salPrice = this.data.type == 1 ? salPrice :'purchaseprice';
    this.setData({
      saleChangeName: salPrice
    })
    console.log(salPrice)
  },
  // 货品加入进货单或图库单
   documentsAdding:function(e){
     var product = this.data.shopCart;
   },
  // 搜索货品
  searchGoods:function(){
    var value = this.data.keyboardNum;
    console.log(value)
    var endArray4 = util.api.objectPushArry(this.data.product, value)
    for (var p in endArray4){
      endArray4[p].timeUp = util.toDate(endArray4[p].timeUp);
      endArray4[p].showPrice = endArray4[p][this.data.saleChangeName];
      console.log(endArray4[p]['purchaseprice'])
      console.log(this.data.saleChangeName)
    }
    this.setData({
      keyArray: endArray4
    })
    console.log(endArray4)
  },
  // 隐藏键盘
  keyHidden:function(){
    this.setData({
      keyHidden:true
    })
    console.log(this.data.keyHidden)
  },
  // keyShow显示键盘
  keyShow:function(e){
    var index = e.target.dataset.index;
    console.log(index)
    if(index){
      this.setData({
        keyHidden: true
      })
    }else{
      this.setData({
        keyHidden: false
        // inputBoolean: true
      })
    }
    console.log(this.data.keyHidden)
  },
  callback:function(){
    var that = this;
    wx.getStorage({
      key: 'GoodsData',
      complete: function (res) {
        that.setData({
          product: res.data
        })
        console.log(res.data)
      }
    })
  },
  downData: function () {
    util.api.supplierRefresh('product/getProducts',"GoodsData", 'updataTime',this.callback);
  },
  // 打开多功能键
  more_function: function () {
    this.setData({
      more_function_display: "block",
    })
    setTimeout(() => {
      this.setData({
        animation: "animation",
      })
    }, 10)
  },
  // 关闭多功能键
  more_function_close: function () {
    this.setData({
      animation: "",
    })
    setTimeout(() => {
      this.setData({
        more_function_display: "none",
      })
    }, 300)
  },
  // 手件切换
  changeGroup: function () {
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
        for (var p in res.data) {
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
        for (var p in app.screen_unitList) {
          if (app.screen_unitList[p].id == res.data.unit) {
            res.data.unit = app.screen_unitList[p].unit;
          }
        }
        res.data.showPrice = res.data[that.data.saleChangeName];
        that.setData({
          GoodsDetail: res.data,
          size: res.data.sizes.split(','),
          color: res.data.colors.split(',')
        })
        console.log(that.data.color)
      }
    })
  },
  EventHandle:function(e){
    var index = e.target.dataset.index;
    var param = {};
    param[index] = e.detail.value;
    this.setData(param)
  },
  changeSale:function(){

  },
  // 计算总的价格和数量
  totalData:function(){
    var product = this.data.shopCart;
    var realcostArray = 0;
    var totalNum = 0; 
    for(var p in product){
      realcostArray += product[p].price;
      totalNum += parseInt(product[p].count);
    }
    this.setData({
      totalData:{
        totalNum: totalNum,
        realcostArray: realcostArray
      }
    })
  },
  enterShopCart: function (){
    var shopCart = this.data.shopCart;
    var object = {
      count: this.data.keyboardNum ? this.data.keyboardNum : this.data.oneKeyshow,
      productName: this.data.GoodsDetail.name,
      price: this.data.GoodsDetail.showPrice,
      productId: this.data.GoodsDetail.id,
      unit: this.data.GoodsDetail.id,
      color: this.data.seleceColor,
      size:this.data.selectSize
    }
    shopCart.push(object);
    this.setData({
      shopCart:shopCart
    });
    console.log(this.data.GoodsDetail.name);
    this.totalData()
    this.order_back();
  },
  localData:function(product){
    var name = 'shopCartLowe' + this.data.type;
    wx.setStorage({
      key: name,
      data: product
    })
  },
  getData:function(){
    var that = this;
    var name = 'shopCartLowe'+this.data.type;
    wx.getStorage({
      key: name,
      complete: function (res) {
        that.setData({
          shopCart: res.data
        })
        that.totalData()
        console.log(res.data)
      }
    })
  },
  delect:function(e){
    var index = e.target.dataset.delect;
    var product = this.data.shopCart;
    product.splice(index,1);
    this.setData({
      shopCart:product
    })
    this.localData(product)
  },
  
  onLoad: function () {
    var that = this;
    this.downData();
    setTimeout(() => {
      this.setData({
        scrollTop: this.data.scrollTop,
      })
    }, 1000)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          keyboard_width: (res.windowWidth - 8) / 4 - 4,
          keyboard_height: res.windowHeight / 6 - 10
        })
      }
    })
  },
  onShow: function (options) {
    this.sale();
    this.getData();
    var that = this
    setTimeout(() => {
      this.setData({
        scrollTop: this.data.scrollTop,
      })
    }, 100);
    var name = '';
    if (app.selectName.name.indexOf(',')>-1){
      var selectName = app.selectName.name.split(',');
      if (selectName[0]) {
        name = selectName[0]
      } else if (selectName[1]) {
        name = selectName[1]
      } else if (selectName[2]) {
        name = selectName[2]
      }
      app.selectName.name = name;
    }
    console.log(app.selectName)
    this.setData({
      selectName: app.selectName
    })
  },
  onUnload:function(){
    this.localData(this.data.shopCart);
  }
})