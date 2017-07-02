var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    url:'',
    name:'',
    envalue:'',
    addname:'',
    groupName:'',
    sizeArray:[],
    selected:[]
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  EventHandle: function (e) {
    this.setData({
      envalue:e.detail.value
    })
  },
  add: function (e) {
    var size = e.target.dataset.size;
    var selected = this.data.selected;
    selected.push(size);
    this.setData({
      selected: selected
    })
  },
  reduce: function (e) {
    var size = e.target.dataset.size;
    var selected = this.data.selected;
    for (var index in selected) {
      var row = selected[index];
      if (row == size) {
        selected.splice(index, 1);
        break;
      }
    }
    this.setData({
      selected: selected
    })
  },
  // 添加新选项
  addOptions: function () {
    var that = this;
    if (this.data.envalue) {
      wx.showNavigationBarLoading();
      var param = { storeId: app.globalData.storeId };
      param[this.data.addname] = this.data.envalue;
      if (this.data.addname =='customname'){
        param['value'] = util.api.getFilterArray(this.data.selected);
      }
      console.log(app.globalData.storeId)
      util.api.request({
        url: this.data.url,
        data: param,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          app.changeData = that.data.envalue;
          app.changeId = res.data;
          var object = {
            id: res.data,
            storeId: app.globalData.storeId
          }
          var name = '';
          var appname = ''
          console.log(app.changeId);
          switch (that.data.addname){
            case 'catename':
              name = 'catename';
              appname = 'screen_productTypeList'
              break;
            case 'brandname':
              name = 'brandname';
              appname = 'screen_brandList'
              break;
            case 'unit':
              name = 'unit'
              appname = 'screen_unitList'
              break;
          }
          console.log(appname)
          
          if (appname){
            object[name] = that.data.envalue;
            console.log(app[appname])
            app[appname].push(object)
          }
          if (that.data.addname == 'customname') {
            app.changesizename = 'customname';
            app.changeId = param;
          }
          app.changesizename = 'sizename';
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 2000
          })
          that.back();
        }
      })
    } else {
      wx.showToast({
        title: '请填写内容',
        mask: true,
        duration: 2000
      })
    }
  },
  onLoad: function (options) {
     this.setData({
       url: options.url,
       name: options.name,
       addname: options.addname
     })
     console.log(options.name)
  },
  onShow:function(){
    this.setData({
      sizeArray: app.sizeArray
    })
  }
})