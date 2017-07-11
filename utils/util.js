var app = getApp();
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
   + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function toDate(number) {
  var n = number;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
}
console.log(app.globalData) 
//请求接口公共方法
var api = {
  host: 'http://192.168.2.221:8088/',
  pageNum :1,
  publicProduct:[],
  imgUrl: "http://117.149.24.42:8788",
  // 登录接口
  getOpenid: function (callback) {
    var that = this;
    console.log(app.globalData) 
    app.globalData.userInfo = {
      appid:'wx0f02d5eacaf954e7',
      secret:'8d7f55d6a5008b7f8efead72672008a6',
      storeInfo: ''
    }
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: that.host + '/user/login',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: loginCode.code,
            appId: app.globalData.userInfo.appid,
            appSecret: app.globalData.userInfo.secret
          },
          method: 'POST',
          success: function (res) {
            app.globalData.sessionKey = res.data.data.sessionKey;
            wx.getUserInfo({
              success: function (res) {
                wx.request({
                  url: that.host + '/user/getUnionId',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    sessionKey: app.globalData.sessionKey
                  },
                  method: 'POST',
                  success: function (res) {
                    app.globalData.userInfo.code = loginCode.code
                    app.globalData.openid = res.data.data.query.openid;
                    app.globalData.privilegeEmployees = res.data.data.employee.privilegeEmployees;
                    app.globalData.userIdentity = res.data.data.userIdentity;
                    app.globalData.storeInfo = res.data.data.query.storeList || [];
                    app.globalData.modifyPrice = res.data.data.employee.modifyPrice;
                    app.globalData.zeroPrice = res.data.data.employee.zeroPrice;
                    app.globalData.discount = res.data.data.employee.discount;
                    app.globalData.storeId = res.data.data.storeId;
                    if (callback) {
                      callback();
                    }

                  }
                })
              }
            })
          }
        })
      }
    })
  },
  // 数组转化成字符串
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 正则判断。。。
  regular: function (val,reg,title){    
    if (!reg.test(val)) {
      wx.showToast({
        title: title,
      })
      return false
    }   
    return true
  },
  // 报表切换时间
  tiemFilter: function (e) {
    var number = e.target.dataset.number;
    var timebool = 1;
    var object = {};
    if (number == 'false') {
      object.timebool = -1;
    } else if (number == "true") {
      object.timebool = 1;
    }else {
      var myDate = new Date();
      var endTime = toDate(myDate);
      myDate.setDate(myDate.getDate() - number);
      var beginTime = toDate(myDate);
      object =  {
        beginTime: beginTime,
        endTime: endTime,
        timebool: timebool
      }
    }
    return object;
  },
  // 报表检测结束时间是否要更改
  endTimeiSchange: function (benginTime, endTime) {
    var newbenginTime = (new Date(benginTime)).getTime();
    var newendTime = (new Date(endTime)).getTime()
    if (newbenginTime > newendTime) {
      endTime = benginTime.split(' ')[0];
    }
    return endTime
  },
  // 报表时间改变
  timeChange: function (e, beginTime, endTime) {
    var param = {};
    var style = e.currentTarget.dataset.name;
    param.beginTime = beginTime;
    param.endTime = endTime;
    if (style == 'beginTime') {
      param.beginTime = e.detail.value;
    } else {
      param.endTime = e.detail.value ;
    }
    param.endTime = this.endTimeiSchange(param.beginTime, param.endTime);
    return param;
  },
  // 获取二维码。。。
  scan: function (client, setdata) {
    wx.showNavigationBarLoading()
    var id = this.DateFormat(new Date())
    this.request({
      url: 'client/scanQRCode',
      data: {
        type: client,
        storeId: app.globalData.storeId,
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = {
          scanModal: false,
          scan: res.data,
          id: id
        }
        setdata(data)
      }
    })
  },
  // 判断有没有，没有的话push 更新缓存
  updataStorage: function (object, client) {
    var name = "";
    if (client !== 2) {
      name = "UnitData1";
    } 
    if (client !== 1){
      name = "UnitData2";
    }
    wx.getStorage({
      key: name,
      success: function (res) {
        var add = true;
        for (var p in res.data) {
          if (res.data[p].id == object.id) {
            add = false;
            res.data[p] = object;
          }
        }
        if (add) {
          res.data.push(object)
        }
        wx.setStorage({
          key: name,
          data: res.data
        })
      },
    })
  },
  // 删除东西
  deleteGoodsorClient: function (ids, product, checkAllTag) {
    console.log(checkAllTag)
    if (checkAllTag) {
      var newArray = [];
      for (var p in ids) {
        for (var j = product.length - 1; j >= 0; j--) {
          console.log(product[j].id)
          if (ids[p] == product[j].id) {
            var aa = product.splice(j, 1);
            newArray.push(aa[0])
          }
        }
      }
      product = newArray;
    } else {
      for (var p in ids) {
        for (var j in product) {
          if (ids[p] == product[j].id) {
            product.splice(j, 1)
          }
        }
      }
    }
    return product;
  }, 
  // 二维码扫好了。。。
  scanOk: function (client, id, callback, stringSend) {
    var that = this;
    wx.showNavigationBarLoading();
    var data = {
      type: client,
      storeId: app.globalData.storeId,
      id: id
    };
    if (stringSend){
      data.context = stringSend;
    }
    this.request({
      url: 'client/scanQRCodeOk',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.updataStorage(res.data, client  )
        wx.hideNavigationBarLoading();
        if (!res.data.id) {
          wx.showToast({
            title: res.msg,
          })
        } else if (callback){
          callback(res.data)
        }
      }
    })
  },
  // 支付方式转换。。。
  paycact: function (dictText) {
    for (var p in app.paycact) {
      if (dictText == app.paycact[p].dictText) {
        dictText = app.paycact[p].dictValue
      }
      if (dictText == app.paycact[p].dictValue) {
        dictText = app.paycact[p].dictValue
      }
    }
    return dictText
  },
  DateFormat:function (format) {
    var o = {
      "Y+": format.getYear(),
      "M+": format.getMonth() + 1, //month
      "d+": format.getDate(), //day
      "h+": format.getHours(), //hour
      "m+": format.getMinutes(), //minute
      "s+": format.getSeconds(), //second
      "q+": Math.floor((format.getMonth() + 3) / 3),//quarter，
      "S": format.getMilliseconds() //毫秒
    };
    o["M+"] = o["M+"] <= 10 ? String(0) + o["M+"] : o["M+"];
    o["d+"] = o["d+"] <= 10 ? String(0) + o["d+"] : o["d+"];
    o["h+"] = o["h+"] <= 10 ? String(0) + o["h+"] : o["h+"];
    o["m+"] = o["m+"] <= 10 ? String(0) + o["m+"] : o["m+"];
    o["s+"] = o["s+"] <= 10 ? String(0) + o["s+"] : o["s+"];
    if (o["S"] <= 10) {
      o["S"] = String(0) + String(0) + o["S"];
    } else if (o["S"] <= 100) {
      o["S"] = String(0) + o["S"];
    };
    format = o["Y+"] + o["M+"]+ o["d+"]+ o["h+"] + o["m+"] + o["s+"] + o["S"];
    format = (new Date()).getTime();
    format = String(66666) + format
    return format;
  },
  // 选择图片上传
  chooseImg: function (e,callback) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        callback(e,res)
      }
    })
  }, 
  // 选择视频
  chooseVideo: function (e, callback) {
    var that = this;
    wx.chooseVideo({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        callback(e, res)
      }
    })
  },
  getFilterArray:function(array){
    var string = '';
    for(var p in array){
      string += array[p]+',';
    }
    string = string.substring(0, string.length - 1)
    return string;
  },
  getProductInit:function(){
    var that = this;
    wx.showNavigationBarLoading();
   this.request({
      url: 'product/getProductInit',
      data: {
        storeId: app.globalData.storeId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        app.screen_brandList = res.data.brandList;//品牌
        app.screen_productTypeList = res.data.productTypeList || [];//种类
        app.screen_productSize = res.data.productSize || [],//尺码组
        app.screen_gradeList = res.data.gradeList || [],//等级
        app.screen_unitList = res.data.unitList || [],//单位
        app.custOrDiscTag = res.data.custOrDiscTag || [],//折扣or打折
        app.custProdPrice = res.data.custProdPrice || [],//启用的价格
        app.privilegeEmployees = res.data.privileges || [],//员工权限
        app.customerTypeList = res.data.customerTypeList || [],//待确定
        app.logisticFees = res.data.logisticFees || [],//快递
        app.payTypeList = res.data.payTypeList || [],//支付方式
        app.getProductInit = true;
      }
    })
  },
  // 克隆对象
  Clone:function (name) {
    var obj = {};
    for (var key in name) {
      obj[key] = name[key];
    }
    return obj;
  },
  //对比两个对象之间的变化
  getEntityModified: function (source,target) {
    var updated = {};
    for (var p in target) {
      console.log(target[p] )
      console.log(source[p])
      if (target[p] != source[p] || source[p] == undefined) {
        updated[p] = target[p];
      }
    }
    return updated;
  },
  // 排序
  by : function (name) {
     return function (o, p) {
         var a, b;
         if (typeof o === "object" && typeof p === "object" && o && p) {
             a = o[name];
             b = p[name];
             if (a === b) {
                 return 0;
             }
             if (typeof a === typeof b) {
                 return a < b ? -1 : 1;
             }
             return typeof a < typeof b ? -1 : 1;
         }
         else {
             throw ("error");
         }
     }
  },
  //拆分客户，朋友
  unitType:function(product){
    var UnitData1 = [];
    var UnitData2 = [];
    for(var p in product){
      if (product[p].type !=="1"){
        UnitData2.push(product[p])
      } 
      if (product[p].type !== '2'){
        UnitData1.push(product[p])
      }
    }
    wx.setStorage({
      key: 'UnitData2',
      data: UnitData2
    })
    wx.setStorage({
      key: 'UnitData1',
      data: UnitData1
    })
  },
  downData:function(url2,objectName,timeName,callback){
    var that = this;
    wx.showNavigationBarLoading();
    var param = {
      storeId: app.globalData.storeId,
      pageNum: that.pageNum
    }
    if (url2=="client/getClients"){
      param = param;
    }else{
      param.fields = "firsthPrice,secondPrice,thirdPrice,fourthPrice,fifthPrice,purchasePrice,tagPrice,image,name,code,barcodes,barcode,time_up,id,isDiscount,raise_price,isPattern"
    }
    this.request({
      url: url2,
      data: param,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {        
        for (var p in res.data) {
          if (url2 !== "client/getClients"){
            res.data[p].image = res.data[p].image ? that.imgUrl + res.data[p].image : '';
          }
          that.publicProduct.push(res.data[p])
        }
        if(res.data.length == 10){
          that.pageNum = that.pageNum+1;
          that.downData(url2, objectName, timeName,callback);
        }else{
          wx.hideNavigationBarLoading();
          if (url2 == "client/getClients"){           
            that.unitType(that.publicProduct)
          }else{
            wx.setStorage({
              key: objectName,
              data: that.publicProduct
            })
          }
          that.pageNum = 1;
          that.publicProduct = [];
          var myDate = new Date();
          myDate.getTime();
          wx.setStorage({
            key: timeName,
            data: myDate
          })
          wx.showToast({
            title: '更新完毕',
            mask: true,
            duration: 2000
          })
        }
        if (callback){
          callback();
        }
      }
    })
  },
  // 检测是否该更新数据
  supplierRefresh: function (url, objectName, timeName, callback){
    var that = this;
    var myDate = new Date();
    wx.getStorage({
      key: timeName,
      complete: function (res) {
        if (parseInt((myDate - res.data) / 1000 / 60 / 60) >= 1 || res.data == undefined) {
          that.downData(url,objectName,timeName,callback)
        }else{
          callback()
        }
      }
    })
   
  },
  // 智能搜索
  searchKeyWord: function (filedsName, select,value,select2,select3) {
    var endArray = [];
    value = value.toLowerCase();
    if (!filedsName[select]) {
      filedsName[select] = ""
    }
    if (!filedsName[select2]) {
      filedsName[select2] = ""
    }
    if (!filedsName[select3]) {
      filedsName[select3] = ""
    }
    if (filedsName[select].toLowerCase() == value || filedsName[select2].toLowerCase() == value || filedsName[select3].toLowerCase() == value) {
      endArray = filedsName;
      endArray.type = 1;
    } else if ((filedsName[select].toLowerCase().indexOf(value) > -1 && filedsName[select].toLowerCase() !== value) || (filedsName[select2].toLowerCase().indexOf(value) > -1 && filedsName[select2].toLowerCase() !== value) || (filedsName[select3].toLowerCase().indexOf(value) > -1 && filedsName[select3].toLowerCase() !== value)) {
      endArray = filedsName;
      endArray.type = 2;
    } else {
      if (value.length <= 2) {
        for (var i in value) {
          if (filedsName[select].toLowerCase() == value[i]) {
            endArray = filedsName;
            endArray.type = 3;
            endArray.word = i;
          } else if (filedsName[select].toLowerCase().indexOf(value[i]) > -1 && filedsName[select].toLowerCase() !== value[i]) {
            endArray = filedsName;
            endArray.type = 3;
            endArray.word = i;
          }
        }
      } else {
        var value1 = value.substring(1);
        var value2 = value.substring(value.length - 1, 0);
        var value3 = value.substring(1, value.length - 1);
        if (filedsName[select].toLowerCase() == value1 ||
          filedsName[select].toLowerCase() == value2 ||
          filedsName[select].toLowerCase() == value3) {
          endArray = filedsName;
          endArray.type = 3;
        } else if ((filedsName[select].toLowerCase().indexOf(value1) > -1 && filedsName[select].toLowerCase() !== value1) ||
          (filedsName[select].toLowerCase().indexOf(value2) > -1 && filedsName[select].toLowerCase() !== value2) ||
          (filedsName[select].toLowerCase().indexOf(value3) > -1 && filedsName[select].toLowerCase() !== value3)
        ) {
          endArray = filedsName;
          endArray.type = 3;
        }
      }
    }
    return endArray;

  },
  // push顺序 e为input里的value的值
  objectPushArry: function (product, e) {
    var n = [];
    for (var p in product) {
      if (product[p].name || product[p].code) {
        if (this.searchKeyWord(product[p], 'name', e, 'code')) {
          n.push(this.searchKeyWord(product[p], 'name', e, 'code'));
        }
      }
      if (product[p].nickName || product[p].reallyName || product[p].remarkName) {
        if (this.searchKeyWord(product[p], 'nickName', e, 'reallyName', 'remarkName')) {
          n.push(this.searchKeyWord(product[p], 'nickName', e, 'reallyName', 'remarkName'));
        }
      }
    }
    var endArray4 = [];
    var endArray1 = [];
    var endArray2 = [];
    var endArray3 = [];
    var endArray5 = [];
    var endArray6 = [];
    for (var a in n) {
      if (n[a].type == 1) {
        endArray1.push(n[a]);
      }
      if (n[a].type == 2) {
        endArray2.push(n[a]);
      }
      if (n[a].type == 3) {
        if (!n[a].word) {
          endArray3.push(n[a]);
        } else if (n[a].word == 0) {
          endArray5.push(n[a]);
        } else if (n[a].word == 1) {
          endArray6.push(n[a]);
        }
      }
    }
    for (var f in endArray1) {
      endArray4.push(endArray1[f]);
    }

    for (var b in endArray2) {
      endArray4.push(endArray2[b]);
    }

    for (var g in endArray5) {
      endArray4.push(endArray5[g]);
    }

    for (var m in endArray6) {
      endArray4.push(endArray6[m]);
    }

    for (var c in endArray3) {
      endArray4.push(endArray3[c]);
    }
    return endArray4;
  },
  request: function (para) {
    para.url = api.host + para.url ;
    para.oldSuccess = para.success;
    para.method = para.method;
    para.async = para.async;
    para.success = function (data) {
      var dataResponest = data.data;
      if (dataResponest.code === 0) {
        para.oldSuccess(dataResponest);
      } else {
        api.fail(data);
      }
    };
    para.fail = function () {
      api.fail()
    }
    wx.request(para);
  },
  fail: function (res) {
    wx.hideNavigationBarLoading()
    wx.showToast({
      title: res.data.msg,
      mask: true,
      duration: 2000
    })
  },
  // 加价尺码表,商城里面用
  // sizeArray 尺码数据
  // GoodsInfoData 商品详情
  // sizeLists  加价表
  // originalPrice 原始价格
  // colorRaise 颜色加价
  // typeName 价格 在详情里面的名字
  sizeRaiseArray: function (sizeArray, GoodsInfoData, sizeLists, originalPrice, colorRaise, typeName) {
    var sizeRaiseArray = [];
    var average = 0;
    var priceArry = [];
    for (var p in sizeArray) {
      var add = false;
      for (var g in sizeLists) {
        if (sizeArray[p].size == sizeLists[g].name) {
          sizeRaiseArray.push(sizeLists[g].priceRaise);
          add = true;
        }
      };
      if (!add) {
        sizeRaiseArray.push(0)
      }
    }
    // 计算平均値
    for (var j in sizeRaiseArray) {
      var total = parseFloat(sizeRaiseArray[j]) + parseFloat(colorRaise) + parseFloat(originalPrice);
      average += total;
      priceArry.push(total)
    }
    GoodsInfoData[typeName] = (average / sizeArray.length).toFixed(2);
    return {
      sizeRaiseArray: priceArry,
      averagePrice: (average / sizeArray.length).toFixed(2),
      GoodsInfoData: GoodsInfoData
    }
  },
  // 几个权限判断
  authorityPurchaseprice: function () {
    var userIdentity = app.globalData.userIdentity;
    var privilegeEmployees = true;//进货价
    var cusmPrivilege = true;//客户
    var supplierPrivilege = true;//供应商
    var setUp = true;//设置
    var report = true;//报表
    if (userIdentity == 3) {
      privilegeEmployees = false;//进货价
      cusmPrivilege = false;//客户
      supplierPrivilege = false;//供应商
      setUp = false;//设置
      report = false;//报表
      for (var p in app.globalData.privilegeEmployees) {
        if (app.globalData.privilegeEmployees[p].privilegeId == 1) {
          privilegeEmployees = true;
        }
        if (app.globalData.privilegeEmployees[p].privilegeId == 3) {
          cusmPrivilege = true;
        }
        if (app.globalData.privilegeEmployees[p].privilegeId == 2) {
          report = true;
        }
        if (app.globalData.privilegeEmployees[p].privilegeId == 4) {
          setUp = true;
        }
        if (app.globalData.privilegeEmployees[p].privilegeId == 5) {
          supplierPrivilege = true;
        }
      }
    } else if (userIdentity == 2) {
      privilegeEmployees = false;//进货价
      cusmPrivilege = false;//客户
      supplierPrivilege = false;//供应商
      setUp = false;//设置
      report = false;//报表
    }
    return {
      purchasePrivilege: privilegeEmployees,
      cusmPrivilege: cusmPrivilege,
      supplierPrivilege: supplierPrivilege,
      setUp: setUp,
      report: report
    }
  },
}
module.exports = {
  formatTime: formatTime,
  toDate: toDate,
  api:api
}
