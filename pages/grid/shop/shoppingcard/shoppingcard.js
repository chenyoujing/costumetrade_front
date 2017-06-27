var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    shopCart:[],
    totalnum:0,
    totalPrice: 0
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
    })
  },
  // 计算价格
  salePriceTotal:function(){
    var totalPrice = this.data.totalPrice;
    var totalnum = this.data.totalnum;
    var shopCart = this.data.shopCart;
    for (var p in shopCart){
      if (shopCart[p].productsize == '全尺码'){
        shopCart[p].image = util.api.imgUrl + shopCart[p].image;
        var sizeArray = shopCart[p].sizeGroup.split(',')
        for(var g in sizeArray){
          totalnum += 1;
          totalPrice += parseFloat(shopCart[p].sizeRaiseArray[g]);
        }
      }else{
        totalnum += 1;
        totalPrice += parseFloat(shopCart[p].price);
      }
    }
    console.log(parseInt(totalnum))
    console.log(parseInt(totalPrice))
    this.setData({
      totalnum: parseInt(totalnum),
      totalPrice: totalPrice,
      shopCart: shopCart
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
  },
  onLoad:function(e){
    this.setData({
      stordId: e.stordId
    })
    this.getData()
  }
})