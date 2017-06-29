var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    bill_modal: "none",
    bill_modal_opacity: "",
    bill_wechat:true,
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
    paycact: '',
    paycact_index1: 0,
    paycact_index2: 1,
    discountAut:100,
    zeroPrice:0
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
    this.setData({
      bill_wechat: false
    })
  },
  cancel: function () {
    this.setData({
      bill_wechat: true
    })
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
  // 得到数据
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
  // 去零折扣计算
  reallyPayTotal:function(){
    var num = this.data.totalData.realcostArray;
    var disCount = this.data.disCount ? this.data.disCount/100:1;
    var mchange = this.data.mchange ? this.data.mchange:0;
    var shopCart = this.data.shopCar;
    for (var p in shopCart){
      if (shopCart[p].isDiscount == 1){
        shopCart[p].price = (shopCart[p].price * disCount).toFixed(2);
      }
      num += shopCart[p].price
    }
    num = (num - this.data.mchange).toFixed(2);
    this.setData({
      reallyPay: num,
      payCost1: num
    })
    this.debet()
  },
  // 清零
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
  // 判断去零金额
  EventInput:function(e){
    if (e.detail.value > this.data.zeroPrice){
      wx.showToast({
        title: '您的去零金额不能超过' + this.data.zeroPrice,
        icon: 'warn',
        duration: 500
      })
      this.setData({
        mchange: this.data.zeroPrice
      })
    } else if ( e.detail.value <= this.data.zeroPrice){
      this.setData({
        mchange: e.detail.value
      })
    }
    this.reallyPayTotal()
  },
 // 判断打折金额
  EventInputDiscount: function (e) {
    if (e.detail.value < this.data.discountAut && e.detail.value) {
      wx.showToast({
        title: '您的折扣值不能低于' + this.data.discountAut,
        icon: 'warn',
        duration: 500
      })
      this.setData({
        disCount: this.data.discountAut
      })
    } else if ( e.detail.value >= this.data.discountAut) {
      this.setData({
        disCount: e.detail.value
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
      if (this.data.shopCart[p].sizeGroup){
        console.log(this.data.shopCart[p])
        var sizebill = this.data.shopCart[p].sizeGroup.split(',');
        for (var index in sizebill) {
          submitData.stoDetails.push({
            count: this.data.shopCart[p].count,
            productName: this.data.shopCart[p].productName,
            price: this.data.shopCart[p].isPattern == 1 ? this.data.shopCart[p].sizeRaiseArray[index]:this.data.shopCart[p].price,
            productid: this.data.shopCart[p].productid,
            productunit: this.data.shopCart[p].productunit,
            productcolor: this.data.shopCart[p].productcolor,
            productsize: sizebill[index],
            producttype: this.data.shopCart[p].producttype,
            handtag: this.data.shopCart[p].handcount
          })
          console.log(this.data.shopCart[p].sizeRaiseArray[index])
        }
      }else{
        submitData.stoDetails.push(this.data.shopCart[p])
      }
    }
    console.log(submitData);
    this.ajaxChange(submitData)
  },
  ajaxChange: function (submitData){
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
        if (res.data == 1013) {
          wx.showModal({
            title: '提示',
            content: '缺少库存,是否继续操作?',
            success: function (res) {
              if (res.confirm) {
                submitData.isContinue = true;
                that.ajaxChange(submitData);
              }
            }
          })
        } else {
          // var name = 'shopCartLowe' + that.data.type;
          // wx.setStorage({
          // key: name,
          // data: product
          // })
        }
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
  // 入账支付方式选择
  paycactPicker1: function (e) {
    this.setData({
      paycact_index1: e.detail.value,
      payCate1: this.data.paycact[e.detail.value].dictValue
    })
  },
  paycactPicker2: function (e) {
    this.setData({
      paycact_index2: e.detail.value,
      payCate2: this.data.paycact[e.detail.value].dictValue
    })
  },
  onLoad:function(options){
    this.setData({
      type:options.type,
      discountAut: app.globalData.discount || 0,
      zeroPrice: app.globalData.zeroPrice || Infinity,
      paycact: app.payTypeList
    })
    this.getData();
  }
})