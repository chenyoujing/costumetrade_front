var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
    id: '',
    producttype_index: 0,
    unit_index: 0,
    grade_index: 0,
    size_index: 0,
    brand_index: 0,
    title:'新增货品',
    picker_view: [
      { name: '名字', price: 0, discount: 0, profit: 0, pricename:"firsthPrice"},
      { name: '名字', price: 0, discount: 0, profit: 0, pricename:"secondPrice"},
      { name: '名字', price: 0, discount: 0, profit: 0, pricename:"thirdPrice"},
      { name: '名字', price: 0, discount: 0, profit: 0, pricename:"fourthPrice"},
      { name: '名字', price: 0, discount: 0, profit: 0, pricename:"fifthPrice"},
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
    changPrice_index:0,
    updataAut:false,
    firstBoolean:true
  },
  // 返回
  backdelta: function () {
    wx.navigateBack({
      delta: 1
    })
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
        if (param.unit == '添加') {
          this.sizeAdd('unit');
        }
        break;
      case 'grade_index':
        param.grade = this.data.screen_gradeList[e.detail.value].id;
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
        this.priceCalculate('tagprice', this.data.GoodsInfoData.tagprice);
        break;
      case 'producttype_index':
        param.producttype = this.data.screen_productTypeList[e.detail.value].id;
        this.setData({
          producttype_index: e.detail.value,
          GoodsInfoData: param         
        })
        break;
      case 'size_index':
        param.sizes = this.data.screen_productSize[e.detail.value].value;
        this.setData({
          size_index: e.detail.value,
          GoodsInfoData: param
        });
        if (param.sizes=='添加'){
          this.sizeAdd('sizes');
        }
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
        var newPicker = that.data.picker_view;
        newPicker[0].price = answerData.firsthPrice;
        newPicker[1].price = answerData.secondPrice;
        newPicker[2].price = answerData.thirdPrice;
        newPicker[3].price = answerData.fourthPrice;
        newPicker[4].price = answerData.fifthPrice;
        that.setData({
          soruceData: util.api.Clone(answerData),
          GoodsInfoData: answerData, 
          id: answerData.id,
          producttype_index: typeNumber,
          brand_index: brandNumber,
          picker_view: newPicker
        });
       
        that.gradeCate();
 
      }
    })
  },
   // 提交修改或新增货品
  submitGoodsInfo:function(e){
    var that = this;
    var target = e.detail.value;
    target.firsthPrice = this.data.picker_view[0].price ? this.data.picker_view[0].price:0;
    target.secondPrice = this.data.picker_view[1].price ? this.data.picker_view[1].price : 0;
    target.thirdPrice = this.data.picker_view[2].price ? this.data.picker_view[2].price : 0;
    target.fourthPrice = this.data.picker_view[3].price ? this.data.picker_view[3].price : 0;
    target.fifthPrice = this.data.picker_view[4].price ? this.data.picker_view[4].price : 0;
    console.log (e)
    target.year = target.year.substring(1, target.year.length)
    var objectSubmit = {};
    if(this.data.id !== ''){
      objectSubmit = util.api.getEntityModified(this.data.soruceData,target);
      objectSubmit.id = this.data.id;
      objectSubmit.storeId = 1
    }else{
      objectSubmit = target;
      objectSubmit.storeId = 1
    }
    console.log(objectSubmit);
    if (objectSubmit !== null){
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'product/saveProduct',
        data: objectSubmit,
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
          app.newid = that.data.id == "" ? res.data : null;
          if (that.data.id && objectSubmit.name) {
            app.updataGoodsInfo = objectSubmit;
          }
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }else{
      wx.showToast({
        title: '没有更改',
        mask: true,
        duration: 2000
      })
    }
  },
  // 计算价格
  priceCalculate:function(style,value){
    var param = this.data.GoodsInfoData;
    if(value !== 0){
      param[style] = value;
    }else{
      param[style] = ''
    }
    if (style == 'tagprice' && value>= 0) {
      param.purchaseprice = (value*this.data.screen_brandList[this.data.brand_index].profitD0 / 100).toFixed(2);
    }
    if (style == 'purchaseprice' && value>=0) {
      param.tagprice = (value / this.data.screen_brandList[this.data.brand_index].profitD0 * 100).toFixed(2);
    }
    this.setData({
      GoodsInfoData: param
    })
    this.gradeCate();
  },
  // input失去焦点
  blurInput:function(e){
    var style = e.currentTarget.dataset.name;
    var valuenum = e.detail.value ? e.detail.value:0;
    this.priceCalculate(style, valuenum);
  },
  // 等级、客户种类逻辑,五种价格
  gradeCate:function(type){
    var arry = [];
    var newPicker = [];
    var name = app.custOrDiscTag == 1 ? 'custPriceJson' :'discPriceJson';
    var pickername = app.custOrDiscTag == 1 ? 'profit' : 'discount';
    arry = app.custProdPrice[this.data.grade_index][name];
    var ben = parseInt(this.data.GoodsInfoData.purchaseprice) ? parseInt(this.data.GoodsInfoData.purchaseprice) : 0;
    var ben1 = this.data.GoodsInfoData.tagprice?this.data.GoodsInfoData.tagprice : 0;
    if (type) {
      newPicker = this.data.picker_view;
      for (var p in newPicker) {
        if (newPicker[p].price == type) {
          newPicker[p].discount = (type / ben1 * 100).toFixed(1) !== 'NaN' ? (type / ben1 * 100).toFixed(1) : 0;
          newPicker[p].profit = ((type - ben) / type * 100).toFixed(1);
          newPicker[p].price = type;
        }
      }
    } else if (!type && app.custOrDiscTag == 1){
      for (var p in arry) {
        var sale1 = (ben / (1 - arry[p].value / 100)).toFixed(2);
        sale1 = sale1 ? sale1 : 0;
        newPicker.push({
          name: arry[p].name,
          profit: arry[p].value,
          price: this.data.firstBoolean ? this.data.picker_view[p].price:sale1,
          discount: (sale1 / ben1 * 100).toFixed(1) !== 'NaN' ? (sale1 / ben1 * 100).toFixed(1) : 0
        })
      }
    } else if (!type && app.custOrDiscTag == 2){
      for (var p in arry) {
        var sale2 = (ben1 * arry[p].value / 100).toFixed(2);
        sale2 = sale2 ? 0 : sale2;
        newPicker.push({
          name: arry[p].name,
          discount: arry[p].value,
          price: this.data.firstBoolean ? this.data.picker_view[p].price : sale2,
          profit: (sale2 - ben / sale2).toFixed(1)
        })
      }
    }
    console.log(newPicker);
    this.setData({
      picker_view: newPicker,
      firstBoolean:false
    })
    
  },
  changPrice:function(e){
    var num = e.detail.value;
    this.setData({
      changPrice_index:num[0]
    })
  },
  checkboxChange:function(e){
    this.setData({
      updataAut: !this.data.updataAut
    })
  },
  blurInputPrice:function(e){
    var num = e.currentTarget.dataset.name;
    var arry = this.data.picker_view;
    arry[num].price = e.detail.value;
    this.setData({
      picker_view: arry
    })
    if (e.detail.value){
      this.gradeCate(e.detail.value);
    }
  },
  //尺码添加
  sizeAdd:function(type){
    var url = '';
    if(type == 'sizes'){
      url = '../GoodsColor/GoodsColor?url=size/getAllSizes&title=选尺码'
    } else if (type == 'unit'){
      url = '../GoodsColor/GoodsColor?url=unit/getAllUnits&title=添加单位'
    }
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function (options) {
    this.setData({
      screen_brandList: app.screen_brandList,
      screen_productTypeList: app.screen_productTypeList,
      screen_gradeList: app.screen_gradeList,
      screen_unitList: app.screen_unitList,
      screen_productSize: app.screen_productSize,
      GoodsInfoData: {
        brandid: app.screen_brandList[0].id,
        sizes: app.screen_productSize[0].value,
        grade: app.screen_gradeList[0].id,
        unit: app.screen_unitList[0].unit,
        producttype: app.screen_productTypeList[0].id,
        timeDown: util.formatTime(new Date),
        timeUp: util.formatTime(new Date),
        year: new Date().getFullYear()
      }
    });
    if (options.ID !== 'null'){
      this.setData({
        id: options.ID,
        title: options.name
      });
      this.showGoodsInfo();
    }else{
      this.gradeCate();
    }
  },
  onShow() {
    if (app.changeData) {
      var param = this.data.GoodsInfoData;
      if (app.nameChange == '颜色名称'){
        param.colors = util.api.getFilterArray(app.changeData);
        console.log(param.colors)
        this.setData({
          GoodsInfoData: param
        });
        app.changeData = "";
      } else if (app.nameChange == '尺码名称'){
        param.sizes = util.api.getFilterArray(app.changeData);
        app.screen_productSize.unshift({
          value: '新增',
          customname: param.sizes
        })
        this.setData({
          GoodsInfoData: param,
          size_index:0
        });
        app.changeData = "";
      } else if (app.nameChange == '单位名称') {
        param.unit = util.api.getFilterArray(app.changeData);
        app.screen_productSize.unshift({
          value: '新增',
          customname: param.unit
        })
        this.setData({
          GoodsInfoData: param,
          unit_index: 0
        });
        app.changeData = "";
      }
    }
  }
})