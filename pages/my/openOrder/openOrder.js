var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    more_function_display: "none",
    animation: "",
    scrollTop: '800',
    keyboardNum:'',
    keyboardNum2:'',
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
    saleChangeName2:'tagprice',
    color: [],
    size: [],
    GoodsDetail: {},
    stockNum: [],
    unitChange: false,
    disabled: false,
    oneKeyshow:1,
    selectSize:'',
    selectColor: '', 
    totalData: {
      totalNum: 0,
      realcostArray: 0
    },
    aa:false,
    colorChange:1,
    cate:1,
    saleName:'标签价'
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
      console.log(app)
    }
    this.showGoodsInfo(e.target.dataset.id);
    this.stock_request(e.target.dataset.id)
  },
  order_back:function(){
    this.setData({
      orderid: "",
      selectSize:'',
      selectColor:""
    })
  },
  // 键盘事件
  keyboardtap:function(e){
    var index = e.target.dataset.index;
    var num = "";
    if (this.data.orderid){
      num = this.data.colorChange == 2?this.data.GoodsDetail.showPrice:this.data.keyboardNum2;
    }else{
      num = this.data.keyboardNum;
    }
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
    if (this.data.orderid){
      if (this.data.colorChange == 2){
        var GoodsDetail = this.data.GoodsDetail;
        GoodsDetail.showPrice = num;
        this.setData({
          GoodsDetail: GoodsDetail
        })
      }else{
        this.setData({
          keyboardNum2: num,
        })
      }
    }else{
      this.setData({
        keyboardNum: num,
        products_info: boolean2
      })
      if (boolean2) {
        this.searchGoods()
      }
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
      keyHidden: place == "货号"?false:true
    })
  },
  // 切换单据类型
  changeType:function(e){
    var type = e.target.dataset.type;
    this.sale(this.data.selectName.cate);
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
  sale:function(cate){
    cate= String(cate)
    var name = this.data.saleName;
    var salPrice = 'tagprice';
    switch (cate){
      case '1':
        salPrice = 'firsthPrice';
        name = app.customerTypeList[0].custtypename;
        break;
      case '2':
        salPrice = 'secondPrice';
        name = app.customerTypeList[1].custtypename;
        break;
      case '3':
        salPrice = 'thirdPrice';
        name = app.customerTypeList[2].custtypename;
        break;
      case '4':
        salPrice = 'fourthPrice';
        name = app.customerTypeList[3].custtypename;
        break;
      case '5':
        salPrice = 'fifthPrice';
        name = app.customerTypeList[4].custtypename;
        break;
      default:
        salPrice = 'tagprice';
        name = '标签价';
        break;
    }
    var saleChangeName2 = salPrice;
    salPrice = this.data.type == 1 ? salPrice :'purchaseprice';
    name = this.data.type == 1 ? name : '进货价';
    if (this.data.orderid){
      this.setData({
        saleChangeName2: saleChangeName2,
        saleName:name
      })
    }else{
      this.setData({
        saleChangeName: salPrice,
        saleName: name
      })
    }
    
    console.log(salPrice)
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
      disabled: unitString,
      colorChange:1
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
  // 价格切换
  changeSale:function(){
    var cate = this.data.cate;
    console.log(cate)
    if (cate < 5){
      cate = cate + 1
    }else{
     cate = 1
    }
    this.sale(cate);
    var GoodsDetail = this.data.GoodsDetail;
    GoodsDetail.showPrice = GoodsDetail[this.data.saleChangeName2]
    console.log(GoodsDetail[this.data.saleChangeName2])
    if (GoodsDetail[this.data.saleChangeName2] == 0){
      // this.changeSale()
    }
    this.setData({
      GoodsDetail: GoodsDetail,
      cate: cate
    })
  },
  // 手动更改价格
  changeInputSale:function(){
    var GoodsDetail = this.data.GoodsDetail;
    GoodsDetail.showPrice = "";
     this.setData({
       colorChange:2,
       GoodsDetail:GoodsDetail
     })
  },
  // 计算总的价格和数量
  totalData:function(){
    var product = this.data.shopCart;
    var realcostArray = 0;
    var totalNum = 0; 
    for(var p in product){
      realcostArray += parseFloat((product[p].price * product[p].count).toFixed(1));
      totalNum += parseInt(product[p].count);
    }
    this.setData({
      totalData:{
        totalNum: totalNum,
        realcostArray: realcostArray
      }
    })
    var that = this;
    var nametotal = 'totalData' + this.data.type;
    wx.setStorage({
      key: nametotal,
      data: that.data.totalData
    })
  },
  // 加入进货单
  enterShopCart: function (){
    var add = true;
    var shopCart = this.data.shopCart;
    var object = {
      count: this.data.keyboardNum2 ? this.data.keyboardNum2 : this.data.oneKeyshow,
      productName: this.data.GoodsDetail.name,
      price: this.data.GoodsDetail.showPrice,
      productid: this.data.GoodsDetail.id,
      productunit: this.data.GoodsDetail.unit,
      productcolor: this.data.selectColor,
      productsize: this.data.selectSize,
      producttype: this.data.GoodsDetail.producttype,
      handtag: this.data.GoodsDetail.handcount
    }
    if (this.data.unitChange){
      object.count = object.count * this.data.GoodsDetail.handcount;
      object.productsize =  '全尺码';
      object.sizeGroup = this.data.GoodsDetail.sizes;
    }
    for(var p in shopCart){
      if (shopCart[p].productId == object.productId && shopCart[p].productcolor == object.productcolor && shopCart[p].productsize == object.productsize){
        shopCart[p].count = parseInt(object.count) + shopCart[p].count;
        add = false;
      }
    }
    if(add){
      shopCart.push(object);
    }
    this.localData(this.data.shopCart);
    this.totalData();
    this.order_back();
    this.setData({
      shopCart: shopCart
    });
  },
  // 还魂本地数据
  localData:function(product){
    var name = 'shopCartLowe' + this.data.type;
    wx.setStorage({
      key: name,
      data: product
    })
  },
  // 加入之前的判断
  checkEnterBefore:function(){
    console.log(this.data.selectColor)
    if (!this.data.selectColor){
      wx.showToast({
        title: '请选择颜色',
        mask: true,
        duration: 2000
      })
    } else if (!this.data.unitChange && !this.data.selectSize){
      wx.showToast({
        title: '请选择尺码',
        mask: true,
        duration: 2000
      })
    }else{
      this.enterShopCart()
    }
  },
  // 得到缓存本地数据
  getData:function(){
    var that = this;
    var name = 'shopCartLowe'+this.data.type;
    wx.getStorage({
      key: name,
      complete: function (res) {
        res.data = res.data ? res.data:[];
        that.setData({
          shopCart: res.data
        })
        that.totalData()
        console.log(res.data)
      }
    })
  },
  // 删除
  delect:function(e){
    var index = e.target.dataset.delect;
    var product = this.data.shopCart;
    product.splice(index,1);
    this.setData({
      shopCart:product
    })
    this.localData(product);
    this.totalData()
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
    console.log(app)
    this.sale(this.data.selectName.cate);
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