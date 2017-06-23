var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    colors:[],
    sizes:[],
    name:"",
    product:[]
  },
  // 寻找颜色尺码id
  classify:function(colors,sizes){
    var product = this.data.product;
    var productArray = {};
    productArray.colorLists = [];
    productArray.sizeLists = [];
    if (!product){
      for(var p in colors){
        productArray.colorLists.push({
          name: colors[p],
          priceRaise: ""
        })
      }
      for (var p in sizes) {
        productArray.sizeLists.push({
          name: sizes[p],
          priceRaise: ""
        })
      }
    }else{
      console.log(product.colorLists)
      for (var p in colors) {
        var has = true;
        for (var j in product.colorLists) {
          console.log(55555)
          console.log(product.colorLists[j].priceRaise)
          if (colors[p] == product.colorLists[j].name) {
            productArray.colorLists.push({
              name: colors[p],
              priceRaise: product.colorLists[j].priceRaise
            })
            has = false;
          }
        }
        if (has) {
          productArray.colorLists.push({
            name: colors[p],
            priceRaise: ""
          })
        }
      }
      for (var p in sizes) {
        var has = true;
        for (var j in product.sizeLists) {
          if (sizes[p] == product.sizeLists[j].name) {
            productArray.sizeLists.push({
              name: sizes[p],
              priceRaise: product.sizeLists[j].priceRaise
            })
            has = false;
            console.log(product.sizeLists[j].priceRaise)
          }
        }
        if (has) {
          productArray.sizeLists.push({
            name: sizes[p],
            priceRaise: ""
          })
        }
      }
    }
    console.log(productArray)
    this.setData({
      product: productArray
    })
  },
  changepriceRaise:function(e){
    var index = e.target.dataset.index;
    var name = e.target.dataset.name;
    var colorORseize = this.data.product;
    console.log(colorORseize)
    colorORseize[name][index]['priceRaise'] = e.detail.value;
    var param = {};
    param['product'] = colorORseize;
    console.log(param['product'])
    this.setData(param)
  },
  // 提交数据
  submitData:function(){
    app.changeData = this.data.product;
    app.nameChange = '加价表';
    console.log(app.changeData)
    wx.navigateBack({
      delta: 1
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
    console.log(options.raisePrice)
    this.setData({
      colors: colorProduct,
      sizes: sizeProduct,
      name: options.name,
      product: app.changeData ||false
    })
    this.classify(this.data.colors, this.data.sizes)
  }
})