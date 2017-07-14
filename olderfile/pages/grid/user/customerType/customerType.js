var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
   grade:1
  },
  // 更改启用的客户种类
  cusgradeChange: function (e) {
    var grade = this.data.grade;
    console.log(Number(e.detail.value))
    console.log(e)
    grade = Number(e.detail.value) + 1;
    console.log(grade)
    this.setData({
      grade: grade
    });
  },
// 更改名称
  cusgradeChangeName:function(e){
    if(e.detail.value){
      wx.showModal({
        title: '名称不能为空',
      })
    }else{
      var customerCusts = this.data.customerCusts;
      customerCusts.custtypename = e.detail.vlaue;
    }
    this.setData({
      customerCusts: customerCusts
    })
  },
  // 保存更改
  saveData:function(){
    var customerCusts = this.data.customerCusts;
    var array = [];
    customerCusts.prodgrade = this.data.grade;
    array.push(customerCusts)
    wx.showNavigationBarLoading()
    util.api.request({
      url: "dictionary/saveTypeOrGradeRate",
      data: array,
      method: 'POST',
      header: {
        'content-type': 'application/josn'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.navigateBack({
          delta: 1,
        })
        wx.showToast({
          title: "成功！",
          mask: true,
          duration: 2000
        })
      }
    })
  },
  onLoad:function(e){
    this.setData({
      customerCusts: JSON.parse(e.customerCusts),
      name: e.name.split(',') ,
      grade: Number(JSON.parse(e.customerCusts).prodgrade) 
    })
    console.log(e.name.split(','))
  }
})