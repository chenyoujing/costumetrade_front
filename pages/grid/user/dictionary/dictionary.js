var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    privilegeEmployees: [
    ],
    goods_level: [
      { name: 'USA', value: '处理' },
      { name: 'CHN', value: '促销' },
      { name: 'BRA', value: '在销' },
      { name: 'JPN', value: '热销' },
      { name: 'USA', value: '最新' },
    ],
    customerTypeList: [
    ],
    goods_level3: [
      { name: 'USA', value: '90%' },
      { name: 'CHN', value: '80%' },
      { name: 'BRA', value: '70%' },
      { name: 'JPN', value: '60%' },
      { name: 'USA', value: '50%' },
    ],
    current: "0",
    dictionary: "1",
    staff_updata: "100%",
    employeeProduct:[],
    custtypename_index:0,
    custtypename:''
  },
  swiper_change: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  dictionarytype: function (e) {
    var that = this
    let data = e.target.dataset
    this.setData({
      current: data.dictionary,
    })
  },
  staff_updata: function (e) {
    var id = e.target.dataset.id;
    var that = this;
    this.setData({
      privilegeEmployees: app.privilegeEmployees,
      customerTypeList: app.customerTypeList
    })
    console.log(app.customerTypeList)
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'employee/getEmployee',
      data: {
        empId: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        that.setData({
          staff_updata: "0",
          employeeDetails: res.data
        })
      }
    })
  },
  staff_updata_close: function (e) {
    this.setData({
      staff_updata: "100%"
    })
  },
  // 请求数据
  stock_request: function (id) {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'employee/getAllEmployees',
      data: {
        storeId: String(1)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        that.setData({
          employeeProduct:res.data
        })
      }
    })
  },
  onLoad: function() {
    var that = this;
    if (!app.privilegeEmployees) {
      util.api.getProductInit();
    }
    console.log(app)
    this.stock_request()
  },
  
})