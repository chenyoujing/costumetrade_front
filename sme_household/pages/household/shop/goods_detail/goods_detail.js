var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    height: "",
    imgUrls: [
      '../../../../images/shop1_1.png',
      '../../../../images/shop1_2.png',
    ],
    infoid: "0",
    modal: "none",
    modal_opacity: "",
    modal_top: "100%",
    modal_bottom: "-100%",
    size: "",
    sizes: "1",
    color: "",
    id: "",
    title: "",
    stordId: 0,
    sizeArray:[],
    colorArray:[],
    count:1,
    sizeRaise: 0,
    colorRaise: 0,
    priceRaise:[],
    originalPrice:'',
    sizeRaiseArray:[],
    averagePrice:"",
    productReviews:[],
    GoodsInfoData:[]
  },
  //请求并显示货品详情
  showGoodsInfo: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductDetail',
      data: {
        storeId: that.data.stordId,
        id: that.data.id,
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var typeName = '';
        var answerData = res.data;
        var imgUrls = that.data.imgUrls;
        var priceRaise = answerData.raise_price;
        var sizeArray = answerData.sizes.split(',');
        var productReviews = that.data.productReviews;

        // var reg = /^\//;
        // if (reg.test(answerData.storeImage)) {
        //   answerData.storeImage = util.api.imgUrl + answerData.storeImage
        // }

        answerData.timeDown = answerData.timeDown?util.toDate(answerData.timeDown) : "";
        answerData.timeUp = answerData.timeUp?util.toDate(answerData.timeUp): "";
        imgUrls[0] = answerData.image ? util.api.imgUrl + answerData.image : '';
        imgUrls[1] = answerData.image1 ? util.api.imgUrl + answerData.image1 : '';
        imgUrls[2] = answerData.image2 ? util.api.imgUrl + answerData.image2 : '';
        imgUrls[3] = answerData.image3 ? util.api.imgUrl + answerData.image3 : '';
        imgUrls[4] = answerData.image4 ? util.api.imgUrl + answerData.image4 : '';
        answerData.handcount = sizeArray.length;
        productReviews = answerData.productReviews;
        for (var p in productReviews){
          // productReviews[p].headphoto = productReviews[p].headphoto ? util.api.imgUrl + productReviews[p].headphoto :''
          productReviews[p].createTime = util.formatTime(answerData.createTime)
        }
        if (answerData.description){
          answerData.description = JSON.parse(answerData.description)
        }
        that.setData({
          GoodsInfoData: answerData,
          id: answerData.id,
          imgUrls: imgUrls,
          originalPrice: answerData.salePrice,
          sizeArray: sizeArray,
          colorArray: answerData.colors.split(','),
          productReviews: productReviews,
          priceRaise: answerData.priceJsons
        });
      }
    })
  },
  // 加入货单
  enterShopCart: function () {
    var shopCart = this.data.shopCart; 
    var add = true;
    this.saleAver(this.data.sizes)
    var object = {
      count: this.data.count,
      productName: this.data.GoodsInfoData.name,
      price: this.data.GoodsInfoData.salePrice,
      productid: this.data.GoodsInfoData.id,
      productunit: this.data.GoodsInfoData.unit,
      productcolor: this.data.color,
      productsize: this.data.size,
      producttype: this.data.GoodsInfoData.producttype,
      handtag: this.data.GoodsInfoData.handcount,
      image: this.data.GoodsInfoData.image,
      iSselect:true
    };
    if (this.data.sizes == '2') {
      object.productsize = '全尺码';
      object.sizeGroup = this.data.GoodsInfoData.sizes;
      object.sizeRaiseArray = this.data.sizeRaiseArray;
      object.isPattern = this.data.GoodsInfoData.isPattern
    }
    for (var p in shopCart) {
      if (shopCart[p].productid == object.productid && shopCart[p].productcolor == object.productcolor && shopCart[p].productsize == object.productsize) {
        shopCart[p].count = parseInt(object.count) + parseInt(shopCart[p].count);
        add = false;
      }
    };
    if (add) {
      shopCart.push(object);
    }
    
    this.localData(shopCart)
  },
  // 缓存
  localData: function (product) {
    var name = 'shopCartUp' + this.data.stordId;
    wx.setStorage({
      key: name,
      data: product
    })
    wx.showToast({
      title: '成功',
      mask: true,
      duration: 2000
    })
    console.log({
      key: name,
      data: product
    });
  },
  // 得到缓存本地数据
  getData: function () {
    var that = this;
    var name = 'shopCartUp' + this.data.stordId;
    console.log(this.data.color)
    if(!this.data.color){
      wx.showToast({
        title: '请选择颜色',
        mask: true,
        duration: 500
      })
    } else if (this.data.sizes !== "2" && !this.data.size){
      wx.showToast({
        title: '请选择尺码',
        mask: true,
        duration: 500
      })
    } else {
      wx.getStorage({
        key: name,
        complete: function (res) {
          res.data = res.data ? res.data : [];
          that.setData({
            shopCart: res.data
          })
          that.enterShopCart();
        }
      })
      this.modal_close()
    }
  },
  // 数量加减
  countAddorSub:function(e){
    var type = e.target.dataset.type;
    var count = this.data.count;
    if(type == 'sub'){
      count = parseInt(count - 1)
    }else{
      count = parseInt(count + 1)
    }
    this.setData({
      count:count
    })
  },
  detail_info: function (e) {
    let data = e.target.dataset
    this.setData({
      infoid: data.infoid
    })
  },
  detail_info_swiper: function (e) {
    this.setData({
      infoid: e.detail.current
    })
  },
  join: function (e) {
    var that = this
    let data = e.target.dataset
    this.setData({
      modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      modal_opacity: animation.export(),
      modal_top: "120rpx",
      modal_bottom: "0",
    })
  },
  modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      modal_opacity: animation.export(),
      modal_top: "100%",
      modal_bottom: "-100%",
    })
    setTimeout(() => {
      this.setData({
        modal: "none",
        color: "",
        size: ""
      })
    }, 300)
  },
  sizes_checked: function (e) {
    let data = e.target.dataset;
    var GoodsInfoData = this.data.GoodsInfoData;
    if (data.sizes == 1){
      GoodsInfoData.salePrice = this.data.originalPrice;
      this.setData({
        size: "",
        color:"",
        sizes: data.sizes,
        GoodsInfoData: GoodsInfoData,
        sizeRaise: 0,
        colorRaise: 0
      })
    }else{
      this.setData({
        sizes: data.sizes
      })
      if (this.data.GoodsInfoData.isPattern == 1){
        this.saleAver(this.data.sizes)
      }
    }
  },
  // 调用函数请求方法
  saleAver: function (unitString) {
    console.log(this.data.GoodsInfoData)
    if (unitString == 2 && this.data.GoodsInfoData.isPattern == 1) {
      if (this.data.priceRaise){
        var object = util.api.sizeRaiseArray(this.data.sizeArray, this.data.GoodsInfoData, this.data.priceRaise.sizeLists, this.data.originalPrice, this.data.colorRaise, 'salePrice');
        this.setData({
          GoodsInfoData: object.GoodsInfoData,
          sizeRaiseArray: object.sizeRaiseArray
        })
      }
    
    }
  },
// 颜色尺码选择同时计算加价
  color_checked: function (e) {
    let name = e.target.dataset.name;
    let data = e.target.dataset[name];
    var param = {};
    param[name] = data;
    var originalPrice = this.data.originalPrice;
    var GoodsInfoData = this.data.GoodsInfoData;
    var sizeRaise = this.data.sizeRaise;
    var colorRaise = this.data.colorRaise; 
    console.log(this.data.priceRaise)
    if (this.data.GoodsInfoData.isPattern == 1 && this.data.priceRaise == undefined){
      sizeRaise = 0;
      colorRaise = 0;
    }else if(this.data.GoodsInfoData.isPattern==1 && name=='color'){
      for (var g in this.data.priceRaise.colorLists) {
        if (data == this.data.priceRaise.colorLists[g].name) {
          colorRaise = this.data.priceRaise.colorLists[g].priceRaise;
          param.colorRaise = parseFloat(colorRaise);
        }
      }
    } else if (this.data.GoodsInfoData.isPattern == 1 && name == 'size'){
      console.log(data)
      console.log(this.data.priceRaise.sizeLists)
      for (var g in this.data.priceRaise.sizeLists) {
        if (data == this.data.priceRaise.sizeLists[g].name) {
          sizeRaise = this.data.priceRaise.sizeLists[g].priceRaise;
          param.sizeRaise = parseFloat(sizeRaise);
          console.log(sizeRaise)
        }
      }
    }
    GoodsInfoData.salePrice = (parseFloat(originalPrice) + parseFloat(colorRaise) + parseFloat(sizeRaise)).toFixed(2);
    param['GoodsInfoData'] = GoodsInfoData;
    this.setData(param);
    if (this.data.GoodsInfoData.isPattern == 1 && this.data.sizes == 2){
      this.saleAver(this.data.sizes)
    }
  },
  onLoad: function (e) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    this.setData({
      id: e.ID,
      title: e.name,
      stordId: e.strod,
      url: util.api.imgUrl,
    });
    console.log({
      id: e.ID,
      title: e.name,
      stordId: e.strod,
      url: util.api.imgUrl,
    })
    console.log(e.name)
    this.showGoodsInfo();
  },
  onShareAppMessage: function () {
    return {
      title: '我的转发',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})