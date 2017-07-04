var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    ids:[],
    screen_gradeList: [],
    screen_content4: [
      { name: '0', value: '上架' },
      { name: '1', value: '待处理' },
      { name: '2', value: '下架' },
      { name: '3', value: '报废' },
    ],
    screen_content3: [
      { name: '1', value: '是' },
      { name: '2', value: '否' }
    ],
    status:'',
    grade: '',
    year:"",
    isDiscount:null,
    grade_index:null,
    status_index:null
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  year: function (e) {  
    const val = e.detail.value
    this.setData({
      year: val
    })
  },
  bindSelectorChange:function(e){
    var style = e.currentTarget.dataset.style;
    switch (style) {
      case 'grade_index':
        var grade = this.data.screen_gradeList[e.detail.value].dictValue;
        this.setData({
          grade_index: e.detail.value,
          grade: grade
        })
        break;
      case 'status_index':
        var status = this.data.screen_content4[e.detail.value].name;
        this.setData({
          status_index: e.detail.value,
          status: status
        })
        break;
    }
  },
  changeRadio:function(e){
    const val = e.detail.value
    this.setData({
      isDiscount: val
    })
    console.log(val)
  },
  saveData:function(){
    console.log({
      storeId: 1,
      idArray: this.data.ids,
      year: this.data.year,
      grade: this.data.grade,
      status: this.data.status,
      isDiscount: this.data.isDiscount
    })
    this.updataRequest();
  },
  updataRequest: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/updateProducts',
      data: {
        storeId: 1,
        idArray: that.data.ids,
        checkAllTag: that.data.checkAllTag,
        year: that.data.year,
        grade: that.data.grade,
        status: that.data.status
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
        that.back();
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      ids:options.ids,
      screen_gradeList:app.screen_gradeList,
      checkAllTag: options.checkAllTag
    })
  }
})