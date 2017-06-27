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
    saleName:'标签价',
    stockArray:[],
    userIdentity:3,
    purchasePrivilege:false,
    cusmPrivilege: false,
    supplierPrivilege: false,
    judgeSalePrice:0,
    isPattern:false,
    priceRaise:{},
    sizeRaise:0,
    colorRaise:0,
    showPrice:0
  },
  // 几个权限判断
  authorityPurchaseprice: function () {
    var userIdentity = app.globalData.userIdentity;
    var privilegeEmployees = false;
    var cusmPrivilege = false;
    var supplierPrivilege = false;
    if (userIdentity == 3) {
      for (var p in app.globalData.privilegeEmployees) {
        if (app.globalData.privilegeEmployees[p].privilegeId == 1) {
          privilegeEmployees = true;
        }
        if (app.globalData.privilegeEmployees[p].privilegeId == 3) {
          cusmPrivilege = true;
        }
        if (app.globalData.privilegeEmployees[p].privilegeId == 5) {
          supplierPrivilege = true;
        }
      }
    }
    this.setData({
      purchasePrivilege: privilegeEmployees,
      cusmPrivilege: cusmPrivilege,
      supplierPrivilege: supplierPrivilege
    })
  },
  // 判断有没有权限看进货价、客户、供应商
  authorityJudge:function(){
    var type = this.data.type;
    if (type == 1 && !this.data.cusmPrivilege){
      wx.showToast({
        title: '您没有权限查看客户',
        mask: true,
        duration: 2000
      })
    } else if (type == 2 && !this.data.supplierPrivilege){
      wx.showToast({
        title: '您没有权限查看供应商',
        mask: true,
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: 'unitSelect/unitSelect?type='+type
      })
    }
  },
  //买单
  order: function () {
    wx.navigateTo({
      url: './orderSure/orderSure?type='+this.data.type
    })
  },
  // 进入详情
  orderid:function(e){
    console.log(e)
    this.detail(e.target.dataset.index, e.target.dataset.id, e.currentTarget.dataset.num)
  },
  // 打开详情页面
  detail:function(index,id,num){
    // 判断时候是新增还是修改
    var shopCart = this.data.shopCart;
    if (index) {
      shopCart[index].upData = num ? true : false;
    }
    this.setData({
      orderid: id,
      keyboardNum: '',
      keyHidden: false,
      aa: false,
      keyboardNum2:num,
      shopCart: shopCart
    })
    
    this.showGoodsInfo(id);
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
    var GoodsDetail = this.data.GoodsDetail;
    var num = "";
    if (this.data.orderid){
      num = this.data.colorChange == 2 ? GoodsDetail.showPrice:this.data.keyboardNum2;
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
      // 改价格的时候
      if (this.data.colorChange == 2){
        GoodsDetail.showPrice = num;
        console.log(num)
        this.setData({
          GoodsDetail: GoodsDetail
        })
      }else{
        this.setData({
          keyboardNum2: num
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
  // 判断可更改的价格
  judgeSalePass:function(){
    var modifyPrice = app.globalData.modifyPrice;
    var salPrice = 'tagprice';
    var name = '标签价';
    switch (modifyPrice) {
      case '1':
        salPrice = 'firsthPrice';
        name = app.custProdPrice[0].custtypename;
        break;
      case '2':
        salPrice = 'secondPrice';
        name = app.custProdPrice[1].custtypename;
        break;
      case '3':
        salPrice = 'thirdPrice';
        name = app.custProdPrice[2].custtypename;
        break;
      case '4':
        salPrice = 'fourthPrice';
        name = app.custProdPrice[3].custtypename;
        break;
      case '5':
        salPrice = 'fifthPrice';
        name = app.custProdPrice[4].custtypename;
        break;
      default:
        salPrice = 'tagprice';
        name = '标签价';
        break;
    }
    this.setData({
      judgeSalePrice: this.data.GoodsDetail[salPrice]
    })
    console.log(this.data.GoodsDetail[salPrice])
  },
  // 判断是否可以更改
  SalePassOrNot:function(){
    var GoodsDetail = this.data.GoodsDetail;
    var showPrice2 = this.data.showPrice2;
    var judgeSalePrice = this.data.judgeSalePrice + this.data.sizeRaise + this.data.colorRaise;
    if (this.data.GoodsDetail.showPrice < judgeSalePrice){
      wx.showToast({
        title: '您的权限不够，不能更改价格！',
        icon: 'warn',
        duration: 2000
      })
       GoodsDetail.showPrice = parseFloat(showPrice2) + parseFloat(colorRaise) + parseFloat(sizeRaise);
       this.setData({
        GoodsDetail: GoodsDetail
      })
    }else{
      this.checkEnterBefore()
    }
  },
  // 更改颜色尺码
  EventHandle: function (e) {
    var index = e.target.dataset.index;
    var sizeRaise = this.data.sizeRaise;
    var colorRaise = this.data.colorRaise;
    var showPrice2 = this.data.showPrice2;
    var GoodsDetail = this.data.GoodsDetail;
    var param = {};
    param[index] = e.detail.value;
    // 判断是否加价,分尺码颜色加价
    if (this.data.isPattern && index == "selectColor"){
      for (var g in this.data.priceRaise.colorLists){
        if (e.detail.value == this.data.priceRaise.colorLists[g].name){
          colorRaise = this.data.priceRaise.colorLists[g].priceRaise;
          param.colorRaise = parseFloat(colorRaise);
        }
      }
    } else if (this.data.isPattern && index == "selectSize"){
      for (var g in this.data.priceRaise.sizeLists) {
        if (e.detail.value == this.data.priceRaise.sizeLists[g].name) {
          sizeRaise = this.data.priceRaise.sizeLists[g].priceRaise;
          param.sizeRaise = parseFloat(sizeRaise);
        }
      }
    }
    if (index == "selectColor") {
      var stockArray = this.data.stockArray;
      var size = this.data.size;
      console.log(size)
      for (var p in stockArray) {
        for (var j in size) {
          if (stockArray[p].productcolor == e.detail.value && stockArray[p].productsize == size[j].size) {
            size[j].num += stockArray[p].stocknum
          }
        }
      }
      param.size = size
    }
    GoodsDetail.showPrice = parseFloat(showPrice2) + parseFloat(colorRaise) + parseFloat(sizeRaise);
    param.GoodsDetail = GoodsDetail;
    this.setData(param)
  },
  // 手动更改价格
  changeInputSale: function () {
    var GoodsDetail = this.data.GoodsDetail;
    var modifyPrice = app.globalData.modifyPrice;
    var cate = this.data.cate;
    if (modifyPrice < cate) {
      wx.showToast({
        title: '您的权限不够，不能更改！',
        icon: 'warn',
        duration: 2000
      })
    }else{
      GoodsDetail.showPrice = "";
      this.setData({
        colorChange: 2,
        GoodsDetail: GoodsDetail
      })
    }
  },
  // 价格切换
  changeSale: function () {
    var modifyPrice = app.globalData.modifyPrice;
    var cate = this.data.cate;
    var GoodsDetail = this.data.GoodsDetail;
    if (GoodsDetail.firsthPrice == 0 && GoodsDetail.secondPrice == 0 && GoodsDetail.thirdPrice == 0 && GoodsDetail.fourthPrice == 0 && GoodsDetail.fifthPrice == 0 && GoodsDetail.tagprice == 0) {
      wx.showToast({
        title: '价格都为零不能切换！',
        icon: 'warn',
        duration: 2000
      })
    } else if (modifyPrice < cate) {
      wx.showToast({
        title: '您的权限不够，不能切换！',
        icon: 'warn',
        duration: 2000
      })
    }
    else if (modifyPrice == 1) {
      cate = cate == 0 ? 1 : 0;
      this.endChage(cate, GoodsDetail)
    } else {
      if (cate < modifyPrice) {
        cate = cate + 1
      } else {
        cate = 1
      }
      this.endChage(cate, GoodsDetail)
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
        name = app.custProdPrice[0].custtypename;
        break;
      case '2':
        salPrice = 'secondPrice';
        name = app.custProdPrice[1].custtypename;
        break;
      case '3':
        salPrice = 'thirdPrice';
        name = app.custProdPrice[2].custtypename;
        break;
      case '4':
        salPrice = 'fourthPrice';
        name = app.custProdPrice[3].custtypename;
        break;
      case '5':
        salPrice = 'fifthPrice';
        name = app.custProdPrice[4].custtypename;
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
      // 单个货品列表显示的价格
      this.setData({
        saleChangeName2: saleChangeName2,
        saleName:name
      })
    }else{
      // 所有货品列表显示的价格
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
    if (!this.data.orderid){
      this.setData({
        keyHidden: true
      })
    }
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
        var color = that.data.color;
        for (var p in res.data) {
          num += res.data[p].stocknum;
          for (var j in color){
            if (color[j].color == res.data[p].productcolor){
              color[j].num += parseInt(res.data[p].stocknum)
            }
          }
        }
        console.log(color)
        that.setData({
          stockNum: num,
          color: color,
          stockArray: res.data
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
        var size = res.data.sizes.split(',');
        var color = res.data.colors.split(',');
        var sizeArray = [];
        var colorArray = [];
        var isPattern = that.data.isPattern;
        var priceRaise = that.data.priceRaise;
        if (res.data.isPattern == 1){
          isPattern = true;
          priceRaise = res.data.priceJsons;
        }
        console.log(app.screen_unitList)
        for (var p in app.screen_unitList) {
          if (app.screen_unitList[p].id == res.data.unit) {
            res.data.unit = app.screen_unitList[p].unit;
          }
        }
        for (var p in size) {
          sizeArray.push({
            size: size[p],
            num: ''
          })
        }
        for (var p in color) {
          colorArray.push({
            color: color[p],
            num: 0
          })
        }
        res.data.showPrice = res.data[that.data.saleChangeName];
        res.data.image = res.data.image ? util.api.imgUrl + res.data.image:""; 
        GoodsDetail.handcount = sizeArray.length;
        that.setData({
          GoodsDetail: res.data,
          size: sizeArray,
          color: colorArray,
          isPattern: isPattern,
          priceRaise: priceRaise,
          showPrice2: res.data.showPrice
        })
        that.stock_request(id);
        that.judgeSalePass()
      }
    })
  },
  endChage: function (cate, GoodsDetail){
    this.sale(cate);
    if (GoodsDetail[this.data.saleChangeName2] == 0) {
      this.setData({
        cate: cate
      })
      this.changeSale();
    } else {
      GoodsDetail.showPrice = GoodsDetail[this.data.saleChangeName2]
      this.setData({
        GoodsDetail: GoodsDetail,
        cate: cate
      })
    }
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
        realcostArray: (realcostArray).toFixed(2)
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
      if (shopCart[p].upData){
        shopCart[p] = object;
      }else if (shopCart[p].productId == object.productId && shopCart[p].productcolor == object.productcolor && shopCart[p].productsize == object.productsize){
        shopCart[p].count = parseInt(object.count) + parseInt(shopCart[p].count);
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
  // 本地数据
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
    // 扫一扫
  scan:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  onLoad: function (e) {
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
    console.log(e)
    if (e.ClientData){
      this.detail("", e.id, "")
    }
  },
  onShow: function (options) {
    // 防止没有客户时报错
    app.selectName = app.selectName ? app.selectName:{cate:0};
    if (!app.screen_unitList) {
      util.api.getProductInit();
    }
    this.setData({
      selectName: app.selectName,
      cate: app.selectName.cate
    })
    this.sale(app.selectName.cate);
    this.getData();
    this.authorityPurchaseprice();
    var that = this
    setTimeout(() => {
      this.setData({
        scrollTop: this.data.scrollTop,
      })
    }, 100);
  },
  onUnload:function(){
    this.localData(this.data.shopCart);
  }
})