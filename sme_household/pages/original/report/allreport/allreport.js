var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
Page({
  data: {
    title: '总报表',
    more_function_display: 'none',
    selected: 0,
    timebool:1,//确定显示按钮还是input
    beginTime:"",//开始时间
    endTime: "",//结束时间
    changeType:1,
    product:[],
    pageNum: 1,
    pageName:"pucharseOrders",
    requestSwitch: true
  },

  // 选择时间
  select: function (e) {
    var object = util.api.tiemFilter(e);
    object.selected = e.target.dataset.index;
    this.setData(object);
    this.data.selected != 4 ? this.generalReport():''
  },
  // 时间改变
  timeChange:function(e){
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object)
  },
  // 改变入库、出库、往来款项
  changeType:function(e){
    var type = e.currentTarget.dataset.type;
    var name = e.currentTarget.dataset.name;
    this.setData({
      changeType:type,
      pageName: name,
      pageNum:1,
      requestSwitch: true,
    })
    this.generalReportPage();
  },
  // 请求数据
 generalReport:function(){
   var that = this;
   wx.showNavigationBarLoading()
   util.api.request({
     url: "report/generalReport",
     data: {
       openid: app.globalData.openid,
       timeFrom: that.data.beginTime + " 00:00:00",
       timeTo: that.data.endTime + " 23:59:59"
     },
     method: 'POST',
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {
       var total = { payAmount: 0, payType: "总计", receiptAmount: 0 };
       total.payAmount = res.data.payAmount;
       total.reciptAmount = res.data.reciptAmount;
       res.data.payTypeQuery.push(total);
       that.setData({
         submitData: res.data
       })
       wx.hideNavigationBarLoading();
       wx.showToast({
         title: "添加成功！",
         mask: true,
         duration: 2000
       })
     }
   })
 },
//  请求详情
  generalReportPage:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: "report/generalReportPage",
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime + " 00:00:00",
        timeTo: that.data.endTime + " 23:59:59",
        pageNum: that.data.pageNum,
        type: that.data.changeType
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();

        var product = that.data.pageNum == 1 ? [] : that.data.product
        var newData = res.data[that.data.pageName];
        var booleanre = that.data.requestSwitch;
        for (var p in newData){
          newData[p].ordertime = util.toDate(newData[p].ordertime);
          product.push(newData[p]);
        }
        booleanre = newData < 10 ? false : true;
        that.setData({
          product: product,
          requestSwitch: booleanre,
          loadMore: true
        })
      }
    })
  },
  //滚动到底部触发事件  
  onReachBottom: function () {
    this.setData({
      pageNum: this.data.pageNum + 1,
      loadMore: false
    });
    console.log(this.data.pageNum)
    if (this.data.requestSwitch) {
      this.generalReportPage();
    }
  },
  onLoad: function (e) {
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: Time,
      endTime: Time
    })
    this.generalReportPage()
    this.generalReport()
  }
})