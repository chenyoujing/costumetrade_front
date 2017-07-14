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
  // 加入之前的判断
  jude:function(){
    if (!this.data.envalue) {
      wx.showToast({
        title: '请填写内容',
        mask: true,
        duration: 1000
      })
    } else {
      var add = true;
      for (var p in this.data.productstring){
        if (this.data.productstring[p][this.data.addname] == this.data.envalue){
          wx.showToast({
            title: '已存在，请更改',
            mask: true,
            duration: 1000
          })
          add = false;
          this.setData({
            envalue:""
          })
          break;
        }
      }
      if (add){
        this.addOptions()
      }
    }
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
    
    wx.showNavigationBarLoading();
    var param = { storeId: app.globalData.storeId };
    param[this.data.addname] = this.data.envalue;
    if (this.data.addname == 'customname') {
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
        param.id = res.data;
        var name = '';
        var appname = ''
        console.log(app.changeId);
        switch (that.data.addname) {
          case 'catename':
            appname = 'screen_productTypeList'
            break;
          case 'brandname':
            appname = 'screen_brandList'
            break;
          case 'unit':
            appname = 'screen_unitList'
            break;
        }
        console.log(appname)

        if (appname) {
          // object[name] = that.data.envalue;
          // console.log(app[appname])
          app[appname].push(param)
        }
        if (that.data.addname == 'customname') {
          app.changesizename = 'customname';
          app.changeId = param;
        } else if (that.data.addname == 'sizename'){
          app.changesizename = 'sizename';
          // app.changeId = param;
        }
        
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '添加成功',
          mask: true,
          duration: 2000
        })
        that.back();
      }
    })
  },
  onLoad: function (options) {
     this.setData({
       url: options.url,
       name: options.name,
       addname: options.addname,
       productstring: JSON.parse(options.productstring) 
     })
     console.log(options.name)
  },
  onShow:function(){
    this.setData({
      sizeArray: app.sizeArray
    })
  }
})