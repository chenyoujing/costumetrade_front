var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    colors:[],
    sizes:[],
    name:"",
    product:[]
  },
  patternAddPriceInit:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/patternAddPriceInit',
      data: {
        storeId: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          product:res.data
        })
        that.classify(that.data.colors,that.data.sizes)
        console.log(res.data)
      }
    })
  },
  // 寻找颜色尺码id
  classify:function(colors,sizes){
    var product = this.data.product;
    var colorsArray = [];
    var sizesArray = [];
    for (var j in product){
      for (var p in colors) {
        if (colors[p] == product[j].colorname){
          colorsArray.push(product[j])
        }
      }
      for(var g in sizes){
        if (sizes[g] == product[j].sizename) {
          sizesArray.push(product[j])
        }
      }
    }
    this.setData({
      colors: colorsArray,
      sizes: sizesArray
    })
  },
  changepriceRaise:function(e){
    var index = e.target.dataset.index;
    var name = e.target.dataset.name;
    var colorORseize = [];
    colorORseize = this.data[name];
    console.log(colorORseize)
    colorORseize[index]['priceRaise'] = e.detail.value;
    var param = {};
    param[name] = colorORseize;
    console.log(param[name])
    this.setData(param)
  },
  // 提交数据
  submitData:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/savePatternAddPrice',
      data: {
        sizeLists:this.data.sizes,
        colorLists:this.data.colors
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.navigateBack({
          delta: 1
        })
        console.log(res.data)
      }
    })
  },
  onLoad: function (options) {
    // 颜色分组
    var colorProduct = [];
    if (options.colors.indexOf(',') > -1) {
      colorProduct = options.colors.split(',');
    } else {
      colorProduct.push(options.colors);
    }
    // 尺码显示
    var sizeProduct = [];
    if (options.sizes.indexOf(',') > -1) {
      sizeProduct = options.sizes.split(',');
    } else {
      sizeProduct.push(options.sizes);
    }
    this.setData({
      colors: colorProduct,
      sizes: sizeProduct,
      name: options.name
    })
    this.patternAddPriceInit()
  },
  onShow: function () {
    
  }
})