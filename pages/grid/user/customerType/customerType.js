// pages/grid/user/customerType/customerType.js
Page({
  data: {
  
  },

  // 更改启用的客户种类
  cusgradeChange: function (e) {
    var name = e.target.dataset.name;
    var product = this.data[name];
    var submitData = this.data.submitData;
    var param = {};
    if (name == "customerCusts") {
      product[this.data.customerIndex].prodgrade = e.detail.value + 1;
      console.log(e.detail.value)
      console.log(e.detail.value)
      submitData[name] = product;
      param[name] = product;
      param.submitData = submitData;
    } else {
      param[name] = e.detail.value + 1;
    }

    this.setData(param);
  },

  onLoad:function(e){
    this.setData({
      cusgradeChange: app.cusgradeChange,
      customerIndex: e.index,
    })
  }
})