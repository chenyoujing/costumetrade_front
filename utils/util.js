var app = getApp();
var pageNum = 1;
var publicProduct = [];
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
  //  + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function toDate(number) {
  var n = number;
  var date = new Date(n);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
}
//请求接口公共方法
var api = {
  host: 'http://192.168.2.221:8088/',
  // 数组转化成字符串
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  DateFormat:function (format) {
    var o = {
      "M+": format.getMonth() + 1, //month
      "d+": format.getDate(), //day
      "h+": format.getHours(), //hour
      "m+": format.getMinutes(), //minute
      "s+": format.getSeconds(), //second
      "q+": Math.floor((format.getMonth() + 3) / 3),//quarter，
      "S": format.getMilliseconds() //毫秒
    };
    format = String(7) + o["M+"]+ o["d+"]+ o["h+"] + o["m+"] + o["s+"] + o["S"];
    console.log(o)
    console.log(o["M+"])
    return format;
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
        storeId: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        app.screen_brandList = res.data.brandList;
        app.screen_productTypeList = res.data.productTypeList;
        app.screen_productSize = res.data.productSize,
        app.screen_gradeList = res.data.gradeList,
        app.screen_unitList = res.data.unitList,
        app.custOrDiscTag = res.data.custOrDiscTag,
        app.custProdPrice = res.data.custProdPrice,
        app.getProductInit = true
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
  //拆分客户，朋友
  unitType:function(product){
    var UnitData1 = [];
    var UnitData2 = [];
    for(var p in product){
      if (product[p].cate!==1){
        UnitData2.push(product[p])
      } else if (product[p].cate !== 2){
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
  downData:function(url2,objectName,timeName){  
    var that = this;
    wx.showNavigationBarLoading();
    console.log(url2)
    var param = {
      storeId: 1,
      pageNum: pageNum
    }
    if (url2=="client/getClients"){
      param = param;
    }else{
      param.fields = "firsthPrice,secondPrice,thirdPrice,fourthPrice,fifthPrice,purchaseprice,tagprice,image,name,code,barcodes,barcode"
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
          publicProduct.push(res.data[p])
        }
        if(res.data.length == 10){
          pageNum = pageNum+1;
          that.downData(url2, objectName, timeName);
        }else{
          wx.hideNavigationBarLoading();
          if (url2 == "client/getClients"){
            that.unitType()
          }else{
            wx.setStorage({
              key: objectName,
              data: publicProduct
            })
          }
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
      }
    })
  },
  // 检测是否该更新数据
  supplierRefresh: function (url,objectName,timeName){
    console.log(timeName)
    var that = this;
    var myDate = new Date();
    wx.getStorage({
      key: timeName,
      complete: function (res) {
        console.log(res)
        if (parseInt((myDate - res.data) / 1000 / 60 / 60) >= 1 || res.data == undefined) {
          that.downData(url, objectName, timeName)
        }
      }
    })
   
  },
  // 智能搜索
  searchKeyWord: function (filedsName, select,value,select2) {
    var endArray = [];
    value = value.toLowerCase();
    if (filedsName[select].toLowerCase() == value || filedsName[select2].toLowerCase() == value) {
      endArray = filedsName;
      endArray.type = 1;
    } else if ((filedsName[select].toLowerCase().indexOf(value) > -1 && filedsName[select].toLowerCase() !== value) || (filedsName[select2].toLowerCase().indexOf(value) > -1 && filedsName[select2].toLowerCase() !== value)) {
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
      if (this.searchKeyWord(product[p],'name', e,'code')) {
        n.push(this.searchKeyWord(product[p],'name', e,'code'));
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
  fail: function () {
    wx.hideNavigationBarLoading()
    wx.showToast({
      title: '无法连接服务器',
      mask: true,
      duration: 2000
    })
  }
}
module.exports = {
  formatTime: formatTime,
  toDate: toDate,
  api:api
}
