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
    Op: 'desc',
    getSortData: {
      value: 'timeUpOp',
      op: 'desc'
    },
    code: '',
    getFilterData: [],
    condition: "100%",
    scroll_height: "",
    screen_content_height: "30px",
    screen_display: "none",
    screen_opacity: "",
    more_function_display: "none",
    animation: "",
    pageNum: 1,
    loadMore: true,
    requestSwitch: true,
    delete_checkbox: '0',
    delete_button: '0',
    ids:[],
    aa:''
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
        code: that.data.code,
        pageNum: that.data.pageNum,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = that.data.product;
        var booleanre = that.data.requestSwitch;
        for (var p in res.data) {
          res.data[p].timeUp = util.toDate(res.data[p].timeUp)
        }
        if (that.data.pageNum == 1) {
          data = res.data;
        } else {
          for (var p in res.data) {
            data.push(res.data[p])
          }
        }
        if (res.data.length < 10) {
          booleanre = false;
        } else {
          booleanre = true;
        }
        that.setData({
          product: data,
          loadMore: true,
          requestSwitch: booleanre
        })
      }
    })
  },
  // 三种排序效果切换
  changeSortData: function (e) {
    var status = e.currentTarget.dataset.sort;
    var op = this.data.Op ? this.data.Op : 'desc';
    if (op == 'desc') {
      op = 'asc'
    } else {
      op = 'desc'
    }
    this.setData({
      state: status,
      Op: op,
      getSortData: {
        value: status,
        op: op
      },
      pageNum: 1,
      product: [],
      requestSwitch: true
    });
    this.page_request();
  },
  // 点击更多执行方法
  more: function () {
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
  hideCheckbox: function () {
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
  screen: function (e) {
    var status = e.currentTarget.dataset.name;
    if (status == this.data.state) {
      //判断第二次点击隐藏
      this.hideCheckbox();
    } else {
      //点击展示过滤条件
      this.setData({
        state: status,
        screen_content_height: "30px"
      });
    }
  },
  //点击确定加载数据
  packPageFilterRule: function (e) {
    var boolean = true;
    this.hideCheckbox();
    if (e.target.dataset.screen.length !== 0) {
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
          value: screen,
          pageNum: 1,
          product: [],
          requestSwitch: true
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
  packPageFilterCode: function () {
    this.setData({
      pageNum: 1,
      product: [],
      requestSwitch: true
    });
    this.page_request();
  },
  //重置
  resetting: function (e) {
    var state = e.target.dataset.screen;
    for (var p in this.data.getFilterData) {
      if (this.data.getFilterData[p].filed == state) {
        this.data.getFilterData[p].value = '';
        break;
      }
    }
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
  //滚动到底部触发事件  
  onReachBottom: function () {
    console.log('到底不了')
    this.setData({
      pageNum: this.data.pageNum + 1,
      loadMore: false
    });
    console.log(this.data.pageNum)
    if (this.data.requestSwitch) {
      this.page_request();
    }
  },
  // 批量删除
  batch_delete: function () {
    this.setData({
      delete_checkbox: '50',
      delete_button: '40'
    })
    this.more_function_close();
  },
  // 完成批量删除
  batch_delete_ok: function () {
    this.setData({
      delete_checkbox: '0',
      delete_button: '0'
    })
  },
  batch_delete_sure:function(){
    this.delectRequest()
  },
  delete_container:function(e){
    var ids = e.target.dataset.id;
    var boolean2 = true;
    var idsArray = this.data.ids;
    for (var p in idsArray){
      if(idsArray[p] == ids){
        idsArray.splice(p,1);
        boolean2 = false;
        break;
      }
    }
    if (boolean2){
      idsArray.push(ids)
    }
    this.setData({
      ids: idsArray
    })
   
    console.log(idsArray)
  },
  delectRequest:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/updateProducts',
      data: {
        storeId: 1,
        idArray: that.data.ids
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var product = that.data.product;
        for (var p in that.data.ids) {
          for (var j in product) {
            if (that.data.ids[p] == product[j].id) {
              product.splice(j, 1)
            }
          }
        }
        that.setData({
          product: product,
          aa:false
        })
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
      }
    })
  },
  onLoad() {
    this.page_request();
    util.api.getProductInit();
  },
  onShow() {
    var newProduct = this.data.product;
    console.log(app)
    if (app.newid) {
      this.page_request();
      app.newid = "";
    } else {
      for (var p in newProduct) {
        if (newProduct[p].id == app.updataGoodsInfo.id) {
          newProduct[p].name = app.updataGoodsInfo.name;
          newProduct[p].image = app.updataGoodsInfo.image;
          break;
        }
      }
      this.setData({
        product: newProduct
      })
      app.updataGoodsInfo = {};
    }
  }
});
