var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    shopCart:[],
    totalPrice: 0,
    totalnum: 0,
    address:{},
    freight:10,
    expressModal:true,
    shopCartOrigin:[],
    logisticFees:[],
    logisticCode: 0,
    logisticName: ''
  },
  // 更改地址
  address:function(){
    var that = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res.detailInfo)
        var address={
          contact: res.userName,
          phone: res.telNumber,
          city: res.cityName,
          province:res.provinceName,
          district: res.countyName,
          address: res.detailInfo,
        }
        that.setData({
          address: address
        })
      }
    })
  },
  // 请求默认
  orderInitAddress:function(){
      var that = this;
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'order/orderInit',
        data: {
          openid: app.globalData.openid,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          that.setData({
            address: res.data
          })
          console.log(res)
        }
      })
  },
  // 提醒填收货地址
  isnoAddress:function(e){
    if (this.data.address.address){
      this.orderSure(e)
    }else{
      var that = this;
      wx.showModal({
        title: '没有填收货地址，马上去填？',
        confirmText:'好的',
        success: function (res) {
          if (res.confirm) {
            that.address()
          }
        }
      })
    }
  },
  // 处理数据并下单
  orderSure:function(e){
    var that = this;
    wx.showModal({
      title: '是否下订单',
      success: function (res) {
        if (res.confirm) {
          var submitData = {};
          var shopCart = that.data.shopCart;
          var newShopCart = [];
          var price = (that.data.totalPrice + that.data.freight).toFixed(2);
          submitData.stoDetails = [];
          submitData.form_id = e.detail.formId
          submitData.order = {};
          submitData.order.totalamt = price;
          submitData.order.ordertype = 1;
          submitData.openid = app.globalData.openid;
          submitData.order.shipcontact = that.data.address.contact;
          submitData.order.shipphone = that.data.address.phone;
          submitData.order.shipaddress = that.data.address.address;
          submitData.order.logisticsCode = that.data.logisticCode;
          submitData.order.freight = that.data.freight;
          submitData.order.totalnum = that.data.totalnum;
          submitData.order.sellerstoreid = that.data.stordId;
          for (var p in shopCart) {
            if (shopCart[p].sizeGroup) {
              var sizeGroup = shopCart[p].sizeGroup.split(",");
              for (var g in sizeGroup) {
                newShopCart.push({
                  count: shopCart[p].count,
                  productname: shopCart[p].productName,
                  price: shopCart[p].isPattern == 1 ? shopCart[p].sizeRaiseArray[g] : shopCart[p].price,
                  productid: shopCart[p].productid,
                  productunit: shopCart[p].productunit,
                  productcolor: shopCart[p].productcolor,
                  productsize: sizeGroup[g],
                  producttype: shopCart[p].producttype,
                  handtag: shopCart[p].handtag,
                  storeid: that.data.stordId
                })
              }
            } else {
              newShopCart.push({
                count: shopCart[p].count,
                productname: shopCart[p].productName,
                price: shopCart[p].price,
                productid: shopCart[p].productid,
                productunit: shopCart[p].productunit,
                productcolor: shopCart[p].productcolor,
                productsize: shopCart[p].productsize,
                producttype: shopCart[p].producttype,
                handtag: shopCart[p].handtag,
                storeid: that.data.stordId
              })
            }
          }
          submitData.stoDetails = newShopCart;
          that.submitData(submitData);
        }
      }
    })
  },
  // 得到缓存本地数据
  getData: function () {
    var that = this;
    var name = this.data.name;
    var selectCart = []
    wx.getStorage({
      key: name,
      complete: function (res) {
        res.data = res.data ? res.data : [];
        for(var p in res.data){
          res.data[p].image1 = res.data[p].image1 || util.api.imgUrl + res.data[p].image;
          if (res.data[p].iSselect == true){
            selectCart.push(res.data[p])
          }
        }
        that.setData({
          shopCartOrigin: res.data,
          shopCart: selectCart
        })
      }
    })
  },
  // 提交数据
  submitData: function (submitData){
      var that = this;
      console.log(JSON.stringify(submitData))
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'order/saveOrders',
        data: submitData,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          if(res.data == 1013){
            wx.showModal({
              title: '提示',
              content: '缺少库存,是否继续操作?',
              success: function (res) {
                if (res.confirm) {
                  submitData.order.isContinue = true;
                  that.ajaxChange(submitData);
                }
              }
            })
          } else if (res.data == 1020){
            wx.showToast({
              title: '自家店铺不能下单',
            })
          }else{
            that.delectShop()
            wx.showToast({
              title: '下单成功',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 2
              })
            }, 1500)

          }
        }
      })
   },
 // 删除已提交过得商品
  delectShop:function(){
    var shopCart = this.data.shopCartOrigin;
    var name = this.data.name;
    for (var p in shopCart){
      if (shopCart[p].iSselect){
        shopCart.splice(p,1)
      }
    }
    wx.setStorage({
      key: this.data.name,
      data: shopCart
    })
  },
  // 更改运费
  changeLogisticFees:function(){
    this.setData({
      expressModal:false
    })
  },
  // 选择更改后的快递
  logistic:function(e){
    var logisticName = e.target.dataset.name;
    var logisticCode = e.target.dataset.code;
    var fixedFee = e.target.dataset.fixedfee;
    this.setData({
      logisticName: logisticName,
      logisticCode: logisticCode,
      freight: fixedFee
    })
    this.cancel()
  },
  // 取消快递选择
  cancel:function(){
    this.setData({
      expressModal: true
    })
  },
  // 商城里请求快递
  shopBrandandProduct: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductInit',
      data: {
        storeId: that.data.storeId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          logisticFees: res.data.logisticFees,
          freight: parseFloat(res.data.logisticFees[0].fixedFee),
          logisticCode: res.data.logisticFees[0].logisticCode,
          logisticName: res.data.logisticFees[0].logisticName
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      stordId: options.stordId,
      totalPrice: parseFloat(options.totalPrice),
      totalnum: options.totalnum,
      name: 'shopCartUp' + options.stordId
    })
    this.orderInitAddress();
    this.shopBrandandProduct();
    this.getData()
  }
})