// pages/my/openOrder/orderSure/orderSure.js
Page({
  data: {
    bill_modal: "none",
    bill_modal_opacity: "",
    wechat_modal: "none",
    wechat_modal_opacity: "",
    shopCart:[],
    type:1,
    totalData: {
      totalNum: 0,
      realcostArray: 0
    },
    debet:0
  },
  //打印账单
  bill_print: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      bill_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      bill_modal_opacity: animation.export()
    })
  },
  bill_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      bill_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        bill_modal: "none",
      })
    }, 300)
  },
  //微信账单
  bill_wechat: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      wechat_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      wechat_modal_opacity: animation.export()
    })
  },
  wechat_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      wechat_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        wechat_modal: "none",
      })
    }, 300)
  },
  //单据时间
  date: function (e) {
    const val = e.detail.value
    this.setData({
      date: val
    })
  },
  getData: function () {
    var that = this;
    var name = 'shopCartLowe' + this.data.type;
    wx.getStorage({
      key: name,
      complete: function (res) {
        that.setData({
          shopCart: res.data
        })
        that.totalData()
        console.log(res.data)
      }
    })
  },
  // 计算总的价格和数量
  totalData: function () {
    var product = this.data.shopCart;
    var realcostArray = 0;
    var totalNum = 0;
    for (var p in product) {
      realcostArray += product[p].price;
      totalNum += parseInt(product[p].count);
    }
    this.setData({
      totalData: {
        totalNum: totalNum,
        realcostArray: realcostArray
      }
    })
  },
  onLoad:function(options){
    this.getData();
    this.setData({
      type:options.type

    })
  }
})