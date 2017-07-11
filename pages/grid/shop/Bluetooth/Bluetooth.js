
Page({  
  data:{
    deviceId:'',
    deviceList:[]
  },  
  onLoad:function(options){  
    // 页面初始化 options为页面跳转所带来的参数  
  },  
  //初始化蓝牙适配器  
  openBluetooth:function(){  
    wx.openBluetoothAdapter({  
      success: function(res){  
        console.log(res.errMsg)  
        // success  
        wx.showToast({  
          title:"初始化蓝牙适配器成功",  
          duration:2000  
        })  
      },  
    })  
  },  
//关闭蓝牙模块  
closeBluetooth:function(){  
 wx.openBluetoothAdapter()  
  wx.closeBluetoothAdapter({  
    success: function(res){  
      // success  
       console.log("success"+res)  
    }  
  })  
},  
//获取本机蓝牙适配器状态  
getBluetoothAdapterState:function(){  
wx.getBluetoothAdapterState({  
  success: function(res){  
    // success  
     console.log(res)  
  }  
})  
},  
//监听蓝牙适配器状态变化事件  
  onBluetoothAdapterStateChange:function(){  
    wx.onBluetoothAdapterStateChange(function(res) {  
      console.log(`adapterState changed, now is`, res)  
  })  
},  
 // 开始搜寻附近的蓝牙外围设备  
  startBluetoothDevicesDiscovery:function(){  
    wx.startBluetoothDevicesDiscovery({  
      success: function (res) {  
      console.log(res)  
    }  
  })  
},  
 // 停止搜寻附近的蓝牙外围设备  
  stopBluetoothDevicesDiscovery:function(){  
    wx.stopBluetoothDevicesDiscovery({  
      success: function (res) {  
      console.log(res)  
    }  
  })  
},  
  //获取所有已发现的蓝牙设备  
  getBluetoothDevices:function(){ 
    var that = this; 
    wx.getBluetoothDevices({  
      success: function(res){  
        // success  
        console.log(res);
        console.log('发现新蓝牙设备' + res.devices[0].deviceId)
        that.setData({
          deviceId: res.devices[0].deviceId,
          deviceList: res.devices
        })
        console.log(res)  
      },  
    })  
  },  
  connct:function(e){
    var id = e.target.dataset.id;
    this.createBLEConnection(id);

  },
  //监听寻找到新设备的事件  
  onBluetoothDeviceFound:function(){  
    var that = this;
    wx.onBluetoothDeviceFound(function (devices) {
      console.log(devices)
      console.log('发现新蓝牙设备' + devices.devices[0].deviceId)
      that.setData({
        deviceId: devices.devices[0].deviceId
      })
    })
  },  
  //根据 uuid 获取处于已连接状态的设备  
  getConnectedBluetoothDevices:function(){  
  wx.getConnectedBluetoothDevices({  
  success: function (res) {  
    console.log(res)  
  }  
})  
},  
//连接低功耗蓝牙设备  
  createBLEConnection: function (deviceId){  
  var that = this;
  wx.createBLEConnection({  
    deviceId:deviceId,  
    success: function(res){  
      // success  
      console.log(res) ;
       
    },  
    fail: function(res) {  
      console.log(res)  
      // fail  
    },  
    complete: function(res) {  
      console.log(res)  
      // complete  
    }  
  })  
},  
//断开与低功耗蓝牙设备的连接  
closeBLEConnection:function(){  
  var that = this
  wx.closeBLEConnection({  
    deviceId: that.data.deviceId, 
    success: function (res) {  
    console.log(res)  
  }  
})  
},  
//监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等  
onBLEConnectionStateChanged:function(){  
  wx.onBLEConnectionStateChanged(function(res) {  
  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)  
})  
},  
//获取蓝牙设备所有 service（服务）  
getBLEDeviceServices:function(){ 
  var that = this; 
  wx.getBLEDeviceServices({  
    deviceId: that.data.deviceId, 
    success: function(res){ 
      that.setData({
        deviceId: res.services.serviceId
      })
      // success  
       console.log('device services:', res.services.serviceId)  
    },  
    fail: function(res) {  
      // fail  
    },  
    complete: function(res) {  
      // complete  
    }  
  })  
},  
//获取蓝牙设备所有 characteristic（特征值）  
getBLEDeviceCharacteristics:function(){  
  wx.getBLEDeviceCharacteristics({  
    deviceId: that.data.deviceId, 
    serviceId: that.data.serviceId, 
    success: function(res){  
      // success  
    },  
    fail: function(res) {  
      // fail  
    },  
    complete: function(res) {  
      // complete  
    }  
  })  
}  
})  

