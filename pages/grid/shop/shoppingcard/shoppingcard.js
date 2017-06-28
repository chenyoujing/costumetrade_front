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
      if (shopCart[p].productsize == '全尺码' && shopCart[p].iSselect == true){
        var sizeArray = shopCart[p].sizeGroup.split(',')
        for(var g in sizeArray){
          totalnum += 1;
          totalPrice = (parseFloat(totalPrice)+parseFloat(shopCart[p].sizeRaiseArray[g]) * shopCart[p].count).toFixed(2);
        }
      } else if (shopCart[p].productsize !== '全尺码' && shopCart[p].iSselect == true){
        totalnum += 1;
        totalPrice = (parseFloat(totalPrice) + parseFloat(shopCart[p].price) * shopCart[p].count).toFixed(2);
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