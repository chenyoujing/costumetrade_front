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
      { name: 'SEASON_SPRING', value: '春' },
      { name: 'SEASON_SUMMER', value: '夏' },
      { name: 'SEASON_AUTUMN', value: '秋' },
      { name: 'SEASON_WINTER', value: '冬' },
    ],
    screen_brandList:[],
    screen_productTypeList:[],
    screen_gradeList:[],
    screen_unitList:[],
    screen_productSize:[],
    id:'',
    name:'',
    code:'',
    colors:'',
    handcount:'',
    tagprice:'',
    purchaseprice:"",
    grade:"",
    season:'',
    sizes:'',
    year:'',
    timeDown: util.formatTime(new Date),
    timeUp: util.formatTime(new Date),
    producttype: ["无法连接数据库"],
    producttype_index: 0,
    brandid: ["无法连接数据库"],
    barcodes:'',
    image:"",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    brand_index: 0,
    unit: ["无法连接数据库"],
    unit_index: 0,
    grade_index:0,
    size_index:0
  },
  bindDateChange: function(e) {
    var style = e.currentTarget.dataset.style;
    if (style == 'timeDown'){
      this.setData({
        timeDown: e.detail.value
      })
    }else{
      this.setData({
        timeUp: e.detail.value
      })
    } 
  },
  bindSelectorChange:function(e){
    var style = e.currentTarget.dataset.style;
    switch (style) {
      case 'unit_index':
        this.setData({
          unit_index: e.detail.value,
          unit: this.data.screen_unitList[e.detail.value].unit
        })
        break;
      case 'grade_index':
        this.setData({
          grade_index: e.detail.value,
          grade: this.data.screen_gradeList[e.detail.value].id
        })
        break;
      case 'brand_index':
        this.setData({
          brand_index: e.detail.value,
          brandid: this.data.screen_brandList[e.detail.value].id
        })
        break;
      case 'producttype_index':
        this.setData({
          producttype_index: e.detail.value,
          producttype: this.data.screen_productTypeList[e.detail.value].id
        })
        break;
      case 'size_index':
        this.setData({
          size_index: e.detail.value,
          sizes: this.data.screen_productSize[e.detail.value].value
        })
        break;
    }
  },
  year: function (e) {
    const val = e.detail.value
    this.setData({
      year: val
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
        that.setData({
          id: answerData.id,
          name: answerData.name,
          code: answerData.code,
          colors: answerData.colors,
          handcount: answerData.handcount,
          tagprice: answerData.tagprice,
          purchaseprice: answerData.purchaseprice,
          grade: answerData.grade,
          season: answerData.season,
          sizes: answerData.sizes,
          year: answerData.year,
          timeDown: answerData.timeDown,
          timeUp: answerData.timeUp,
          producttype: answerData.producttype,
          producttype_index: answerData.producttype,
          brandid: answerData.brandid,
          brand_index: answerData.brandid,
          barcodes: answerData.barcodes,
          barcode: answerData.barcode,
          unit: answerData.unit
        });
        console.log(res)
      }
    })
  },
   // 提交修改或新增货品
  submitGoodsInfo:function(e){
    console.log(e.detail.value); 
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/saveProduct',
      data: {
        storeId: 1,
        code:5
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
        wx.showToast({
          title: '保存成功',
          mask: true,
          duration: 2000
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
      brandid: app.screen_brandList[0].id,
      sizes: app.screen_productSize[0].value,
      grade: app.screen_gradeList[0],
      unit: app.screen_unitList[0].unit,
      prducttype: app.screen_productTypeList[0].id
    });
    if (options.ID !== 'null'){
      this.setData({
        id: options.ID,
        title: options.name
      });
      this.showGoodsInfo()
    } 
  }
})