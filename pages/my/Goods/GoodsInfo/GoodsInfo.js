var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
    id: '',
    grade_index: 0,
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
    brand:'',
    producttype:'',
    unit:'',
    brand_index:0,
    GoodsInfoData:{},
    soruceData:{},
    changPrice_index:0,
    updataAut:false,
    firstBoolean:true,
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
    ]
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
        param.grade = this.data.screen_gradeList[e.detail.value].id;
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
      url: 'http://192.168.2.221:8088/product/uploadImage', 
      filePath: file[i],
      name: 'file',
      success: function (res) {
        console.log(JSON.stringify(res));
        var url = "http://117.149.24.42:8788" + JSON.parse(res.data).data.url;
        var resizeFixUrl = "http://117.149.24.42:8788" + JSON.parse(res.data).data.resizeFixUrl;
        var param = that.data.GoodsInfoData;
        var fileArray = that.data.fileList;
        param[that.data.perImgSrc] = url;
        for (var p in fileArray){
          if (fileArray[p].filename == that.data.perImgSrc){
            fileArray[p].url = url;
            fileArray[p].resizeFixUrl = resizeFixUrl;
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
          if (app.screen_gradeList[p].id == answerData.grade) {
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
          brand_index: brandNumber
        });
       
        that.gradeCate();
        that.GoodsImage();
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
    target.image = this.data.GoodsInfoData.image;
    target.Image1 = this.data.GoodsInfoData.Image1;
    target.Image2 = this.data.GoodsInfoData.Image2;
    target.Image3 = this.data.GoodsInfoData.Image3;
    target.Image4 = this.data.GoodsInfoData.Image4;
    target.video1 = this.data.GoodsInfoData.video1;
    target.video2 = this.data.GoodsInfoData.video2;
    target.video3 = this.data.GoodsInfoData.video3;
    target.fileList = this.data.fileList;
    target.name = target.code + target.name
    for (var p = target.fileList.length - 1;p>=0;p--){
      if (target.fileList[p].url !== ''){
        target.fileList[p].productName = target.name
      }else{
        target.fileList.splice(p,1)
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
      objectSubmit.id = undefined
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
            }
          })
          app.newid = that.data.id == "" ? res.data : null;
          if (that.data.id){
            for (var p in totalProduct){
              if (totalProduct[p].id = that.data.id){
                for (var j in objectSubmit){
                  totalProduct[p][j] = objectSubmit[j]
                }
                break;
              }
            }
            if (objectSubmit.name || objectSubmit.image) {
              app.updataGoodsInfo = that.data.GoodsInfoData;
            }
          }else{
            totalProduct.unshift(objectSubmit)
          }
          wx.setStorage({
            key: "GoodsData",
            data: totalProduct
          })
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
    console.log(this.data.grade_index)
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
      url = '../GoodsBrand/GoodsBrand?url=size/getAllSizes&title=选尺码'
    } else if (type == 'unit'){
      url = '../GoodsBrand/GoodsBrand?url=unit/getAllUnits&title=添加单位'
    }
    wx.navigateTo({
      url: url
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
      },
      brand: app.screen_brandList[0].brandname,
      // sizes: app.screen_productSize[0].value,
      unit: app.screen_unitList[0].unit,
      producttype: app.screen_productTypeList[0].catename,
    });
    if (options.ID !== 'null'){
      this.setData({
        id: options.ID,
        title: options.name
      });
      this.showGoodsInfo();
    }else{
      this.gradeCate();
      this.GoodsImage();
    }
  },
  onShow:function() {
    if (app.changeData) {
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
        this.priceCalculate('tagprice', this.data.GoodsInfoData.tagprice);
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
      }
      app.changeData = "";
    }
  }
})