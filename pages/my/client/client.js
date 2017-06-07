var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    client: "1",
    sort:'1',
    account: "",
    goods: "",
    date_start: '',
    date_end: '',
    account_date: "",
    more_function_display: "none",
    animation: "",
    select_checkbox: '0',
    delete_button: '0',

  },
  onLoad: function (e) {
    var that = this
    this.setData({
      date_start: util.formatTime(new Date(Date.now() - 86400000)),
      date_end: util.formatTime(new Date(Date.now())),
      account_date: util.formatTime(new Date(Date.now())),
    })
  },
  clientType: function (e) {
    var that = this
    let data = e.target.dataset
    if (that.data.client != data.client) {
      wx.request({
        url: 'http://192.168.2.221:8088/client/getClients',
        data: {
          type: data.client,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            client_info: res.data.data,
          })
        }
      })
    }
    that.setData({
      client: data.client
    })
  },
  clientSort:function(e){
    let data = e.target.dataset
    this.setData({
      sort: data.sort
    })
  },
  client_add: function (e) {
    var that = this
    let data = e.target.dataset
    if (data.clientid) {
      wx.request({
        url: 'http://192.168.2.221:8088/client/getClient',
        data: {
          clientId: data.clientid,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            clientid: res.data.data.id,
            updata_name: res.data.data.name,
            updata_code: res.data.data.code,
            updata_wholeprice: res.data.data.wholeprice,
            updata_packprice: res.data.data.packprice,
            updata_retailprice: res.data.data.retailprice,
            updata_purchaseprice: res.data.data.purchaseprice,
            updata_tagprice: res.data.data.tagprice,
            updata_handcount: res.data.data.handcount,
            year: res.data.data.year,
            season: res.data.data.season,
            warnHigh: res.data.data.warnHigh,
            warnLow: res.data.data.warnLow,
          })
        }
      })
    } else {
      var date = new Date(Date.now());

      that.setData({
        clientid: "",
        updata_name: "",
        updata_code: "",
        updata_wholeprice: "",
        updata_packprice: "",
        updata_retailprice: "",
        updata_purchaseprice: "",
        updata_tagprice: "",
        updata_handcount: "",
        date_up: util.formatTime(new Date),
        year: date.getFullYear(),
        season: "",
        warnHigh: "",
        warnLow: "",
      })
    }
  },
  client_add_submit: function (e) {
    var client = event.detail.value
    let data = e.target.dataset
    if (data.clientid) {
      var clientid = data.clientid
    }else{
      var clientid = ""
    }
    var that = this
    wx.request({
      url: 'http://192.168.2.221:8088/client/saveClient',
      data: {
        clientId: clientid,
        type: that.data.client,
        clientId: that.data.client,
        contact: client.name0,
        phone: client.phone,
        telephone: client.telephone,
        province: client.province,
        city: client.city,
        district: client.district,
        address: client.address,
        cate: "CUSTOMER_TYPE",
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          client_info: res.data.data,
        })
      }
    })
  },
  client_delete: function (e) {
    var clienttype = ["", "客户", "供货商", "朋友"]
    var that = this
    let data = e.target.dataset
    wx.showModal({
      title: '删除' + clienttype[this.data.client],
      content: '你确定要删除该' + clienttype[this.data.client] + "吗？",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'http://192.168.2.221:8088/client/deleteClient',
            data: {
              clientId: data.clientid,
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log('用户点击删除')
            }
          })
        }
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
  // 选择删除
  batch_delete_sure: function () {
    
  },

})
