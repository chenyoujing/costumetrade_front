var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    client: "1",
    ClientsList:[],
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
    loadMore: true,
    requestSwitch: true,
    pageNum:1,
    scanModal: true,
  },
  // 客户等级查询/地区,全局变量
  initCustomer: function () {
    var that = this
    wx.showNavigationBarLoading()
    var client = this.data.client
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
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var districtList = []
        for (var p in res.data.districtList){
          districtList.push({
            value: res.data.districtList[p]
          })
        }
        app.custProdPriceList = res.data.custProdPriceList
        app.districtList = districtList
      }
    })
  },

  // 请求数据
  page_request: function () {
    var that = this
    var client = this.data.client
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/getClients',
      data: {
        storeId:1,
        type: client,
        sort: that.data.getSortData,
        rules: app.getClientData,
        name: app.searchValue,
        pageNum: that.data.pageNum,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var ClientsList = res.data
        //把1,2,3...变为 普通会员,银卡会员,金卡会员...
        for (var p in ClientsList) {
          for (var j in app.custProdPriceList) {
            if(ClientsList[p].cate == app.custProdPriceList[j].id){
              ClientsList[p].cate = app.custProdPriceList[j].custtypename
            }
          }
        }
        //分页
        var data = that.data.ClientsList
        var booleanre = that.data.requestSwitch;

        if (that.data.pageNum == 1) {
          data = res.data;
        } else {
          for (var p in res.data) {
            data.push(res.data[p])
          }
        }
        if (res.data.length < 10) {
          booleanre = false;
        } else {
          booleanre = true;
        }
        that.setData({
          ClientsList: data,
          loadMore: true,
          requestSwitch: booleanre
        })
      }
    })
  },
  // 三种种类切换
  clientType:function(e){
    var client = e.target.dataset.client
    if (client != this.data.client){
      this.setData({
        client: client,
        pageNum: 1,
        ClientsList: [],
        requestSwitch: true
      })
      this.page_request();
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
      ClientsList: [],
      requestSwitch: true
    });
    this.page_request();
  },
  bindfocus:function(){
    wx.navigateTo({
      url: 'clientScreen/clientScreen',
    })
    this.setData({
      inputFocus:false,
    })
  },
  // 上拉加载
  onReachBottom: function () {
    console.log('到底不了')
    this.setData({
      pageNum: this.data.pageNum + 1,
      loadMore: false
    });
    console.log(this.data.pageNum)
    if (this.data.requestSwitch) {
      this.page_request();
    }
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
    var ids = this.data.ids
    var ClientsList = this.data.ClientsList
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/updateClients',
      data: {
        idArray: ids,
        status:1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var ClientsList = that.data.ClientsList;
        for (var p in ids) {
          for (var j in ClientsList) {
            if (ids[p] == ClientsList[j].id) {
              ClientsList.splice(j, 1)
            }
          }
        }
        that.setData({
          ClientsList: ClientsList,
          ids:[],
          checkedClear:false
        })
        wx.showToast({
          title: '成功删除',
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
      ids:[],
      checkedClear:false
    })
  },
  // 批量删除
  batch_delete_sure: function(){
    this.delectRequest();
  },
  // 获取二维码
  scan: function () {
    this.setData({
      scanModal: false,
    })
    var client = this.data.client
    var that = this
    var id = util.api.DateFormat(new Date())
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/scanQRCode',
      data: {
        type: client,
        storeId: "1",
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          scan: res.data,
          id: id
        })
      }
    })
  },
  // 关闭扫码模态框
  cancel: function () {
    this.setData({
      scanModal: true
    })
  },
  // 扫好了
  confirm: function () {
    var that = this
    wx.showNavigationBarLoading()
    var client = this.data.client
    var id = this.data.id
    util.api.request({
      url: 'client/scanQRCodeOk',
      data: {
        type: client,
        storeId: "1",
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (!res.data.id) {
          wx.showToast({
            title: res.msg,
            duration: 2000
          })
        }else{
          app.addCustomerInfo = res.data
          wx.navigateTo({
            url: 'clientAdd/clientAdd?client=' + that.data.client
          })
        }
      }
    })
    this.cancel()
  },
  onLoad: function (e) {
    var that = this
    this.initCustomer()
    console.log(typeof (new Date(Date.now() - 86400000)))
    console.log(new Date)

  },
  onShow:function(){
    this.setData({
      pageNum: 1,
      requestSwitch: true,
      enterValue: app.searchValue
    })
    this.page_request()

  }
})
