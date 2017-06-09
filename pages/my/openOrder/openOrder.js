var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    more_function_display: "none",
    animation: "",
    scrollTop: '800',
    keyboardNum:'',
    inputBoolean:false,
    nameUnit:'',
    headImage:'../../../images/image_none.png',
    type:1,
    products_info:false,
    placeholder:"货号",
    product:[],
    keyArray:[]
  },
  //买单
  order: function () {
    wx.navigateTo({
      url: './orderSure/orderSure'
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
        num = '';
        boolean2 = false;
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
      products_info:false
    })
  },
  // 切换单据类型
  changeType:function(e){
    var type = e.target.dataset.type;
    this.setData({
      type:type
    })
    this.more_function_close()
  },
  // 判断货品显示的价格
  sale:function(){

  },
  // 搜索货品
  searchGoods:function(){
    var value = this.data.keyboardNum;
    console.log(value)
    var endArray4 = util.api.objectPushArry(this.data.product, value)
    this.setData({
      keyArray: endArray4
    })
    console.log(endArray4)
  },
  downData: function () {
    util.api.supplierRefresh('product/getProducts');
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

  onLoad: function () {
    var that = this;
    this.downData()
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
    var that = this
    setTimeout(() => {
      this.setData({
        scrollTop: this.data.scrollTop,
      })
    }, 100)
  } 
})