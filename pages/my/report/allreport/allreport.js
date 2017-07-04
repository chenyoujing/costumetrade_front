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
    var param = {};
    var style = e.currentTarget.dataset.name;
    param.beginTime = this.data.beginTime;
    param.endTime = this.data.endTime;
    if (style == 'beginTime') {
      param.beginTime = e.detail.value + " 00:00:00";
    } else {
      param.endTime = e.detail.value +" 23:59:59";
    } 
    param.endTime = this.endTimeiSchange(param.beginTime, param.endTime);
    this.setData(param)
  },
  // 报表检测结束时间是否要更改
  endTimeiSchange:function(benginTime,endTime){
    var newbenginTime = (new Date(benginTime)).getTime();
    var newendTime = (new Date(endTime)).getTime()
    if (newbenginTime > newendTime){
      endTime = benginTime.split(' ')[0] +" 23:59:59";
    }
    return endTime
  },
  onLoad: function (e) {
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: Time+" 00:00:00",
      endTime: Time + " 23:59:59"
    })
  }
})