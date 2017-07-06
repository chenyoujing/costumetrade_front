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
    points_button: '0',
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
    checkedClear: false,
    checkAllTag: false
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
        storeId: app.globalData.storeId,
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
        storeId: app.globalData.storeId,
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
          ClientsList[p].catenum = ClientsList[p].cate
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
          if (res.data == 1000) {
            data = data
          }else{
            data = res.data;
          }
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
        console.log(data)

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
    console.log(idsArray)
    this.setData({
      ids: idsArray
    })
  },
  // 批量删除
  delectRequest: function () {
    var that = this;
    var ids = this.data.ids;
    var ClientsList = this.data.ClientsList
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/updateClients',
      data: {
        idArray: ids,
        status:1,
        checkAllTag: that.data.checkAllTag
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var ClientsList = that.data.ClientsList;
        // 缓存
        if (that.data.client == 3) {
          that.clearStorage("UnitData1")
          that.clearStorage("UnitData2")
        }else{
          var name = that.data.client == 1 ? "UnitData1" : "UnitData2";
          that.clearStorage(name)
        }
      // 操作界面

        ClientsList = util.api.deleteGoodsorClient(ids, ClientsList, that.data.checkAllTag)

        that.setData({
          ClientsList: ClientsList,
          ids:[],
          checkedClear:false,
          checkAllTag:false
        })
        wx.showToast({
          title: '成功删除',
          mask: true,
          duration: 2000
        })
      }
    })
  },
  // 清除客户缓存
clearStorage:function(name){
  var that = this;
  var ids = this.data.ids;
  var totalProduct = [];
  wx.getStorage({
    key: name,
    success: function (res) {
      totalProduct = res.data ? res.data : [];
      // 更新缓存
      totalProduct = util.api.deleteGoodsorClient(ids, totalProduct, that.data.checkAllTag);
      console.log(totalProduct)
      wx.setStorage({
        key: name,
        data: totalProduct,
         fail: function (res) {
          wx.showToast({
            title: "缓存失败",
            mask: true,
            duration: 2000
          })
        }
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
    this.batch_ok()
    this.setData({
      select_checkbox: '50',
      delete_button: '40',
    })
    this.more_function_close();
  },
  // 全选全不选
  SelectallOrNot: function () {
    this.setData({
      checkedClear: !this.data.checkedClear,
      checkAllTag: !this.data.checkedClear,
      ids: []
    })
  },
  // 完成批量删除
  batch_ok: function () {
    this.setData({
      select_checkbox: '0',
      delete_button: '0',
      points_button: '0',
      ids: [],
      checkedClear: false
    })
  },
  // 批量删除
  batch_delete_sure: function () {
    var idsArray = this.data.ids;
    if (idsArray.length == 0 && !this.data.checkAllTag) {
      wx.showToast({
        title: '请勾选要删除的货品',
        mask: true,
        duration: 2000
      })
    } else {
      this.delectRequest();
      this.batch_ok();
    }
  },
  // 清空积分
  batch_points: function () {
    this.batch_ok()
    this.setData({
      select_checkbox: '50',
      points_button: '40',
    })
    this.more_function_close();
  },
  // 清空积分
  batch_points_sure: function () {
    
  },
  setdata:function(data){
    this.setData(data)
  },
  // 获取二维码
  scan: function () {
    util.api.scan(this.data.client, this.setdata)
  },
  // 关闭扫码模态框
  cancel: function () {
    this.setData({
      scanModal: true
    })
  },
  // 扫描成功的回调
   callback:function(data){
    app.addCustomerInfo = data
      wx.navigateTo({
        url: 'clientAdd/clientAdd?client=' + this.data.client + "&clientId=" + this.data.id + "&scan=" + true
    })
  },
  // 扫好了
  confirm: function () {
    var that = this
    util.api.scanOk(that.data.client, that.data.id, this.callback)
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
