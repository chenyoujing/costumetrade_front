var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    client: "1",
    more_function_display: "none",
    animation: "",
    select_checkbox: '0',
    delete_button: '0',
    ids:[],
    state: 'nameOp',
    Op: 'desc',
    getSortData: {
      value: 'nameOp',
      op: 'desc'
    },
    pageNum: 1,
    requestSwitch: true,

  },
  // 请求数据
  clientType: function (e) {
    var that = this
    var client=""
    if (e){
      client = e.target.dataset.client
    }

    if (that.data.client != client) {
      util.api.request({
        url: 'client/getClients',
        data: {
          storeId:1,
          type: 1,
          sort: that.data.getSortData
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.setData({
            ClientsList: res.data
          })
        }
      })
    }
    if (client){
      this.setData({
        client: client
      })
    }
  },
  // 三种排序效果切换
  clientSort: function (e) {
    var status = e.currentTarget.dataset.sort;
    var op = this.data.Op ? this.data.Op : 'desc';
    if (op == 'desc') {
      op = 'asc'
    } else {
      op = 'desc'
    }
    this.setData({
      state: status,
      Op: op,
      getSortData: {
        value: status,
        op: op
      },
      pageNum: 1,
      product: [],
      requestSwitch: true
    });
    this.clientType();
  },
  // 客户等级查询
  initCustomer: function () {
    var client = this.data.client
    var that = this
    util.api.request({
      url: 'client/initCustomer',
      data: {
        type: client,
        storeId: 1,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          initCustomerList: res.data.custProdPriceList
        })
      }
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
    this.initCustomer()
  },
})
