var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    product: [],
    screen_content1: [],
    screen_content2: [],
    screen_content3: [
      { name: 'SEASON_SPRING', value: '春' },
      { name: 'SEASON_SUMMER', value: '夏' },
      { name: 'SEASON_AUTUMN', value: '秋' },
      { name: 'SEASON_WINTER', value: '冬' },
    ],
    screen_content4: [
      { name: '0', value: '正常' },
      { name: '1', value: '待处理' },
      { name: '2', value: '报废' },
    ],
    state: 'timeUpOp',
    Op:'desc',
    getSortData: {
      value: 'timeUpOp',
      op: 'desc'
    },
    code:'',
    getFilterData:[],
    condition: "100%",
    scroll_height: "",
    screen_content_height: "30px",
    screen_display: "none",
    screen_opacity: "",
    more_function_display: "none",
    animation: "",
  },
  // 请求数据函数
  page_request: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProducts',
      data: {
        storeId: 1,
        sort: that.data.getSortData,
        rules: that.data.getFilterData,
        code: that.data.code
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        for (var p in res.data){
          res.data[p].timeUp = util.toDate(res.data[p].timeUp)
        }
        that.setData({
          product: res.data
        })
      }
    })
  },
  // 三种排序效果切换
  changeSortData:function(e){
    var status = e.currentTarget.dataset.sort;
    var op = this.data.Op ? this.data.Op:'desc';
    if (op == 'desc'){
        op = 'asc'
    }else{
      op = 'desc'
    }
    this.setData({
      state: status,
      Op: op,
      getSortData: {
        value: status,
        op: op
      }
    });
    this.page_request();
  },
// 点击更多执行方法
  more:function () {
    this.setData({
      screen_content1: app.screen_brandList,
      screen_content2: app.screen_productTypeList,
      condition: "0"
    })
  },
  //返回排序
  back: function () {
    this.setData({
      condition: "100%",
      screen: "",
      screen_content_height: "-270px",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      screen_opacity: animation.export(),
    })
    setTimeout(() => {
      this.setData({
        screen_display: "none",
      })
    }, 300)
  },
  //隐藏代码
  hideCheckbox:function(){
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      screen_opacity: animation.export(),
      screen: "",
      screen_content_height: "-270px",
    })
    setTimeout(() => {
      this.setData({
        screen_display: "none",
      })
    }, 300)
  },
  //过滤字段切换
  screen:function(e){
    var status = e.currentTarget.dataset.name;
    if (status == this.data.state) {
       //判断第二次点击隐藏
      this.hideCheckbox();
    }else{
      //点击展示过滤条件
      this.setData({
        state: status,
        screen_content_height: "30px"
      });
    }  
  },
  //点击确定加载数据
  packPageFilterRule:function(e){
    var boolean = true;
    this.hideCheckbox();
    if (e.target.dataset.screen.length !== 0){
      let data = e.target.dataset.screen;
      var screen = e.detail.value.screen;
      for (var p in this.data.getFilterData) {
        if (this.data.getFilterData[p].filed == data) {
          this.data.getFilterData[p].value = screen;
          boolean = false;
          break;
        }
      }
      if (boolean) {
        this.data.getFilterData.push({
          filed: data,
          value: screen
        })
      }
      this.page_request();
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //搜索货号
  packPageFilterCode:function(){
    this.page_request();
  },
  //重置
  resetting:function(e){
    var state = e.target.dataset.screen;
    for (var p in this.data.getFilterData) {
      if(this.data.getFilterData[p].filed == state) {
        this.data.getFilterData[p].value = '';
        break;
      }
    }
  },
  // 打开多功能键
  more_function:function(){
    this.setData({
      more_function_display: "block",
    })
    setTimeout(() => {
      this.setData({
        animation: "animation",
      })
    }, 1)
  },
  // 关闭多功能键
  more_function_close:function(){
    this.setData({
      animation: "",
    })
    setTimeout(() => {
      this.setData({
        more_function_display: "none",
      })
    }, 300)
  },
  onLoad() {
    this.page_request();
    util.api.getProductInit();
  },
  onShow(){
    var newProduct = this.data.product;
    console.log(app)
    if (app.newid){
      this.page_request();
      app.newid="";
    }else{
      for (var p in newProduct){
        if (newProduct[p].id == app.updataGoodsInfo.id){
          newProduct[p].name = app.updataGoodsInfo.name;
          break;
        }
      }
      this.setData({
        product: newProduct
      })
      app.updataGoodsInfo = {};
    }
    console.log('back')
  }
});
