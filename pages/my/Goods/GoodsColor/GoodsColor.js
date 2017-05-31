var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    title:"选色",
    titlename:'颜色名称',
    product: [
    ],
    url:"color/getAllColors",
    selectOption:'',
    selectOptionID: '',
    envalue:'',
    addurl:'',
    delecturl:'',
    addname:''
  },
  request_dadta:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: this.data.url,
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
          product: res.data
        })
      }
    })
  },
  checkboxChange:function(e){
    var arryname = [];
    var arryid = [];
    for (var p in e.detail.value){
      arryname.push(e.detail.value[p].split('|')[0]);
      arryid.push(e.detail.value[p].split('|')[1])
    }
    this.setData({
      selectOption: arryname,
      selectOptionID: arryid
    });
  },
  //点击保存
  saveOptions:function(){
    if (this.data.selectOption){
      app.changeData = this.data.selectOption;
      app.nameChange = this.data.titlename;
      console.log(app.changeData)
      this.back()
    }else{
      wx.showToast({
        title: '请选择后再来',
        mask: true,
        duration: 2000
      })
    }
   
  },
  EventHandle:function(e){
     this.setData({
       envalue: e.detail.value
     })
  },
  // 添加新选项
  addOptions:function(){
    var that = this;
    if (this.data.envalue){
      wx.showNavigationBarLoading();
      var param = {storeId: 1};
      param[this.data.addname] = this.data.envalue;
      util.api.request({
        url: this.data.addurl,
        data: param,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          param.id = res.data.value;
          var product = that.data.product;
          product.push(param);
          that.setData({
            product: product
          })
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 2000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请填写内容',
        mask: true,
        duration: 2000
      })
    }
  },
  // 删除选项
  delectOption:function(){

  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function(options){
    var titlename = '';
    var addurl = '';
    var addname='';
    var delecturl='';
    switch (options.title){
      case '选色':
        titlename = '颜色名称';
        addurl = 'color/saveColor';
        addname = 'colorname';
        delecturl = 'color/deleteColor'
        break;
      case '选尺码':
        titlename = '尺码名称';
        addurl = 'size/saveSize';
        addname = 'sizename';
        delecturl = 'size/deleteSize'
        break;
      case '添加单位':
        titlename = '单位名称';
        addurl = 'unit/saveUnit';
        addname = 'unit';
        delecturl = 'unit/deleteUnit'
        break;
    }
    this.setData({
      title:options.title,
      url: options.url,
      titlename: titlename,
      addurl: addurl,
      addname: addname
    });
    this.request_dadta()
  }
})