var util = require('../../../../utils/util.js')
var app = getApp()
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
    debet:0,
    reallyPay:0,
    disCount:"",
    mchange:"",
    payCost1:'',
    payCost2: '',
    payCate1: '现金',
    payCate2: '刷卡',
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
  close:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  getData: function () {
    var that = this;
    var name = 'shopCartLowe' + this.data.type;
    var nametotal = 'totalData' + this.data.type;
    wx.getStorage({
      key: name,
      complete: function (res) {
        that.setData({
          shopCart: res.data
        })
        console.log(res.data)
      }
    })
    wx.getStorage({
      key: nametotal,
      complete: function (res) {
        that.setData({
          totalData: res.data
        })
        that.reallyPayTotal();
        console.log(res.data)
      }
    })
  },
  reallyPayTotal:function(){
    var num = this.data.totalData.realcostArray;
    var disCount = this.data.disCount ? this.data.disCount/100:1;
    var mchange = this.data.mchange ? this.data.mchange:0;
    num = (num * disCount - this.data.mchange).toFixed(2);
    this.setData({
      reallyPay: num,
      payCost1: num
    })
    this.debet()
  },
  clear:function(e){
    var num = e.target.dataset.num;
    var type = e.target.dataset.type;
    var param = {};
    param.debet = (parseInt(num) + parseInt(this.data.debet)).toFixed(2);
    if (param.debet > parseInt(this.data.reallyPay)){
      param.debet = this.data.reallyPay;
    }
    param[type] = "";
    console.log(param)
    this.setData(param);
  },
  changePaycost:function(e){
    var type = e.target.dataset.type;
    var param = {};
    param[type] = e.detail.value;
    if (type == 'payCost2'){
      param.payCost1 = (this.data.reallyPay - e.detail.value).toFixed(2);
    };
    this.setData(param);
    this.debet()
  },
  debet: function () {
    var debet = (this.data.reallyPay - this.data.payCost1 - this.data.payCost2).toFixed(2);
    if (debet < 0 && this.data.reallyPay >= 0) {
      debet = 0;
    }
    this.setData({
      debet: debet,
    })
  },
  EventInput:function(e){
    if (e.target.dataset.type == "disCount") {
      this.setData({
        disCount: e.detail.value
      })
    } else {
      this.setData({
        mchange: e.detail.value
      })
    }
    this.reallyPayTotal()
  },
  submitData:function(){
    var submitData = {};
    submitData.stoDetails = [];
    submitData.order = {};
    if(this.data.type == 1){
      submitData.order.sellerstoreid = 1;
      submitData.order.buyerstoreid = app.selectName?undefined:""
    }else{
      submitData.order.buyerstoreid = 1;
      submitData.order.sellerstoreid = app.selectName?undefined : ""
    }
    submitData.order.ordertype = 2;
    submitData.order.realcostArray = this.data.reallyPay;
    submitData.openid = app.globalData.openid;
    submitData.order.paycate1 = this.data.payCate1;
    submitData.order.paycost1 = this.data.payCost1;
    if (app.selectName !== undefined){
      submitData.order.clientId = app.selectName.id;
    }
    submitData.order.discountratio = this.data.disCount;
    submitData.order.mchange = this.data.mchange;
    submitData.order.debetamt = this.data.debet;
    submitData.order.paycate2 = this.data.payCate2;
    submitData.order.paycost2 = this.data.payCost2;
    for (var p in this.data.shopCart){
      if (this.data.shopCart[p].productsize == "全尺码"){
        console.log(this.data.shopCart[p])
        var sizebill = this.data.shopCart[p].sizeGroup.split(',');
       
        for (var index in sizebill) {
          submitData.stoDetails.push({
            count: this.data.shopCart[p].count,
            productName: this.data.shopCart[p].productName,
            price: this.data.shopCart[p].price,
            productid: this.data.shopCart[p].productid,
            productunit: this.data.shopCart[p].productunit,
            productcolor: this.data.shopCart[p].productcolor,
            productsize: sizebill[index],
            producttype: this.data.shopCart[p].producttype,
            handtag: this.data.shopCart[p].handcount
          })
        }
      }else{
        submitData.stoDetails.push(this.data.shopCart[p])
      }
    }
    console.log(submitData);
    var that = this;
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

        // var name = 'shopCartLowe' + that.data.type;
        // wx.setStorage({
        //   key: name,
        //   data: product
        // })
      }
    })
  },
  sureSubmit:function(){
    if (this.data.debet > 0 && !app.selectName){
      wx.showToast({
        title: '客户为游客时不能有欠款！',
        mask: true,
        duration: 2000
      })
    }else{
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定提交？',
        success: function (res) {
          if (res.confirm) {
            that.submitData();
          }
        }
      })
    }
  },
  onLoad:function(options){
    this.setData({
      type:options.type
    })
    this.getData();
  }
})