var app = getApp();
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
    wx.showNavigationBarLoading()
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
        app.screen_content1 = res.data.brandList;
        app.screen_content2 = res.data.productTypeList;
        app.screen_content3 = that.data.screen_content3;
        app.screen_content4 = that.data.screen_content4;
        app.screen_content5 = res.data.productSize,
        app.screen_content6 = res.data.priceNameList,
        app.getProductInit = ture
        
      }
    })
  },
  request: function (para) {
    para.url = api.host + para.url ;
    para.oldSuccess = para.success;
    para.method = para.method;
    para.success = function (data) {
      var dataResponest = data.data;
      if (dataResponest.code === 0) {
        console.log(dataResponest)
        para.oldSuccess(dataResponest);
      } else {
        api.fail(data);
      }
    };
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
