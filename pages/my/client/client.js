var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    client: "",
    sort:'1',
    date_start: '',
    date_end: '',
    account_date: "",
    more_function_display: "none",
    animation: "",
    select_checkbox: '0',
    delete_button: '0',
    ids:[],
  },
  // 客户列表加载
  clientType: function (e) {
    var that = this
    if (e){
      var client = e.target.dataset.client
    }else{
      var client = '1'
    }

    if (that.data.client != client) {
      util.api.request({
        url: 'client/getClients',
        data: {
          storeId:1,
          type: client,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            ClientsList: res.data
          })
        }
      })
    }
    this.setData({
      client: client
    })
  },
  // 排序类型
  clientSort:function(e){
    let data = e.target.dataset
    this.setData({
      sort: data.sort
    })
  },
  // 批量删除选择框
  delete_container: function (e) {
    var ids = e.target.dataset.id;
    var boolean2 = true;
    var idsArray = this.data.ids;
    for (var p in idsArray) {
      if (idsArray[p] == ids) {
        idsArray.splice(p, 1);
        boolean2 = false;
        break;
      }
    }
    if (boolean2) {
      idsArray.push(ids)
    }
    this.setData({
      ids: idsArray
    })
  },
  // 批量删除
  delectRequest: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/deleteClient',
      data: {
        idArray: that.data.ids
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var product = that.data.product;
        for (var p in ids) {
          for (var j in ClientsList) {
            if (ids[p] = ClientsList[j].id) {
              ClientsList[j].splice(j, 1)
            }
          }
        }
        that.setData({
          ClientsList: ClientsList
        })
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
      }
    })
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
  // 批量删除
  batch_delete: function () {
    this.setData({
      select_checkbox: '50',
      delete_button: '40',
    })
    this.more_function_close();
  },
  // 完成批量删除
  batch_delete_ok: function () {
    this.setData({
      select_checkbox: '0',
      delete_button: '0',
    })
  },
  // 批量删除
  batch_delete_sure: function(){
    this.batch_delete_ok();
    this.delectRequest();
  },
  onLoad: function (e) {
    var that = this
    this.clientType()
    this.setData({
      date_start: util.formatTime(new Date(Date.now() - 86400000)),
      date_end: util.formatTime(new Date(Date.now())),
      account_date: util.formatTime(new Date(Date.now())),
    })
  },
})
