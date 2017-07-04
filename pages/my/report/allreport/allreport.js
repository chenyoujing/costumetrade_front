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
    endTime: ""//结束时间
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
    console.log(object)
    object.selected = e.target.dataset.index;
    this.setData(object);
  },
  // 时间改变
  timeChange:function(e){
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object)
  },
  // 请求数据
 generalReport:function(){
   var that = this;
   wx.showNavigationBarLoading()
   util.api.request({
     url: "report/generalReport",
     data: {
       openid: app.globalData.openid,
       timeFrom: that.data.beginTime,
       timeTo: that.data.endTime
     },
     method: 'POST',
     header: {
       'content-type': 'application/josn'
     },
     success: function (res) {
       that.setData({
         submitData: []
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
  onLoad: function (e) {
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: Time+" 00:00:00",
      endTime: Time + " 23:59:59"
    })
    this.generalReport()
  }
})