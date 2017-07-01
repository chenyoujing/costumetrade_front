var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
    id: '',
    grade_index: 0,
    title:'新增货品',
    picker_view: [
      { name: '名字', price: 0, discPriceJson: 0, custPriceJson: 0,isUse:false,isChage:false, pricename:"firsthPrice"},
      { name: '名字', price: 0, discPriceJson: 0, custPriceJson: 0, isUse: false, isChage: false,pricename:"secondPrice"},
      { name: '名字', price: 0, discPriceJson: 0, custPriceJson: 0, isUse: false, isChage: false,pricename:"thirdPrice"},
      { name: '名字', price: 0, discPriceJson: 0, custPriceJson: 0, isUse: false, isChage: false,pricename:"fourthPrice"},
      { name: '名字', price: 0, discPriceJson: 0, custPriceJson: 0, isUse: false, isChage: false,pricename:"fifthPrice"},
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
    brand:'',
    producttype:'',
    unit:'',
    brand_index:0,
    GoodsInfoData:{},
    soruceData:{},
    changPrice_index:0,
    firstBoolean:false,
    perImgSrc:'image',
    fileList:[
      {
        storeId: 1,
        filename: 'image',
        url: '',
        productName: '',
        resizeFixUrl:""
      },
      {
        storeId: 1,
        filename: 'image1',
        url: '',
        productName: '',
        resizeFixUrl: ""
      },
      {
        storeId: 1,
        filename: 'image2',
        url: '',
        productName: '',
        resizeFixUrl: ""
      },
      {
        storeId: 1,
        filename: 'image3',
        url: '',
        productName: '',
        resizeFixUrl: ""
      },
      {
        storeId: 1,
        filename: 'image4',
        url: '',
        productName: '',
        resizeFixUrl: ""
      }
    ],
    priceUpdate: true,
    userIdentity: '',
    privilegeEmployees: false,
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
      case 'grade_index':
        param.grade = this.data.screen_gradeList[e.detail.value].dictValue;
        this.setData({
          grade_index: e.detail.value,
          GoodsInfoData: param
        })
        break;
    }
    
  },
  year: function (e) {
    console.log(e)
    const val = e.detail.value
    var param = this.data.GoodsInfoData;
    param.year = e.detail.value;
    this.setData({
      GoodsInfoData: param   
    })
  },
  // 上传图片
  photoSubmit: function (file, i){
    var that = this;
    wx.uploadFile({
      url: util.api.host + 'product/uploadImage', 
      filePath: file[i],
      name: 'file',
      success: function (res) {
        console.log(JSON.stringify(res));
        var url = util.api.imgUrl + JSON.parse(res.data).data.url;
        var resizeFixUrl = util.api.imgUrl + JSON.parse(res.data).data.resizeFixUrl;
       
        var param = that.data.GoodsInfoData;
        var fileArray = that.data.fileList;
        param[that.data.perImgSrc] = url;
        for (var p in fileArray){
          if (fileArray[p].filename == that.data.perImgSrc){
            fileArray[p].url = JSON.parse(res.data).data.url;
            fileArray[p].resizeFixUrl = JSON.parse(res.data).data.resizeFixUrl;
          }
        }
        that.setData({
          GoodsInfoData:param,
          fileList: fileArray
        }) 
      }
    })
  },
  
  // 选择图片
  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.photoSubmit(tempFilePaths, 0);
        that.setData({
          perImgSrc:e.target.dataset.index
        })
      }
    })
  }, 
  // 选择视频
  chooseVideo:function(e){
    var that = this;
    wx.chooseVideo({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = [];
        tempFilePaths.push(res.tempFilePath);
        that.photoSubmit(tempFilePaths, 0);
        that.setData({
          perImgSrc: e.target.dataset.index
        })
        console.log(e.target.dataset.index)
      }
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
        var typeName = '';
        var unitName = "";
        var brandName = "";
        var gradeNumber = ""
        var brandNumber = ""
        var answerData = res.data;
        answerData.timeDown = util.toDate(answerData.timeDown);
        answerData.timeUp = util.toDate(answerData.timeUp);
         console.log(util.api.imgUrl)
         answerData.image = answerData.image?util.api.imgUrl + answerData.image:'';
         answerData.image1 = answerData.image1?util.api.imgUrl + answerData.image1:'';
         answerData.image2 = answerData.image2 ? util.api.imgUrl + answerData.image2 : '';
         answerData.image3 = answerData.image3 ? util.api.imgUrl + answerData.image3 : '';
         answerData.image4 = answerData.image4 ? util.api.imgUrl + answerData.image4 : '';
         answerData.video1 = answerData.video1 ? util.api.imgUrl + answerData.video1 : '';
         answerData.video2 = answerData.video2 ? util.api.imgUrl + answerData.video2 : '';
         answerData.video3 = answerData.video3 ? util.api.imgUrl + answerData.video3 : '';
        
        for (var p in app.screen_productTypeList){
          if (app.screen_productTypeList[p].id == answerData.producttype){
            typeName = app.screen_productTypeList[p].catename;
          }
        }
        for (var p in app.screen_brandList) {
          if (app.screen_brandList[p].id == answerData.brandid) {
            brandName = app.screen_brandList[p].brandname;
            brandNumber = p;
          }
        }
        for (var p in app.screen_unitList) {
          if (app.screen_unitList[p].id == answerData.unit) {
            unitName = app.screen_unitList[p].unit;
          }
        }
        for (var p in app.screen_gradeList) {
          if (app.screen_gradeList[p].dictValue == answerData.grade) {
            gradeNumber = p;
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
          producttype: typeName,
          brand: brandName,
          unit: unitName,
          grade_index: gradeNumber,
          picker_view: newPicker,
          brand_index: brandNumber,
          firstBoolean: true
        });
        that.initializeData();
        that.GoodsImage();
      }
    })
  },
  // 更改单选框
  radioChange:function(e){
    var check = e.detail.value;
    var name = e.target.dataset.name;
    var GoodsInfoData = this.data.GoodsInfoData;
    GoodsInfoData[name] = e.detail.value;
    this.setData({
      GoodsInfoData: GoodsInfoData
    })
    if (name == 'isPattern'){
      this.priceRaise(check)
    }
  },
  // 打开加价表
  priceRaise: function (check){
    var GoodsInfoData = this.data.GoodsInfoData;
    console.log(GoodsInfoData.priceJsons)
    if (check == 1){
      console.log(check)
      app.changeData = GoodsInfoData.priceJsons;
      app.nameChange = '加价表';
      wx.navigateTo({
        url: '../styleMarkup/styleMarkup?colors=' + GoodsInfoData.colors + '&sizes=' + GoodsInfoData.sizes + '&name=' + GoodsInfoData.name
      })
    }
    this.setData({
      GoodsInfoData: GoodsInfoData
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
    if (this.data.GoodsInfoData.image){
      target.image = this.data.GoodsInfoData.image.replace(/http:\/\/117.149.24.42:8788/g, '');
    }
    if (this.data.GoodsInfoData.image1){
      target.image1 = this.data.GoodsInfoData.image1.replace(/http:\/\/117.149.24.42:8788/g, '');
      console.log(this.data.GoodsInfoData)
    }
    if (this.data.GoodsInfoData.image2){
      target.image2 = this.data.GoodsInfoData.image2.replace(/http:\/\/117.149.24.42:8788/g, '');
    }
    if (this.data.GoodsInfoData.image3){
      console.log(this.data.GoodsInfoData)
      target.image3 = this.data.GoodsInfoData.image3.replace(/http:\/\/117.149.24.42:8788/g, '');
    }
    if (this.data.GoodsInfoData.image4){
      target.image4 = this.data.GoodsInfoData.image4.replace(/http:\/\/117.149.24.42:8788/g, '');
    }
    if (this.data.GoodsInfoData.video1){
      target.video1 = this.data.GoodsInfoData.video1.replace(/http:\/\/117.149.24.42:8788/g, '');
    }
    if (this.data.GoodsInfoData.video2){
      target.video2 = this.data.GoodsInfoData.video2.replace(/http:\/\/117.149.24.42:8788/g, '');
    }
    if (this.data.GoodsInfoData.video3){
      target.video3 = this.data.GoodsInfoData.video3.replace(/http:\/\/117.149.24.42:8788/g, '');
    } 
    target.raise_price = this.data.GoodsInfoData.priceJsons;
    target.fileList = this.data.fileList;
    for (var p = target.fileList.length - 1; p >= 0; p--) {
      if (target.fileList[p].url !== '') {
        target.fileList[p].productName = target.name;
      } else {
        target.fileList.splice(p, 1)
      }
    }
    for (var p in app.screen_productTypeList) {
      if (app.screen_productTypeList[p].catename == target.producttype) {
        target.producttype = app.screen_productTypeList[p].id;
      }
    }
    for (var p in app.screen_brandList) {
      if (app.screen_brandList[p].brandname == target.brandid) {
        target.brandid = app.screen_brandList[p].id;
      }
    }
    for (var p in app.screen_unitList) {
      if (app.screen_unitList[p].unit == target.unit) {
        target.unit = app.screen_unitList[p].id;
      }
    }
    var objectSubmit = {};
    if(this.data.id !== ''){
      objectSubmit = util.api.getEntityModified(this.data.soruceData,target);
      objectSubmit.id = this.data.id;
      objectSubmit.storeId = 1
    }else{
      objectSubmit = target;
      objectSubmit.storeId = 1,
      objectSubmit.id = undefined,
      target.name = target.code + target.name
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
          var totalProduct = []
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '保存成功',
            mask: true,
            duration: 2000
          })
          // 货品
          wx.getStorage({
            key: 'GoodsData',
            success: function (res) {
              totalProduct = res.data ? res.data:[];
              if (that.data.id) {
                // 更新货品缓存
                for (var p in totalProduct) {
                  if (totalProduct[p].id = that.data.id) {
                    for (var j in objectSubmit) {
                      totalProduct[p][j] = objectSubmit[j]
                    }
                    break;
                  }
                }
                if (objectSubmit.name || objectSubmit.image) {
                  app.updataGoodsInfo = that.data.GoodsInfoData;
                }
              } else {
                totalProduct.unshift(objectSubmit)
              }
              wx.setStorage({
                key: "GoodsData",
                data: totalProduct
              })
            }
          })
          app.newid = that.data.id == "" ? res.data : null;
         
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
    // 检测吊牌价与进货价是否存在
  checkboxChange: function (e) {
    if (!this.data.GoodsInfoData.purchaseprice && this.data.privilegeEmployees) {
      wx.showToast({
        title: '请先输入进货价',
        mask: true,
        duration: 2000
      })
    } else if (!this.data.GoodsInfoData.tagprice) {
      wx.showToast({
        title: '请先输入吊牌价',
        mask: true,
        duration: 2000
      })
    } else {
      this.setData({
        priceUpdate: false
      })
      
    }
  },
  cancel: function () {
    this.setData({
      priceUpdate: true
    })
  },
  // 搜索图片
  GoodsImage: function () {
    app.imageinfo = {}
    if (this.data.GoodsInfoData.id) {
      console.log(11)
      app.imageinfo.image = this.data.GoodsInfoData.image
      app.imageinfo.image1 = this.data.GoodsInfoData.image1
      app.imageinfo.image2 = this.data.GoodsInfoData.image2
      app.imageinfo.image3 = this.data.GoodsInfoData.image3
      app.imageinfo.image4 = this.data.GoodsInfoData.image4
      app.imageinfo.id = this.data.GoodsInfoData.id
    }
    app.imageinfo.storeId = this.data.GoodsInfoData.storeId
    app.imageinfo.productName = this.data.GoodsInfoData.productName
  },
  //更改销售价、折扣价、毛利率
  blurInputPrice: function (e) {
    var newPicker = this.data.picker_view;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value ? e.detail.value:0;
    var purchaseprice = this.data.GoodsInfoData.purchaseprice?parseFloat(this.data.GoodsInfoData.purchaseprice):0;
    console.log(value)
    if (name == "price"){
      newPicker[index].price = value?value:"";
      newPicker[index].discPriceJson = (value / this.data.GoodsInfoData.tagprice * 100).toFixed(1);
      if (purchaseprice !== 0){
        newPicker[index].custPriceJson = ((value - purchaseprice) / purchaseprice * 100).toFixed(1)
      }
    } else if (name == "discPriceJson"){
      console.log(value)
      newPicker[index].discPriceJson = value ? value : "";
      newPicker[index].price = (value * this.data.GoodsInfoData.tagprice / 100).toFixed(1);
      console.log(value)
      newPicker[index].custPriceJson = ((newPicker[index].price - purchaseprice) / purchaseprice * 100).toFixed(1)
    } else if (name == "custPriceJson") {
      newPicker[index].custPriceJson = value ? value : "";
      newPicker[index].price = ((parseFloat(value) * purchaseprice / 100) + purchaseprice).toFixed(1);
      newPicker[index].discPriceJson = (newPicker[index].price / this.data.GoodsInfoData.tagprice * 100).toFixed(1)
    }
    this.setData({
      picker_view: newPicker
    })
  },
  // input失去焦点
  blurInput: function (e) {
    var style = e.currentTarget.dataset.name;
    var valuenum = e.detail.value ? e.detail.value : 0;
    var GoodsInfoData = this.data.GoodsInfoData;
    GoodsInfoData[style] = valuenum ? valuenum:"";
    this.setData({
      GoodsInfoData: GoodsInfoData
    })
    if (app.custOrDiscTag == 1 && style == "tagprice") {
      this.custPrice(this.data.GoodsInfoData.purchaseprice, valuenum)
    } else if (app.custOrDiscTag == 1 && style == "purchaseprice") {
      this.custPrice(valuenum, this.data.GoodsInfoData.tagprice)
    }else if (app.custOrDiscTag == 2 && style == "purchaseprice") {
      this.discPrice(valuenum, this.data.GoodsInfoData.tagprice)
    } else if (app.custOrDiscTag == 1 && style == "tagprice") {
      this.discPrice(this.data.GoodsInfoData.purchaseprice, valuenum)
    }
  },
  // 按折扣计算
  discPrice: function (purchaseprice,tagprice){
    purchaseprice = purchaseprice ? purchaseprice : 0;
    tagprice = tagprice ? tagprice : 0;
    var newPicker = this.data.picker_view;
    for (var p in newPicker) {
      if (!this.data.firstBoolean) {
        newPicker[p].price = (tagprice * newPicker[p].discPriceJson / 100).toFixed(2);
        newPicker[p].custPriceJson = ((newPicker[p].price - purchaseprice) / purchaseprice).toFixed(2);
        
      }else{
      newPicker[p].discPriceJson = (newPicker[p].price / tagprice * 100).toFixed(1);
      if (purchaseprice !== 0) {
        newPicker[p].custPriceJson = ((newPicker[p].price - purchaseprice) / purchaseprice * 100).toFixed(1)
       }
      }
      newPicker[p].custPriceJson = newPicker[p].custPriceJson == "Infinity" ? 100 : newPicker[p].custPriceJson;
      newPicker[p].custPriceJson = newPicker[p].custPriceJson == "NaN" ? 0 : newPicker[p].custPriceJson;
    }
    this.setData({
      picker_view: newPicker,
      firstBoolean: false
    })
  },
  // 按毛利率计算
  custPrice: function (purchaseprice,tagprice){
    purchaseprice = purchaseprice ? purchaseprice:0;
    tagprice = tagprice ? tagprice : 0;
    console.log(purchaseprice)
    var newPicker = this.data.picker_view;
    for (var p in newPicker){
      if (!this.data.firstBoolean){
        newPicker[p].price = (purchaseprice * (1 + newPicker[p].custPriceJson / 100)).toFixed(1);
        newPicker[p].discPriceJson = (newPicker[p].price / tagprice *100).toFixed(1);
       
      }else{
        newPicker[p].discPriceJson = (newPicker[p].price / tagprice * 100).toFixed(1);
        if (purchaseprice !== 0) {
          newPicker[p].custPriceJson = ((newPicker[p].price - purchaseprice) / purchaseprice * 100).toFixed(1)
        }
      }
      newPicker[p].discPriceJson = newPicker[p].discPriceJson == "Infinity" ? 100 : newPicker[p].discPriceJson;
      newPicker[p].discPriceJson = newPicker[p].discPriceJson == "NaN" ? 0 : newPicker[p].discPriceJson;
    }
    this.setData({
      picker_view: newPicker,
      firstBoolean : false
    })
  },
  // 初始化折扣率或者销售价
  initializeData:function(){
    var newPicker = this.data.picker_view;
    var name = app.custOrDiscTag == 1 ? 'custPriceJson' :'discPriceJson';
   for (var p in app.custProdPrice){
     newPicker[p][name] = app.custProdPrice[p].custpricejson;
     newPicker[p].name = app.custProdPrice[p].custtypename;
     newPicker[p].isUse = true;
   }
   console.log(newPicker)
   console.log(app.custProdPrice)
   this.setData({
     picker_view: newPicker
   });
   if (app.custOrDiscTag == 1){
     this.custPrice(this.data.GoodsInfoData.purchaseprice, this.data.GoodsInfoData.tagprice)
   }else{
     this.discPrice(this.data.GoodsInfoData.purchaseprice, this.data.GoodsInfoData.tagprice)
   }
  },
  // 判断是否有权限看进货价
  authorityPurchaseprice:function(){
    var userIdentity = app.globalData.userIdentity;
    var privilegeEmployees = false;
    if(userIdentity == 3){
      for (var p in app.globalData.privilegeEmployees){
        if (app.globalData.privilegeEmployees[p].privilegeId == 1){
          privilegeEmployees = true;
        }
      }
    }
    this.setData({
      privilegeEmployees: privilegeEmployees
    })
  },
  onLoad: function (options) {
    this.setData({
      screen_brandList: app.screen_brandList,
      screen_productTypeList: app.screen_productTypeList,
      screen_gradeList: app.screen_gradeList,
      screen_unitList: app.screen_unitList,
      screen_productSize: app.screen_productSize,
      userIdentity: app.globalData.userIdentity,
      GoodsInfoData: {
        brandid: app.screen_brandList[0].id,
        sizes: app.screen_productSize[0].value,
        grade: app.screen_gradeList[0].dictValue,
        unit: app.screen_unitList[0].unit,
        producttype: app.screen_productTypeList[0].id,
        timeDown: util.formatTime(new Date),
        timeUp: util.formatTime(new Date),
        year: new Date().getFullYear()
      },
      brand: app.screen_brandList[0].brandname,
      // sizes: app.screen_productSize[0].value,
      unit: app.screen_unitList[0].unit,
      producttype: app.screen_productTypeList[0].catename,
    });
    this.authorityPurchaseprice();
    if (options.ID !== 'null'){
      this.setData({
        id: options.ID,
        title: options.name
      });
      this.showGoodsInfo();
    }else{
      this.initializeData();
      this.GoodsImage();
    }
   
  },
  onShow:function() {
    if (app.changeData) {
      console.log(app.nameChange == "加价表")
      var param = this.data.GoodsInfoData;
      if (app.nameChange == '商品种类'){
        param.producttype = util.api.getFilterArray(app.changeData);
        this.setData({
          producttype: app.changeData,
          GoodsInfoData: param
        });  
        console.log(param.colors)
      } else if (app.nameChange == '品牌名称'){
        param.brandid = util.api.getFilterArray(app.changeData);   
        console.log(app.changeData)
        var num = 0;
        for (var p in app.screen_brandList) {
          if (app.screen_brandList[p].brandname == app.changeData) {
            num = p;
          }
        }
        this.setData({
          brand_index: num,
          brand: app.changeData,
          GoodsInfoData: param
        });
         
      } else if (app.nameChange == '单位名称') {
        param.unit = util.api.getFilterArray(app.changeData);
        this.setData({
          unit: app.changeData,
          GoodsInfoData: param
        }); 
      } else if (app.nameChange == '颜色名称') {
        param.colors = util.api.getFilterArray(app.changeData);
        this.setData({
          GoodsInfoData: param
        }); 
      } else if (app.nameChange == "分条码"){
        param.barcodes = app.changeData !==1 ? app.changeData:'';
        console.log(app.changeData ? app.changeData : '')
          this.setData({
            GoodsInfoData: param
          }); 
      } else if (app.nameChange == "尺码") {
        param.sizes = app.changeData;
        this.setData({
          GoodsInfoData: param
        });
      } else if (app.nameChange == "加价表"){
        param.priceJsons = app.changeData;
        this.setData({
          GoodsInfoData: param
        });
      }
      app.changeData = "";
    }
  }
})