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
    changeType:1
  },
  // 打开多功能键
  more_function: function () {
    this.setData({
      more_function_display: "block",
    })
    setTimeout(() => {
      this.setData({
        animation: "animation",
      })
    }, 10)
  },
  // 关闭多功能键
  more_function_close: function () {
    this.setData({
      animation: "",
    })
    setTimeout(() => {
      this.setData({
        more_function_display: "none",
      })
    }, 300)
  },
  // 选择时间
  select: function (e) {
    var object = util.api.tiemFilter(e);
    object.selected = e.target.dataset.index;
    this.setData(object);
    this.generalReport()
  },
  // 时间改变
  timeChange:function(e){
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object)
  },
  // 改变入库、出库、往来款项
  changeType:function(e){
    var type = e.currentTarget.dataset.type;
    this.setData({
      changeType:type
    })
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
//  
  onLoad: function (e) {
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: Time,
      endTime: Time
    })
    this.generalReport()
  }
})