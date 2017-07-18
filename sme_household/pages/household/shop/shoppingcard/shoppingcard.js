var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    shopCart:[],
    totalnum:0,
    totalPrice: 0,
    aa:false,
    stordId:0
  },
  // 得到缓存本地数据
  getData: function () {
    var that = this;
    var name = 'shopCartUp' + this.data.stordId;
    wx.getStorage({
      key: name,
      complete: function (res) {
        res.data = res.data ? res.data : [];
        that.setData({
          shopCart: res.data
        })
        that.salePriceTotal()
      }
    })
  },
  // 数量加减
  countAddorSub: function (e) {
    var type = e.target.dataset.type;
    var index = e.target.dataset.index;
    var shopCart = this.data.shopCart;
    if (type == 'sub') {
      shopCart[index].count = parseInt(shopCart[index].count - 1)
    } else {
      shopCart[index].count = parseInt(shopCart[index].count + 1)
    }
    this.setData({
      shopCart: shopCart
    });
    this.salePriceTotal();
  },
  // 计算价格
  salePriceTotal:function(){
    var totalPrice = 0;
    var totalnum = 0;
    var shopCart = this.data.shopCart;
    for (var p in shopCart){
      shopCart[p].image1 = shopCart[p].image ? util.api.imgUrl + shopCart[p].image : "";
      if (shopCart[p].sizeGroup && shopCart[p].iSselect == true){
        var sizeArray = shopCart[p].sizeGroup.split(',')
        for(var g in sizeArray){
          totalnum += 1;
          if (shopCart[p].isPattern ==1){
            totalPrice += Number(Number(shopCart[p].sizeRaiseArray[g]) * shopCart[p].count);
          }else{
            totalPrice += Number(Number(shopCart[p].price) * shopCart[p].count);
          }
        }
    } else if (!shopCart[p].sizeGroup && shopCart[p].iSselect == true){
        totalnum += 1;
        totalPrice += Number(Number(shopCart[p].price) * shopCart[p].count);
      }
    }
    this.setData({
      totalnum: parseInt(totalnum),
      totalPrice: totalPrice,
      shopCart: shopCart
    })
  },
  // 取消选择
  saleCanle:function(e){
    var index = e.target.dataset.index;
    var shopCart = this.data.shopCart;
    shopCart[index].iSselect = !shopCart[index].iSselect;
    this.setData({
      shopCart: shopCart
    });
    this.salePriceTotal();
  },
  // 全选全不选
  iSselectAll:function(e){
    console.log(e)
    var shopCart = this.data.shopCart;
    var aa = this.data.aa;
    aa = !aa;
    for (var p in shopCart) {
      shopCart[p].iSselect = aa
    }
    this.setData({
      aa:aa,
      shopCart: shopCart
    })
    this.salePriceTotal();
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
  },
  // 删除商品
  deleteShop:function(e){
    var index = e.target.dataset.index;
    var shopCart = this.data.shopCart;
    shopCart.splice(index,1)
    this.setData({
      shopCart: shopCart
    })
    this.salePriceTotal()
    this.localData(this.data.shopCart)
  },
  // 跳转至确认订单
  orderSure:function(){
    var that = this
    if (this.data.shopCart == 0) {
      wx.showModal({
        title: '没商品不能下订单',
        showCancel: false,
      })
    } else {
      wx.navigateTo({
        url: '../orderSure/orderSure?stordId=' + that.data.stordId + '&totalnum=' + that.data.totalnum + '&totalPrice=' + that.data.totalPrice,
      })
    }
  },
  onLoad:function(e){
    this.setData({
      stordId: e.stordId
    })
    this.getData()
  },
  onUnload:function(){
    this.localData(this.data.shopCart)
  }
})