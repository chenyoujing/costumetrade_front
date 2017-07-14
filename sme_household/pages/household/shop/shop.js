import socket from '../../../utils/socket.js'
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    imgUrls: [
      '../../../images/swiper1.jpg',
      '../../../images/swiper2.jpg',
    ],
    myselfStord:{},
    otherStord:[]
  },
  goto_info:function(e){
    app.infotype = e.target.dataset.infotype
    wx.switchTab({
      url: '../info/info',
    })
  },
  // 初始化数据
  initialize:function(){
    for (var p in app.globalData.storeInfo){
      var reg = /^\//;
      if (reg.test(app.globalData.storeInfo[p].storephoto)) {
        app.globalData.storeInfo[p].storephoto = util.api.imgUrl + app.globalData.storeInfo[p].storephoto
      }   
    }
    var otherStord = app.globalData.storeInfo;
    if (otherStord.length == 1) {
      otherStord = [];
    } else {
      otherStord = otherStord.splice(1, );
      console.log(otherStord)
    }
    this.setData({
      myselfStord: app.globalData.storeInfo[0],
      otherStord: otherStord
    })
  },
  onLoad:function(){
    // this.aa()
    // this.bb()
    this.setData({
      url: util.api.imgUrl
    })
    if (!app.globalData.openid){
      util.api.getOpenid(this.initialize);
    }else{
      this.initialize()
    }
    if (!app.logisticFees && app.globalData.userIdentity!==2) {
      util.api.getProductInit()
    }
    wx.updateShareMenu({
      withShareTicket: true,
      success() {
      }
    })
  },
  onShow:function(){
    this.setData({
      myselfStord: app.globalData.storeInfo[0]
    })
    // wx.connectSocket({
    //   url: 'ws://192.168.2.221:8081/ws',
    //   data:{
    //   },
    //   method: "GET"
    // })
    // wx.onSocketOpen(function (res) {
    //   console.log('WebSocket连接已打开！')
    // })
    // wx.onSocketMessage(function (res) {
    //   console.log('收到服务器内容：' + res.data)
    // })
    // wx.onSocketClose(function (res) {
    //   console.log('WebSocket 连接打开失败')
    // })
    // wx.onSocketOpen(function (res) {
    //   wx.sendSocketMessage({
    //     data: '123',
    //     success: function () {
    //       console.log('发送成功')
    //     }
    //   })
    // })
  },
  cc:function(){
    console.log(555)
    // 开始搜寻附近的蓝牙外围设备
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("适配器")
        console.log(res.data)
      }
    })
  },
  aa:function(e){
    // this.bb()
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        wx.startBluetoothDevicesDiscovery({
          success: function (res) {
            console.log("适配器")
            console.log(res.data)
          }
        })
        wx.onBluetoothDeviceFound (function (devices) {
          console.log(devices)
          console.log('发现新蓝牙设备' + devices.devices[0].deviceId)
          wx.createBLEConnection({
            deviceId: devices.devices[0].deviceId,
            success: function (res) {
              console.log(res);
              console.log("连接成功");
              wx.stopBluetoothDevicesDiscovery({
                success: function (res) {
                  console.log(res)
                }
              })
            },
            fail:function(res){
              console.log(res);
              console.log("失败");
            }
          })
          // wx.getBLEDeviceServices({
          //   deviceId: devices.devices[0].deviceId,
          //   success: function (res) {
          //     console.log('device services:', res.services)
          //   }
          // })
        })
       
        // wx.onBluetoothAdapterStateChange(function (res) {
        //   console.log("蓝牙适配器状态变化", res)
        //   that.setData({
        //     isbluetoothready: res.available,
        //     searchingstatus: res.discovering
        //   })
        // })
        
        // wx.getBluetoothDevices({
        //   success: function (res) {
        //     console.log("获取所有已发现的蓝牙设备")
        //     console.log(res)
        //   }
        // })
        
       
        // wx.onBLECharacteristicValueChange(function (characteristic) {
        //   console.log('characteristic value comed:')
        //   let buffer = characteristic.value
        //   let dataView = new DataView(buffer)
        //   console.log("接收字节长度:" + dataView.byteLength)
        //   var str = ""
        //   for (var i = 0; i < dataView.byteLength; i++) {
        //     str += String.fromCharCode(dataView.getUint8(i))
        //   }
        //   str = getNowFormatDate() + "收到数据:" + str;
        //   that.setData({
        //     receivedata: that.data.receivedata + "\n" + str,
        //     onreceiving: true
        //   })
        // })
      },
      fail: function (res) {
        var that = this;
        console.log("初始化蓝牙适配器失败")
        wx.showModal({
          title: '提示',
          content: '请检查手机蓝牙是否打开',
          success: function (res) {
            that.setData({
              isbluetoothready: false,
              searchingstatus: false
            })
          }
        })
      }
    })

    // console.log(e.detail)
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.access_token,
    //   data: {
    //     // osp3q0FNSOFEpuSpDSuaH7__TXDY,
    //     // osp3q0IO2fCv11iCOM9eRtiCOqLc,
    //     touser: app.globalData.openid,
    //     template_id: "fYO5us4tA7W6MITP4o7FcwhS6FeECr3gdcfuiTYB_5k",
    //     form_id: e.detail.formId,
    //     data: {
    //       "keyword1": {
    //         "value": "339208499",
    //         "color": "#173177"
    //       },
    //       "keyword2": {
    //         "value": "2015年01月05日 12:30",
    //         "color": "#173177"
    //       },
    //       "keyword3": {
    //         "value": "粤海喜来登酒店",
    //         "color": "#173177"
    //       },
    //       "keyword4": {
    //         "value": "广州市天河区天河路208号",
    //         "color": "#173177"
    //       }
    //     },
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })

    // var openidList = ['oDy7t0GCpfxdFdFyNPhu_VYVufS4', 'oDy7t0HjUcYhdFMgiFbuFHCqSEGo']
    // if (app.globalData.openid == openidList[0]) {
    //   var openid1 = openidList[0]
    //   var openid2 = openidList[1]
    // } else {
    //   var openid2 = openidList[0]
    //   var openid1 = openidList[1]
    // }

    // wx.sendSocketMessage({
    //   data: 'ws://192.168.2.221:8081/ws?fUserName=' + openid2 + '&tUserName=' + openid1,
    //   success: function () {
    //     console.log('123')
    //   }
    // })
  },
  bb:function(){
  //   wx.startBluetoothDevicesDiscovery({
  //     success: function (res) {
  //       console.log("zhaodoa")
  //       console.log(res.data)
  //       console.log(res)
  //     }
  //   })
  // wx.onBluetoothDeviceFound(function(devices) {
  //   console.log('new device list has founded')
  //   console.dir(devices)
  // })
  //     wx.closeSocket()

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/pages/index/index?id=我传的东西',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})