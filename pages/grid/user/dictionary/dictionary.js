var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    privilegeEmployees: [
    ],
    customerTypeList: [
    ],
    brandList:[],
    current: "0",
    dictionary: "1",
    staff_updata: "100%",
    employeeProduct:[],
    custtypename_index:0,
    branch_index:0,
    originalEmployeeDetails:{},
    privilegeIdsArray:[],
    employeesId:"",
    print:'wifi'
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
      customerTypeList: app.custProdPrice,
      employeesId:id
    })
    console.log(app.custProdPrice)
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
        var privilegeIdsArray = [];
        for (var p in that.data.customerTypeList){
          if (that.data.customerTypeList[p].custTypeCode == res.data.modifyPrice){
            custtypename_index = p;
          }
        }
        for (var p in privilegeEmployees){
          privilegeEmployees[p].checked = false;
          for (var j in res.data.privilegeEmployees){
            if (res.data.privilegeEmployees[j].privilegeId == privilegeEmployees[p].id){
              privilegeEmployees[p].checked = true;
              privilegeIdsArray.push(res.data.privilegeEmployees[j].privilegeId)
            }
          }
        }
        that.setData({
          originalEmployeeDetails: res.data
        })
        res.data.modifyPrice = res.data.modifyPrice || that.data.customerTypeList[0].custTypeCode;
        console.log(res.data)
        that.setData({
          staff_updata: "0",
          employeeDetails: res.data,
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
    console.log(this.data.customerTypeList)
    var param = {};
    param[name] = e.detail.value;
    param.employeeDetails = this.data.employeeDetails;
    param.employeeDetails[nameValue] = nameList[e.detail.value].custTypeCode;
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
    objectSubmit.privilegeEmployees = privilegeIdsArray;
    objectSubmit.storeId = 1;
    objectSubmit.employeesId = this.data.employeesId;
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
  // 请求数据
  dictionary_request: function (id) {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'dictionary/getDataDictionarys',
      data: {
        storeId: String(1)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data.datas)
        var payProduct = []
        var feeProduct = []
        var sellingProduct = []
        var customerProduct = []
        var productGrade = []
        for (var p in res.data.datas){
          switch (res.data.datas[p].dictGroup){
            case "PAY_TYPE":
              payProduct.push(res.data.datas[p])
              break;
            case "FEE_TYPE":
              console.log(res.data.datas[p])
              feeProduct.push(res.data.datas[p])
              break;
            case "SELLING_METHOD":
              sellingProduct.push(res.data.datas[p])
              break;
            case "CUSTOMER_TYPE":
              console.log(res.data.datas[p])
              customerProduct.push(res.data.datas[p])
              break;
            case "PRODUCT_GRADE":
              productGrade.push(res.data.datas[p])
              break;
          }
        }

        var customerCusts = res.data.customerCusts
        for (var p in res.data.images) {
          res.data.images[p] = util.api.imgUrl + res.data.images[p]
        }
        var images = res.data.images
        var logisticFees = res.data.logisticFees
        that.setData({
          payProduct: payProduct,
          feeProduct: feeProduct,
          sellingProduct: sellingProduct,
          customerProduct: customerProduct,
          productGrade: productGrade,
          customerCusts: customerCusts,
          images: images,
          logisticFees: logisticFees,
        })
        console.log(that.data)
      }
    })
  },
  // 选择打印
  print:function(e){
    var print = e.target.dataset.print
    if (print == this.data.print) {
      print = ''
    }
    this.setData({
      print: print

    })
  },
  // 运费规则
  freight:function(e){
    var freight = e.target.dataset.freight
    if (freight === this.data.freight){
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
    this.dictionary_request()
  },
  
})