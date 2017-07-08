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

var   mydate = new Date();
var printObject = {
    showapi_userid : localStorage.getItem('showapi_userid'),
    deviceNumber:localStorage.getItem('deviceNumber'),
    data:null,
    imgupdata:localStorage.getItem('imgupdata')?localStorage.getItem('imgupdata'):true,
    imgupdataLogo:localStorage.getItem('imgupdataLogo')?localStorage.getItem('imgupdataLogo'):true,
    mbImage: '',
    mbImageLogo:'',
    getBmimgage:function () {
      var that = this;
      wx.getStorage({
        key: 'mbImage',
        success: function(res) {
          that.mbImage = res.data;
        },
      })
      wx.getStorage({
        key: 'mbImageLogo',
        success: function (res) {
          that.mbImageLogo = res.data;
        },
      })
    },
    refresh:function (data) {
        var sel = $('#printInner').html();
        this.data = data;
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
        window.api.request({
            url: 'api/v1/print/memobird?mbid='+window.printObject.deviceNumber,
            type:'post',
            success: function (data)
            {
                localStorage.setItem('showapi_userid',data.mbUser);
                window.printObject.showapi_userid = data.mbUser;
                if(type=='img'){
                    printObject.updataimg(data.mbUser,window.printObject.deviceNumber,umll);
                }else{
                    printObject.endSendGbk(window.printObject.data)

                }

            }
        });
    },
    //我们自己的接口 汉字图片转成gbk
    endSendGbk:function (data) {
        var th = this;
        window.api.request({
            url: '/api/v1/print/gbk',
            type:'post',
            dataType:"JSON",
            contentType:'application/json',
            data:JSON.stringify(data),
            success: function (data)
            {
                console.log(th.imgupdata == 'true')
                console.log(th.imgupdataLogo == 'true')
                if(th.imgupdata == 'false'&& th.imgupdataLogo == 'false'){
                    window.printObject.printcontent('T:'+data,window.printObject.showapi_userid);
                }else if(th.imgupdata == 'false'&& th.imgupdataLogo == 'true')
                {
                    window.printObject.printcontent('P:'+window.printObject.mbImageLogo+'|T:'+data,window.printObject.showapi_userid);
                }else if(th.imgupdata == 'true'&& th.imgupdataLogo == 'false'){
                    window.printObject.printcontent('T:'+data+'|P:'+window.printObject.mbImage,window.printObject.showapi_userid);
                }else {
                    window.printObject.printcontent('P:'+window.printObject.mbImageLogo+'|T:'+data+'|P:'+window.printObject.mbImage,window.printObject.showapi_userid);
                }
                layer.open({
                    content: '打印中，请稍等'
                    ,skin: 'msg'
                    ,time: 5 //2秒后自动关闭
                });
            }
        });
    },
    //最后的打印，咕咕机的接口，ak一定要传，是固定值
    printcontent:function (content,showapi_userid) {
        var url = 'http://open.memobird.cn/home/printpaper?ak=2ee8fdef2aff4871be0b45c824772c52&timestamp='+mydate.format("yyyy-MM-dd hh:mm:ss") +'&memobirdID='+window.printObject.deviceNumber+'&userID='+showapi_userid;
        $.ajax({
            url:url ,
            type: 'post',
            data:{
                printcontent: content
            },
            success: function (data) {

            }
        });
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
    layerDe:function(type){
        var th = this;
        var sel = $('#printInner').html();
        layer.open({
            content: sel
            ,btn: ['确定', '取消']
            ,title: [
                '请输入打印机的设备编号(双击设备吐出来的设备编号)',
                'background-color: #78cde5;margin:0;color: #fff;font-size:12px'
            ]
            ,yes: function(index){
                var deviceNumber = $('.printNumber').val();
                localStorage.setItem('deviceNumber',deviceNumber);
                window.printObject.deviceNumber =deviceNumber;
              if(type =='img'){
                  if(!localStorage.getItem('showapi_userid')){
                    th.userID('img');
                  }else{
                    th.updataimg(window.printObject.showapi_userid,deviceNumber);
                  }
              }else{
                  if(!printObject.showapi_userid){
                      printObject.userID('data');
                  }else {
                      printObject.endSendGbk(printObject.data);
                  }

              }
                layer.close(index);
            }
        });
    }
};
printObject.getBmimgage();