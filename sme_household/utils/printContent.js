/**
 * Created by xs on 2017/3/15.
 */
/**
 * modal相关函数
 * @param showapi_userid: 就是用ak请求到的userID，先从本地拿取，没有调用userID方法请求
 * @param deviceNumber：设备编号
 * @param data: 需要处理的汉字（未处理）,
 * @param imgupdata ：为false时 没有图片需要打印，true则相反
 * @param mbImage ： 图片转码成功后的字符串(付款二维码)
 * @param mbImageLogo ： 图片转码成功后的字符串(LOGO)
 */
var util = require('./util.js')
var app = getApp()
var mydate = new Date();
var printObject = {
    showapi_userid : "",
    deviceNumber:"",
    data:null,
    imgupdata:"",
    mbImage: '',
    getBmimgage: function (stringSend) {
      printObject.data = stringSend
      var that = this;
      wx.getStorage({
        key: 'mbImage',
        success: function(res) {
           printObject.mbImage = res.data
        },
      })
      wx.getStorage({
        key: 'imgupdata',
        success: function (res) {
          printObject.imgupdata = res.data
        }
      })
      wx.getStorage({
        key: 'showapi_userid',
        success: function (res) {
          that.showapi_userid = res.data;
          that.refresh(stringSend);
        }
      })
      
    },
    // data 要打印的数据
    refresh:function (data) {
      printObject.data = data;
      console.log(printObject.deviceNumber);
      var that = this;
      wx.getStorage({
        key: 'showapi_userid',
        success: function (res) {
          console.log(res.data)
          printObject.showapi_userid = res.data;
          that.endSendGbk(data)
        }
      })
    },
    //我们自己的接口 汉字图片转成gbk
    endSendGbk:function (data) {
        var th = this;
        util.api.request({
          url: 'print/gbk',
          data: {
            text:data
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideNavigationBarLoading();
            if (!th.imgupdata) {
              printObject.printcontent('T:' + res.data, printObject.showapi_userid);
              console.log(5555)
            }else if (th.imgupdata) {
              printObject.printcontent('T:' + res.data + '|P:' + printObject.mbImage, printObject.showapi_userid);
            } 
            wx.showToast({
              title: "打印中，请稍等",
              mask: true,
              duration: 1000
            })
          }
        })
      
    },
    //最后的打印，咕咕机的接口，ak一定要传，是固定值
    printcontent:function (content,showapi_userid) {
      var url = 'http://open.memobird.cn/home/printpaper?ak=2ee8fdef2aff4871be0b45c824772c52&timestamp=' + util.formatTime(mydate) +'&memobirdID='+ printObject.deviceNumber+'&userID='+showapi_userid;
      wx.request({
        url: url,
        data: {
          printcontent: content
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {}
      })
    },
    // 咕咕机打印机
    guguPrint: function (deviceNumber){
      var that = this;
      util.api.request({
        url: 'printer/savePrinter',
        data: {
          printid: deviceNumber,
          storeid: app.globalData.storeId,
          isprintcode:"",
          isprintlogo:"",
          printType:1
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          wx.setStorage({
            key: 'showapi_userid',
            data: res.data.printUserId
          })
          printObject.showapi_userid = res.data.printUserId;
        }
      })
    }
};
module.exports = printObject;