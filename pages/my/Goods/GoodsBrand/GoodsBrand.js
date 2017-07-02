var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    title: "品牌",
    titlename: '品牌名称',
    product: [
    ],
    url: "color/getAllColors",
    selectOption: '',
    selectOptionID: [],
    addurl: '',
    geturl:'',
    addname: ''
  },
  request_dadta: function () {
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: this.data.geturl,
      data: {
        storeId: app.globalData.storeId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          product: res.data
        })
      }
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 单选框切换
  checkboxChange: function (e) {
    console.log(e)
    var arryname = [];
    var arryid = [];
    var arryvalue = [];
    if (this.data.title !== '颜色选择') {
      arryvalue.push(e.detail.value);
    } else {
      arryvalue = e.detail.value
    }
    console.log(arryname)
    for (var p in arryvalue) {
      arryname.push(arryvalue[p].split('|')[0]);
      arryid.push(arryvalue[p].split('|')[1])
    }
    console.log(arryname)
    this.setData({
      selectOption: arryname,
      selectOptionID: arryid
    });
  },
  // 点击保存按钮
  saveData:function(){
    if (this.data.selectOption) {
      app.changeData = this.data.selectOption;
      app.changeId = this.data.selectOptionID;
      app.nameChange = this.data.titlename;
      console.log(app.changeData)
      this.back()
    } else {
      wx.showToast({
        title: '请选择后再来',
        mask: true,
        duration: 2000
      })
    }
  },
  onLoad: function (options) {
    var titlename = '';
    var addurl = '';
    var addname = '';
    var geturl = '';
    switch (options.title) {
      case '商品种类':
        titlename = '商品种类';
        geturl = options.url;
        addname = 'catename';
        addurl = 'cate/saveCate'
        break;
      case '品牌':
        titlename = '品牌名称';
        geturl = options.url;
        addname = 'brandname';
        addurl = 'brand/saveBrand'
        break;
      case '单位':
        titlename = '单位名称';
        geturl = options.url;
        addname = 'unit';
        addurl = 'unit/saveUnit'
        break;
      case '颜色选择':
        titlename = '颜色名称';
        geturl = options.url;
        addname = 'colorname';
        addurl = 'color/saveColor'
        break;
    }
    this.setData({
      title: options.title,
      url: options.url,
      titlename: titlename,
      addurl: addurl,
      addname: addname,
      geturl: geturl
    });
    this.request_dadta()
  },
  onShow:function(){
    if (app.changeData) {
      var arry = this.data.product;
      var object = {
        id: app.changeId 
      };
      object[this.data.addname] = app.changeData;
      arry.push(object)
      this.setData({
        product: arry
      })
    }
  }
})