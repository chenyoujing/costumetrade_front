var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
    title:'新增货品',
    picker_view: [
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
    ],
    screen_content3: [
      { name: '春', value: '春' },
      { name: '夏', value: '夏' },
      { name: '秋', value: '秋' },
      { name: '冬', value: '冬' },
    ],
    screen_brandList:[],
    screen_productTypeList:[],
    screen_gradeList:[],
    screen_unitList:[],
    screen_productSize:[],
    GoodsInfoData:{},
    soruceData:{},
    id:'',
    producttype_index: 0,
    unit_index: 0,
    grade_index:0,
    size_index:0,
    brand_index: 0,
  },
  bindDateChange: function(e) {
    var param = this.data.GoodsInfoData;
    var style = e.currentTarget.dataset.style;
    if (style == 'timeDown'){
      param.timeDown = e.detail.value;
      this.setData({
        GoodsInfoData: param
      })
    }else{
      param.timeUp = e.detail.value;
      this.setData({
        GoodsInfoData: param
      })
    } 
  },
  bindSelectorChange:function(e){
    var style = e.currentTarget.dataset.style;
    var param = this.data.GoodsInfoData;
    switch (style) {
      case 'unit_index':
        param.unit=this.data.screen_unitList[e.detail.value].unit;
        this.setData({
          unit_index: e.detail.value,
          GoodsInfoData: param
        });
        break;
      case 'grade_index':
        param.grade = this.data.screen_gradeList[e.detail.value];
        this.setData({
          grade_index: e.detail.value,
          GoodsInfoData: param
        })
        break;
      case 'brand_index':
        param.brandid = this.data.screen_brandList[e.detail.value].id;
        this.setData({
          brand_index: e.detail.value,
          GoodsInfoData: param
        })
       
        break;
      case 'producttype_index':
        param.producttype = this.data.screen_productTypeList[e.detail.value].id;
        this.setData({
          producttype_index: e.detail.value,
          GoodsInfoData: param         
        })
        console.log(this.data.GoodsInfoData.producttype)
        break;
      case 'size_index':
        param.sizes = this.data.screen_productSize[e.detail.value].value;
        this.setData({
          size_index: e.detail.value,
          GoodsInfoData: param
        })
        break;
    }
    
  },
  year: function (e) {
    const val = e.detail.value
    var param = this.data.GoodsInfoData;
    param.year = e.detail.value;
    this.setData({
      GoodsInfoData: param   
    })
  },
  //请求并显示货品详情
  showGoodsInfo:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductInit',
      data: {
        storeId: 1,
        id:that.data.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var answerData = res.data;
        answerData.timeDown = util.toDate(answerData.timeDown);
        answerData.timeUp = util.toDate(answerData.timeUp);
        for (var p in app.screen_productTypeList){
          if (app.screen_productTypeList[p].id == answerData.producttype){
            var typeNumber = p;
          }
        }
        for (var p in app.screen_brandList) {
          if (app.screen_brandList[p].id == answerData.brandid) {
            var brandNumber = p;
          }
        }
        that.setData({
          soruceData: util.api.Clone(answerData),
          GoodsInfoData: answerData, 
          id: answerData.id,
          producttype_index: typeNumber,
          brand_index: brandNumber
        });
        console.log(res)
      }
    })
  },
   // 提交修改或新增货品
  submitGoodsInfo:function(e){
    var that = this;
    var target = e.detail.value;
    target.year = target.year.substring(1, target.year.length)
    var objectSubmit = {};
    if(this.data.id !== ''){
      objectSubmit = util.api.getEntityModified(this.data.soruceData, target);
      objectSubmit.id = this.data.id;
      objectSubmit.storeId = 1
    }else{
      objectSubmit = target;
      objectSubmit.storeId = 1
    }
    console.log(objectSubmit); 
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/saveProduct',
      data:objectSubmit,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '保存成功',
          mask: true,
          duration: 2000
        })
        app.newid = that.data.id == "" ? res.data:null;
        if (that.data.id && objectSubmit.name){
          app.updataGoodsInfo = objectSubmit;  
        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
   
  },
  onLoad: function (options) {
    console.log(app)
    this.setData({
      screen_brandList: app.screen_brandList,
      screen_productTypeList: app.screen_productTypeList,
      screen_gradeList: app.screen_gradeList,
      screen_unitList: app.screen_unitList,
      screen_productSize: app.screen_productSize,
      GoodsInfoData: {
        brandid: app.screen_brandList[0].id,
        sizes: app.screen_productSize[0].value,
        grade: app.screen_gradeList[0],
        unit: app.screen_unitList[0].unit,
        producttype: app.screen_productTypeList[0].id,
        timeDown: util.formatTime(new Date),
        timeUp: util.formatTime(new Date),
        year: new Date().getFullYear()
      }
    });
    console.log(options)
    if (options.ID !== 'null'){
      this.setData({
        id: options.ID,
        title: options.name
      });
      this.showGoodsInfo()
    } 
  }
})