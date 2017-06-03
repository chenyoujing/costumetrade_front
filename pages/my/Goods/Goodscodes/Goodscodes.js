var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    colorProduct: [],
    sizeProduct: [],
    barcodes: [],
    size:[],
    color:[],
    enterData:'',
    barcode:'456432132165'
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  changeBoxBind: function (e) {
    console.log(e);
    var index = e.target.dataset.index;
    if(index==0){
      this.setData({
        color: e.detail.value
      })
    }else{
      this.setData({
        size: e.detail.value
      })
    }
    this.setData({
      enterData: this.data.color + ',' + this.data.size
    })
  },
  EventHandle:function(e){
    this.setData({
      barcode:e.detail.value
    })
  },
  enterClick:function(){
    if (this.data.color && this.data.size){
      this.enterBefore()
    } else if (this.data.color ==[]){
      wx.showToast({
        title: '请选择尺码',
        mask: true,
        duration: 2000
      })
    } else if (this.data.size == []){
      wx.showToast({
        title: '请选择颜色',
        mask: true,
        duration: 2000
      })
    }
  },
  enterBefore:function(){
    var boolean1 = true;
    var object1 = this.data.barcodes;
    for (var p in object1) {
      if (object1[p][1] == this.data.color && object1[p][2] == this.data.color) {
        object1[p][0] = this.data.barcode;
        boolean1 = false;
        break;
      } else if (object1[p][0] == this.data.barcode) {
        wx.showToast({
          title: '已有此条码',
          mask: true,
          duration: 2000
        })
        boolean1 = false;
        break;
      }
    }
    if (boolean1) {
      object1.push([this.data.barcode, this.data.color, this.data.size]);
    }
    this.setData({
      barcodes: object1,
      enterData: '',
      color: '',
      size: '',
      aa: false
    });
  },
  delect:function(e){
    var index = e.target.dataset.index;
    var arry = this.data.barcodes;
    arry.splice(index,1);
    this.setData({
      barcodes: arry
    })
    console.log(arry)
  },
  saveData: function () {
    var n = [];
    for (var h in this.data.barcodes) {
      if (this.data.barcodes[h]) {
        n.push(this.data.barcodes[h].join(","));
      }
    }
    var barcodes = ''
    if (n.length > 1) {
      barcodes = n.join(";");
    } else {
      barcodes = n[0];
    }
    app.changeData = barcodes == undefined ? 1 : barcodes;
    app.nameChange = '分条码';
    console.log(app.changeData);
    this.back()
  },
  onLoad: function (options) {
    // 每条信息显示
    var barcodes = options.barcodes;
    var barcodearry = [];
    if (barcodes.indexOf(';') > -1) {
      var row = barcodes.split(';');
      for (var p in row) {
        var n = [];
        n = row[p].split(',');
        if (n.length) {
          barcodearry.push(n);
        }
      }
    } else {
      if (barcodes) {
        barcodearry.push(barcodes.split(','));
      }
    }
    // 颜色显示
    var colorProduct =[];
    if (options.color.indexOf(',') > -1) {
       colorProduct = options.color.split(',');
    } else {
      colorProduct.push(options.color);
    }
    // 尺码显示
    var sizeProduct = [];
    if (options.size.indexOf(',') > -1) {
      sizeProduct = options.size.split(',');
    } else {
      sizeProduct.push(options.size);
    }
    this.setData({
      barcodes: barcodearry,
      colorProduct: colorProduct,
      sizeProduct: sizeProduct
    });
  }
  
})