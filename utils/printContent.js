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
    imgupdataLogo: "",
    mbImage: '',
    mbImageLogo:'',
    getBmimgage:function () {
      var that = this;
      wx.getStorage({
        key: 'mbImage',
        success: function(res) {
          that.setData({
            mbImage:res.data
          })
        },
      })
      wx.getStorage({
        key: 'mbImageLogo',
        success: function (res) {
          that.setData({
            mbImageLogo: res.data
          })
        },
      })
      wx.getStorage({
        key: 'imgupdataLogo',
        success: function (res) {
          that.setData({
            imgupdataLogo: res.data
          })
        },
      })
      wx.getStorage({
        key: 'imgupdata',
        success: function (res) {
         that.setData({
           imgupdata: res.data
          })
        }
      })
      wx.getStorage({
        key: 'showapi_userid',
        success: function (res) {
          that.setData({
            showapi_userid: res.data
          })
        }
      })
      wx.getStorage({
        key: 'deviceNumber',
        success: function (res) {
          that.setData({
            deviceNumber: res.data
          })
        }
      })
    },
    // data 要打印的数据
    refresh:function (data) {
        this.data = data
        if(!this.deviceNumber){
          printObject.layerDe('data')
        }else if(!printObject.showapi_userid){
          printObject.userID('data');
        }
        else {
          this.endSendGbk(data)
        }
    },
    // 向我们自己的接口请求userID，成功之后存到本地
    userID:function (type) {
      var that = this;
      util.api.request({
        url: 'print/getPrintUserId',
        data: {
          printid: printObject.deviceNumber,
          storeId: app.globalData.storeId,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          wx.setStorage({
            key: 'showapi_userid',
            data: res.data.mbUser
          })
          printObject.showapi_userid = res.data.mbUser;
          if (type == 'img') {
            printObject.updataimg(res.data.mbUser, printObject.deviceNumber, umll);
          } else if (type == 'data'){
            printObject.endSendGbk(printObject.data)
          }
        }
      })
    },
    //我们自己的接口 汉字图片转成gbk
    endSendGbk:function (data) {
        var th = this;
        util.api.request({
          url: 'print/gbk',
          data: {
            image:"",
            text:""
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideNavigationBarLoading();
            console.log(th.imgupdata == 'true')
            console.log(th.imgupdataLogo == 'true')
            if (th.imgupdata == 'false' && th.imgupdataLogo == 'false') {
              printObject.printcontent('T:' + data, printObject.showapi_userid);
            } else if (th.imgupdata == 'false' && th.imgupdataLogo == 'true') {
              printObject.printcontent('P:' +printObject.mbImageLogo + '|T:' + data, printObject.showapi_userid);
            } else if (th.imgupdata == 'true' && th.imgupdataLogo == 'false') {
              printObject.printcontent('T:' + data + '|P:' + printObject.mbImage, printObject.showapi_userid);
            } else {
              printObject.printcontent('P:' + printObject.mbImageLogo + '|T:' + data + '|P:' + printObject.mbImage, printObject.showapi_userid);
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
    //上传图片给后台
    updataimg:function(mbuser,mbid,idName)
    {
        var th =this;
        var updData = new FormData();
        updData.append('file', $(idName)[0].files[0]);
        var url = window.api.host + 'api/v1/print/memobird?mbid='+mbid+'&mbuser='+mbuser+'&app_key=' + $.cookie("app_key");
        $.ajax({
            url: url,
            type: 'POST',
            data: updData ,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if(data.status == 0){
                    if(idName == "#inputfile"){
                        th.mbImage = data.value.mbImage;
                        localforage.setItem('mbImage',data.value.mbImage,null);
                        console.log(th.mbImage)
                        $('.imgupdata').text('已上传');
                    }else if(idName == "#logofile"){
                        th.mbImageLogo = data.value.mbImage;
                        console.log(th.mbImageLogo)
                      localforage.setItem('mbImageLogo',data.value.mbImage,null);
                        $('.logodata').text('已上传');
                    }
                   

                }else if(data.status == 1){
                    layer.open({
                        content: '图片太宽，请重新上传！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }

            }
        });
    },
    // type 是”img“指的是图片，data指的是文本
    layerDe: function (type, deviceNumber){
        var th = this;
       wx.setStorage({
         key: 'deviceNumber',
         data: deviceNumber,
       })
        printObject.deviceNumber = deviceNumber;
        if (!printObject.showapi_userid){
          th.userID(null);
        }
        // if (type == 'img') {
        //   if (!printObject.showapi_userid) {
        //     th.userID('img');
        //   } else {
        //     th.updataimg(printObject.showapi_userid, deviceNumber);
        //   }
        // } else {
        //   if (!printObject.showapi_userid) {
        //     printObject.userID('data');
        //   } else {
        //     printObject.endSendGbk(printObject.data);
        //   }
        // }
    }
};
module.exports = printObject;