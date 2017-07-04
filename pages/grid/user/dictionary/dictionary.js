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
    addModal: true,
    discountModal: true,
    customerModal: true,
    scanModal: true,
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
  staff_add:function(){
    this.setData({
      staff_updata: "0",
    })
  },

  // 获取二维码
  scan: function () {
    var that = this
    function setdata(data) {
      that.setData(data)
    }
    util.api.scan(4, setdata)
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
        storeId: app.globalData.storeId
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
    objectSubmit.storeId = app.globalData.storeId;
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
              payProduct.push(res.data.datas[p]);
              break;
            case "FEE_TYPE":
              feeProduct.push(res.data.datas[p]);
              break;
            case "SELLING_METHOD":
              sellingProduct = res.data.datas[p];
              break;
            case "CUSTOMER_TYPE":
              customerProduct = res.data.datas[p]; 
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
        var images = res.data.images || [];
        var logisticFees = res.data.logisticFees
        app.customerCusts = customerCusts
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
  
  // 更改启用的客户种类
  cusgradeChange:function(e){
    var name = e.target.dataset.name;
    var product = this.data[name];
    var submitData = this.data.submitData;
    var param = {};
    if (name == "customerCusts"){
      product[this.data.customerIndex].prodgrade = e.detail.value + 1;
      console.log(e.detail.value)
      console.log(e.detail.value)
      submitData[name] = product;
      param[name] = product;
      param.submitData = submitData;
      this.setData(param);
      
    }else{
      console.log(e.detail.value)
      var max = e.detail.value + 1;
      var customerProduct = this.data.customerProduct;
      var num = [];
      for (var p in 'custo') {
        if (p <= max - 1) {
          num.push(Number(p) + Number(1))
        }
      }
      customerProduct.dictValue = num.join(",");
      submitData.customerProduct = customerProduct;
      this.setData(param);
      this.submitData()
    }

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
    that.submitData()
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
        console.log(JSON.parse(res.data))
        if (JSON.parse(res.data).code == 0){
          if (name == "images") {
            console.log(images)
            images[index] = util.api.imgUrl + JSON.parse(res.data).data.url;
            console.log(images)
            param.images = images;
            submitData.images = images;
          } else {
            payQrcode[index].dictValue = JSON.parse(res.data).data.url;
            param.payQrcode = payQrcode;
            submitData.payQrcode = payQrcode;
          }
          param.submitData = submitData
          that.setData(param);
          that.submitData()
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
  // 更改input
  changIput:function(e){
    var name = e.currentTarget.dataset.name;
    var product = this.data[name];
    var submitData = this.data.submitData;
    var index = e.currentTarget.dataset.index;
    var sellingProduct = this.data.sellingProduct; 
    var param = {};
    if (name == "pointExchange"){
      product.dictValue = e.detail.value;
    } else if (name == "customerCusts"){
      var type = sellingProduct.dictValue == 1 ? "custpricejson" :"discpricejson";
      product[index][type] = e.detail.value;
    }
    param[name] = product;
    submitData[name] = product;
    param['submitData'] = submitData;
    this.setData(param)
    if (name == "pointExchange") {
      this.submitData()
    }
  },
  // 添加费用单、分店、支付方式
  dictionaryAdd: function () {
    var addObject = this.data.addObject;
    var product = this.data[addObject.name]
    var newName = this.data.newName.replace(/ /g, '');
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
       
        this.submitData()
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
      freight: freight,
      freightUpdate: false,
    })
  },
  freightUpdate:function(){
    this.setData({
      freightUpdate: true
    })
  },
  // 货品售价生成方式
  goodsPrice:function(e){
    var that = this
    wx.showModal({
      title: '是否改变货品价格生成方式',
      success:function(){
        var type = e.currentTarget.dataset.type;
        var product = that.data[type];
        var submitData = that.data.submitData;
        var param = {};
        if(type == "sellingProduct") {
          product.dictValue = product.dictValue == 1 ? product.dictValue = 2 : product.dictValue = 1;
          product.dictText = product.dictValue == 1 ? product.dictText = "成本价*毛利率" : product.dictText = "吊牌价*折扣率";
        }
    submitData[type] = product;
        param[type] = product;
        that.setData(param);
        that.submitData()
      }
    })
  },
  // 模态框
  addModal: function (e) {
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
      addModal: false,
      modalTitle: title,
      addObject: addObject
    })
  },
  customerModal:function(e){
    this.setData({
      customerModal: false,
      customerIndex:e.target.dataset.index
    })
  },
  discountModal:function(){
    this.setData({
      discountModal: false,
    })
  },
  cancel: function () {
    this.setData({
      addModal: true,
      discountModal: true,
      customerModal: true,
      scanModal: true,
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
     var newSubmitData = [];
     var url = "dictionary/saveDataDictionary"
     console.log(submitData)
     for (var p in submitData){
       console.log(submitData[p])
       if(p == 'images'){
         newSubmitData = [{
           storeId: app.globalData.storeId,
           dictGroup:'IMAGE',
           dictValue: submitData[p].join(',').replace(/http:\/\/117.149.24.42:8788/g, ''),
           dictGroupName:'商品推广图片'
         }]
       } else if (p == 'sellingProduct' || p == "pointExchange" ||p=="customerProduct"){
          submitData[p].storeId = app.globalData.storeId
          newSubmitData.push(submitData[p])
          
       }else{
         for (var j in submitData[p]) {
           console.log(submitData[p])
          //  submitData[p][j].storeId = app.globalData.storeId
           newSubmitData.push(submitData[p][j])
           if (p == 'customerCusts'){
             url = 'dictionary/saveTypeOrGradeRate'
           }
         }
       }
     }
     console.log(newSubmitData)
     wx.showNavigationBarLoading()
     util.api.request({
       url: url,
       data: newSubmitData,
       method: 'POST',
       header: {
         'content-type': 'application/josn'
       },
       success: function (res) {
        that.setData({
          submitData:[]
        })
        if (p == 'customerCusts'){
          that.cancel()
        }
         wx.hideNavigationBarLoading();
         wx.showToast({
           title: "添加成功！",
           mask: true,
           duration: 2000
         })
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