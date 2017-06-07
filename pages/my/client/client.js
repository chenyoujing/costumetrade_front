//index.js
//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    scroll_height: "",
    client: "1",
    sort:'1',
    clienttype: "",
    client_info: "",
    client_add: "",
    account: "",
    goods: "",
    accounttype: "0",
    date_start: '',
    date_end: '',
    account_date: "",
    billtype: ["收客户欠款", "换供货欠款", "应收调账", "应付调账"],
    billtype_index: 0,
    paytype: ["现金", "刷卡", "微信", "支付宝", "农业银行", "工商银行", "广发银行", "招商银行", "中信银行", "华夏银行", "建设银行"],
    paytype_index: 0,
    zero: "",
    container_width: "100%",
    image_width: "115",
  },
  onLoad: function (e) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scroll_height: res.windowHeight - 95
        })
      }
    })
    that.setData({
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

    this.setData({
      client_add: "0",
    })
  },
  close: function () {
    this.setData({
      client_add: "100%"
    })
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
  account: function (e) {
    var that = this
    let data = e.target.dataset
    this.setData({
      account: "0",
    })
  },
  account_close: function () {
    this.setData({
      account: "100%"
    })
  },
  accounttype: function (e) {
    var that = this
    let data = e.target.dataset
    that.setData({
      accounttype: data.accounttype
    })
  },
  startDateChange: function (e) {
    this.setData({
      date_start: e.detail.value
    })
  },
  endDateChange: function (e) {
    this.setData({
      date_end: e.detail.value
    })
  },
  account_date: function (e) {
    this.setData({
      account_date: e.detail.value
    })
  },
  swiper_change: function (e) {
    this.setData({
      accounttype: e.detail.current
    })
  },
  billtypePicker: function (e) {
    this.setData({
      billtype_index: e.detail.value
    })
  },
  paytypePicker: function (e) {
    this.setData({
      paytype_index: e.detail.value
    })
  },
  zero: function () {
    this.setData({
      zero: "0"
    })
  },
  goods: function (e) {
    var that = this
    let data = e.target.dataset
    this.setData({
      goods: "0",
    })
  },
  rank: function() {
    var that = this
    if (this.data.container_width == "100%"){
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            container_width: "50%",
            image_width: res.windowWidth/2 - 20,
            text_position: "relative",
            text_left: "0",
            text_padding: "0 5px",
            title_padding: "5px 5px 0",
            info_padding: "0",
            info_border: "none",
          })
        }
      })
    }else{
      that.setData({
        container_width: "100%",
        image_width: "115",
        text_position: "absolute",
        text_left: "115px",
        text_padding: "",
        title_padding: "",
        info_padding: "",
        info_border: "",
      })
    }
  },
  goods_close: function () {
    this.setData({
      goods: "100%"
    })
  },

})
