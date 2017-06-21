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
    brandList:[],
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
    branch_index:0,
    originalEmployeeDetails:{},
    privilegeIdsArray:[]
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
  //请求员工详情
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
        console.log(res.data);
        var custtypename_index = 0;
        var privilegeEmployees = that.data.privilegeEmployees;
        var privilegeIdsArray = that.data.privilegeIdsArray;
        for (var p in that.data.customerTypeList){
          if (that.data.customerTypeList[p].id == res.data.modifyPrice){
            custtypename_index = p;
          }
        }
        for (var p in privilegeEmployees){
          privilegeEmployees[p].checked = false;
          for (var j in res.data.privilegeEmployees){
            if (res.data.privilegeEmployees[j].privilegeId == privilegeEmployees[p].id){
              privilegeEmployees[p].checked = true;
              privilegeIdsArray.push({
                privilegeId: res.data.privilegeEmployees[j].privilegeId
              })
            }
          }
        }
        that.setData({
          staff_updata: "0",
          employeeDetails: res.data,
          originalEmployeeDetails: res.data,
          custtypename_index: custtypename_index,
          privilegeEmployees: privilegeEmployees,
          privilegeIdsArray: privilegeIdsArray
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
  employee_request: function (id) {
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
        console.log(that.data.employeeProduct)
      }
    })
  },
  // 员工改权限，改分店
  binChangeSale:function(e){
    var index = e.target.dataset.index;
    var name = index == 'custtypename_index' ? 'custtypename_index' :"branch_index";
    var nameValue = index == 'custtypename_index' ? 'modifyPrice' : "branch";
    var nameList = index == 'custtypename_index' ? this.data.customerTypeList : this.data.branchList;
    var param = {};
    param[name] = e.detail.value;
    param.employeeDetails = this.data.employeeDetails;
    param.employeeDetails[nameValue] = nameList[e.detail.value].id;
    console.log(param)
    this.setData(param)
  },
  // 员工去零、打折、名字
  employeeInfoChange:function(e){
    var index = e.target.dataset.index;
    var param = {};
    param = this.data.employeeDetails;
    param[index] = e.detail.value;
    console.log(param)
    this.setData({
      employeeDetails: param
    })
  },
  // 员工权限
  privilegeId:function(e){
    this.setData({
      privilegeIdsArray:e.detail.value
    })
  },
  // 保存员工
  employeeSubmit:function(){
    var that = this;
    var privilegeIdsArray = [];
    for (var p in this.data.privilegeIdsArray){
      privilegeIdsArray.push({
        privilegeId: this.data.privilegeIdsArray[p]
      })
    }
    var objectSubmit = util.api.getEntityModified(this.data.originalEmployeeDetails, this.data.employeeDetails);
    console.log(this.data.employeeDetails);
    console.log(this.data.originalEmployeeDetails);
    objectSubmit.privilegeEmployees = privilegeIdsArray;
    console.log(objectSubmit.privilegeEmployees);
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'employee/saveEmployee',
      data: objectSubmit,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        that.staff_updata_close()
      }
    })
  },
  // 运费规则
  freight:function(e){
    var freight = e.target.dataset.freight
    if (freight == this.data.freight){
      freight = ''
    }
    this.setData({
      freight: freight

    })
  },
  onLoad: function() {
    var that = this;
    if (!app.privilegeEmployees) {
      util.api.getProductInit();
    }
    console.log(app)
    this.employee_request()
  },
  
})