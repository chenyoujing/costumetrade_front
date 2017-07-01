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
    print:'wifi',
    modal: true,
    submitData:[],
    addObject:{},
    cusDictValue:0,
    prodDictValue: 0
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
  /***********
   * 员工开始
   ***********/

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

  /***********
   * 员工结束
   ***********/

  /***********
   * 基础高级开始
   ***********/
  // 请求数据
  dictionary_request: function (id) {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'dictionary/getDataDictionarys',
      data: {
        storeId: app.globalData.storeId 
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
        var productGrade = [];
        var customerCusts = [];
        var pointExchange = [];
        var payQrcode = [];
        var cusDictValue = 0;
        for (var p in res.data.datas){
          switch (res.data.datas[p].dictGroup){
            case "PAY_TYPE":
              payProduct.push(res.data.datas[p])
              break;
            case "FEE_TYPE":
              feeProduct.push(res.data.datas[p])
              break;
            case "SELLING_METHOD":
              sellingProduct.push(res.data.datas[p])
              break;
            case "CUSTOMER_TYPE":
              customerProduct = res.data.datas[p]
              break;
            case "PRODUCT_GRADE":
              productGrade.push(res.data.datas[p])
              break;
            case "POINT_EXCHANGE":
              pointExchange = res.data.datas[p]
              break;
            case "PAY_QRCODE":
              payQrcode.push(res.data.datas[p])
              break;
          }
        }
        cusDictValue = customerProduct.dictValue.split(',');
        // 可见货品等级
        customerCusts = res.data.customerCusts;
        for (var g in customerCusts){
          for (var j in productGrade){
            if (customerCusts[g].prodgrade == productGrade[j].dictValue){
              customerCusts[g].prodgradeName = productGrade[j].dictText
            }
          }
        }
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
          cusDictValue: cusDictValue[cusDictValue.length-1],
          pointExchange: pointExchange,
          payQrcode: payQrcode
        })
        console.log(that.data)
      }
    })
  },
  // 货品售价生成方式
  
  // 更改启用的客户种类
  cusgradeChange:function(e){
    var name = e.target.dataset.name;
    var param = {};
    param[name] = e.detail.value + 1;
    this.setData(param);
  },
  // 删除费用单、分店、支付方式
  dictionaryDelet:function(e){
    var submitData = this.data.submitData;
    var index = e.target.dataset.index;
    var name = e.target.dataset.name;
    var product = this.data[name];
    var param = {};
    product.splice(index,1);
    param[name] = product;
    submitData[name] = product;
    param['submitData'] = submitData;
    this.setData(param)
  },
  // 上传图片
  photoSubmit: function (file, i,e) {
    var name = e.target.dataset.name;
    var index = e.target.dataset.index;
    var images = this.data.images;
    var payQrcode = this.data.payQrcode;
    var that = this;
    var submitData = this.data.submitData;
    var param = {};
    wx.uploadFile({
      url: util.api.host + 'product/uploadImage',
      filePath: file[i],
      name: 'file',
      success: function (res) {
       
        if (JSON.parse(res.data).code == 0){
          if (name == "images") {
            images[index] = util.api.imgUrl + JSON.parse(res.data).data.url;
            param.images = images;
            submitData.images = images;
          } else {
            payQrcode[index].dictValue = JSON.parse(res.data).data.url;
            param.payQrcode = payQrcode;
            submitData.payQrcode = payQrcode;
          }
          param.submitData = submitData
          that.setData(param);
          wx.showToast({
            title: '上传成功',
            mask: true,
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '失败',
            mask: true,
            duration: 2000
          })
        }
      }
    })
  },
  // 上传图片
  chooseVideoCallback: function (e, res){
    var tempFilePaths = res.tempFilePaths;
    this.photoSubmit(tempFilePaths,0,e);
  },
  choosImage:function(e){
    util.api.chooseImg(e, this.chooseVideoCallback)
  },
  // input
  newName:function(e){
    this.setData({
      newName:e.detail.value
    })
  },
  // 添加费用单、分店、支付方式
  dictionaryAdd: function () {
    var addObject = this.data.addObject;
    var product = this.data[addObject.name]
    var newName = this.data.newName;
    var submitData = this.data.submitData;
    var param = {};
    var add = true;
    if (!newName){
      wx.showToast({
        title: '请输入内容',
        mask: true,
        duration: 2000
      })
    }else {
      for (var p in product){
        if (product[p].dictText == newName){
          wx.showToast({
            title: '已存在，请修改',
            mask: true,
            duration: 2000
          })
          add = false
        }
      }
      if (add){
        addObject.datas.dictText = newName;
        addObject.datas.dictValue = newName;
        addObject.datas.storeId = app.globalData.storeId;
        product.push(addObject.datas);
        submitData[addObject.name] = product;
        param[addObject.name] = product;
        param["submitData"] = submitData;
        this.setData(param)
        wx.showToast({
          title: "添加成功！",
          mask: true,
          duration: 2000
        })
        this.cancel();
      }
    }
  },
  // 运费规则
  freight: function (e) {
    var freight = e.target.dataset.freight
    if (freight === this.data.freight) {
      freight = ''
    }
    this.setData({
      freight: freight

    })
  },
  modal: function (e) {
    var title = '';
    var addObject = this.data.addObject;
    var dictGroup = "";
    var dictGroupName = "";
    var name = '';
    switch (e.target.dataset.type) {
      case ('pay'):
        title = "添加付款方式";
        dictGroup = "PAY_TYPE";
        dictGroupName = "支付方式";
        name = "payProduct"
        break;
      case ('fee'):
        title = "添加费用单类型";
        dictGroup = "FEE_TYPE";
        dictGroupName = "费用类型";
        name = "feeProduct"
        break;
    }
    addObject.name = name;
    addObject.datas = {
      dictGroup: dictGroup,
      dictGroupName: dictGroupName
    };
    this.setData({
      modal: false,
      modalTitle: title,
      addObject: addObject
    })
  },
  cancel: function () {
    this.setData({
      modal: true
    })
  },
  /***********
   * 基础高级结束
   ***********/

   /***********
   * 打印开始 *
   ***********/
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
 /***********
   * 打印结束 *
   ***********/
    /***********
   * 提交方法 *
   ***********/
   submitData:function(){
     var that = this;
     var submitData = this.data.submitData;
     var customerProduct = this.data.customerProduct;
     var num = [];
     for (var p in 'custo'){
       if (p <= this.data.cusDictValue-1){
         num.push(p+1)
       }
     }
     customerProduct.dictValue = num.join(",");
     submitData.customerProduct = customerProduct;
     wx.showNavigationBarLoading()
     util.api.request({
       url: 'dictionary/saveDataDictionarys',
       data: {
         storeId: app.globalData.storeId
       },
       method: 'POST',
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       success: function (res) {
         wx.hideNavigationBarLoading();
       }
     })
   },
  onLoad: function() {
    var that = this;
    if (!app.privilegeEmployees) {
      util.api.getProductInit();
    }
    this.employee_request()
    this.dictionary_request()
  },
  
})