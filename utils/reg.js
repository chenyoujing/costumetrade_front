var reg = {
  //正则验证手机号
  phone: function (mobilPhone){
    var boolean = true;
    if (mobilPhone !== '' && (!/^(13[0-9]|15[012356789]|17[012356789]|18[0-9]|14[57])[0-9]{8}$/.test(mobilPhone))) {
      wx.showToast({
        title: "出错了",
        icon: 'tips',
        duration: 1000
      })
      boolean = false;
    }
    return boolean;
  },
  //正则验证电话
  tellphone: function (phone) {
    var boolean = true;
    if (phone !== '' && (!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(phone))) {
      wx.showToast({
        title: "出错了",
        // icon: 'tips',
        duration: 1000
      })
      boolean = false;
    }
    return boolean;
  },
  //正则验证输入框不能为空
  iSnull: function (name) {
     var boolean = true;
    if (name == '' || name.length >= 100) {
       wx.showToast({
         title: "出错了",
        //  icon: 'tips',
         duration: 1000
       })
       boolean = false;
     }
     return boolean;
  },
  //正则验证是否有中文
  iSChinese: function (temp) {
    var boolean = true;
    var re = /[^\u4e00-\u9fa5]/;
    console.log(re.test(temp))
    if (!re.test(temp)){
      wx.showToast({
        title: "出错了",
        //  icon: 'tips',
        duration: 1000
      })
      boolean = false;
    }
    return boolean;  
  },
  //正则验证销售价是否存在一个
  iSsale: function (saleprice) {
    var boolean = true;
    if (saleprice[0].price <= 0 && saleprice[1].price <= 0 && saleprice[2].price <= 0 && saleprice[3].price <= 0 && saleprice[4].price <= 0 ){
      wx.showToast({
        title: "至少输入一个价格",
        duration: 1000
      })
      boolean = false;
    }
    return boolean;
  }
}
module.exports = reg;