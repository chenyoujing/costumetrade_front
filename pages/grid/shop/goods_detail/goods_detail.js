Page({
  data: {
    height: "",
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      '',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    infoid: "0",
    modal: "none",
    modal_opacity: "",
    modal_top: "100%",
    modal_bottom: "-100%",
    size: "1",
    sizes: "1",
    color: "1",
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
  },
  detail_info: function (e) {
    let data = e.target.dataset
    this.setData({
      infoid: data.infoid
    })
  },
  detail_info_swiper: function (e) {
    this.setData({
      infoid: e.detail.current
    })
  },
  join: function (e) {
    var that = this
    let data = e.target.dataset
    wx.request({
      url: 'http://192.168.2.221:8088/product/takingStock',
      data: {
        storeId: data.storeid,
        id: data.id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          product_upload: res.data.data,
        })
      }
    })
    this.setData({
      modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      modal_opacity: animation.export(),
      modal_top: "100px",
      modal_bottom: "0",
    })
  },
  modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      modal_opacity: animation.export(),
      modal_top: "100%",
      modal_bottom: "-100%",
    })
    setTimeout(() => {
      this.setData({
        modal: "none",
      })
    }, 300)
  },
  sizes_checked: function (e) {
    let data = e.target.dataset
    this.setData({
      sizes: data.sizes,
    })
  },
  color_checked: function (e) {
    let data = e.target.dataset
    this.setData({
      color: data.color,
    })
  },
  size_checked: function (e) {
    let data = e.target.dataset
    this.setData({
      size: data.size,
    })
  },
})