//index.js
//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    id: "",
    scroll_height: "",
    product: "",
    upload: "100%",
    updata_name: "",
    updata_code: "",
    updata_handcount: "",
    producttype: ["无法连接数据库"],
    producttype_index: 0,
    brand: ["无法连接数据库"],
    brand_index: 0,
    unit: ["无法连接数据库"],
    unit_index: 0,
    color: "",
    size: "",
    year: "",
    warnLow: "",
    warnHigh: "",
    grade: ["一级", "二级", "三级", "四级", "五级", "六级"],
    grade_index: 0,
    items: [
      { name: 'SEASON_SPRING', value: '春' },
      { name: 'SEASON_SUMMER', value: '夏' },
      { name: 'SEASON_AUTUMN', value: '秋' },
      { name: 'SEASON_WINTER', value: '冬' },
    ],
    date_up: "",
    date_down: "-",
    condition: "100%",
    screen: "",
    screen_classify: "",
    screen_content: "",
    screen_content1: [
      { catename: 'T恤'},
      { catename: '休闲裤'},
      { catename: '连衣裙'},
      { catename: '卫衣'},
    ],
    screen_content2: [
      { brandname: 'Armani'},
      { brandname: 'Burberry'},
      { brandname: 'Calvin Klein'},
      { brandname: 'Chanel'},
    ],
    screen_content3: [
      { name: 'SEASON_SPRING', value: '春' },
      { name: 'SEASON_SUMMER', value: '夏' },
      { name: 'SEASON_AUTUMN', value: '秋' },
      { name: 'SEASON_WINTER', value: '冬' },
    ],
    screen_content4: [
      { name: '0', value: '正常'},
      { name: '1', value: '待处理' },
      { name: '2', value: '报废' },
    ],
    screen_content_height: "-270px",
    screen_display: "none",
    screen_opacity: "",

    modal: "none",
    modal_opacity: "",
    producttype_modal: "none",
    producttype_modal_opacity: "",
    brand_modal: "none",
    brand_modal_opacity: "",
    image_add_modal: "none",
    image_add_modal_opacity: "",
    image_search_modal: "none",
    image_search_modal_opacity: "",
    color_modal: "none",
    color_modal_opacity: "",
    size_modal: "none",
    size_modal_opacity: "",
    stock_list: [
      { "code": "01", "text": "text1", "type": "type1" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "03", "text": "text3", "type": "type3" },
      { "code": "04", "text": "text4", "type": "type4" },
      { "code": "05", "text": "text5", "type": "type5" },
      { "code": "06", "text": "text6", "type": "type6" },
      { "code": "07", "text": "text7", "type": "type7" }
    ],
    sort: "timeUpOp",
    sortop: "",
    product_upload: "",
    more_function: "none",
    more_function_opacity: "",
  },
  onLoad: function () {
    var that = this
    var date = new Date(Date.now());
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scroll_height: res.windowHeight - 95
        })
      }
    })
    this.setData({
      date_up: util.formatTime(new Date),
      year: date.getFullYear(),
    })
    wx.showNavigationBarLoading()
    wx.request({
      url: 'http://192.168.2.221:8088/product/getProductInit',
      data: {
        storeId: 1,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        var producttype = []
        var brand = []
        for (var i = 0; i < res.data.data.productTypeList.length; i++) {
          producttype.push(res.data.data.productTypeList[i].catename)
        } 
        for (var i = 0; i < res.data.data.brandList.length; i++) {
          brand.push(res.data.data.brandList[i].brandname)
        } 
        that.setData({
          screen_content1: res.data.data.productTypeList,
          screen_content2: res.data.data.brandList,
          producttype: producttype,
          brand: brand,
          unit: res.data.data.unitList,
          size: res.data.data.productSize,
        })
      },
      fail: function () {
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '无法连接服务器',
          mask: true,
          duration: 2000
        })
      }
    })
    wx.request({
      url: 'http://192.168.2.221:8088/size/getAllSizes',
      data: {
        storeId: 1,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          color: res.data.data
        })
      }
    })
    wx.request({
      url: 'http://192.168.2.221:8088/product/getProducts',
      data: {
        storeId: 1,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
        } 
        that.setData({
          product: res.data.data
        })
      }
    })
  },
  //上架时间排序
  timeUpOp: function (e) {
    var that = this
    let data = e.target.dataset
    if (data.sort != "timeUpOp") {
      that.setData({
        sort: "timeUpOp",
      })
      wx.request({
        url: 'http://192.168.2.221:8088/product/getProducts',
        data: {
          timeUpOp: 'desc',
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
          }
          that.setData({
            product: res.data.data,
            sortop: "desc"
          })
        }
      })
    } else {
      if (data.sortop == "desc") {
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            timeUpOp: 'asc',
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            that.setData({
              product: res.data.data,
              sortop: "asc"
            })
          }
        })
      } else {
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            timeUpOp: 'desc',
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            that.setData({
              product: res.data.data,
              sortop: "desc"
            })
          }
        })
      }
    }

  },
  //价格排序
  priceOp: function (e) {
    var that = this
    let data = e.target.dataset
    if (data.sort != "priceOp") {
      that.setData({
        sort: "priceOp",
      })
      wx.request({
        url: 'http://192.168.2.221:8088/product/getProducts',
        data: {
          priceOp: 'desc',
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
          }
          that.setData({
            product: res.data.data,
            sortop: "desc"
          })
        }
      })
    }else{
      if (data.sortop == "desc") {
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            priceOp: 'asc',
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            that.setData({
              product: res.data.data,
              sortop: "asc"
            })
          }
        })
      }else{
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            priceOp: 'desc',
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            that.setData({
              product: res.data.data,
              sortop: "desc"
            })
          }
        })
      }
    }
  },
  //销量排序
  saleOp: function (e) {
    var that = this
    let data = e.target.dataset
    if (data.sort != "saleOp") {
      that.setData({
        sort: "saleOp",
      })
      wx.request({
        url: 'http://192.168.2.221:8088/product/getProducts',
        data: {
          saleOp: 'desc',
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
          }
          that.setData({
            product: res.data.data,
            sortop: "desc"
          })
        }
      })
    } else {
      if (data.sortop == "desc") {
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            saleOp: 'asc',
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            that.setData({
              product: res.data.data,
              sortop: "asc"
            })
          }
        })
      } else {
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            saleOp: 'desc',
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            that.setData({
              product: res.data.data,
              sortop: "desc"
            })
          }
        })
      }
    }

  },
  more: function () {
    this.setData({
      condition: "0"
    })
  },
  back: function () {
    this.setData({
      condition: "100%",
      screen: "",
      screen_content_height: "-270px",
    })
    this.setData({
      screen_opacity: util.opacity(0),
    })
    setTimeout(() => {
      this.setData({
        screen_display: "none",
      })
    }, 300)

  },
  //筛选
  screen: function (e) {
    var that = this
    let data = e.target.dataset
    if (this.data.screen == data.name){
      this.setData({
        screen: ""
      })
      if (this.data.screen_content_height == "-270px") {
        that.setData({
          screen_content_height: "30px",
        })
      } else {
        that.setData({
          screen_opacity: util.opacity(1),
          screen: "",
          screen_content_height: "-270px",
        })
        setTimeout(() => {
          that.setData({
            screen_display: "none",
          })
        }, 300)
      }
    }else{
      this.setData({
        screen: data.name,
        screen_content_height: "30px",
      })
    }
    if (data.name == "classify") {
      that.setData({
        screen_content: [
          { name: 'USA', value: 'T恤' },
          { name: 'CHN', value: '休闲裤' },
          { name: 'BRA', value: '半身裙' },
          { name: 'JPN', value: '卫衣' },
        ]
      })
    }
    if (data.name == "brand") {
      that.setData({
        screen_content: [
          { name: 'USA', value: 'Armani' },
          { name: 'CHN', value: 'Burberry' },
          { name: 'BRA', value: 'Calvin Klein' },
          { name: 'JPN', value: 'Chanel' },
        ]
      })
    }
    if (data.name == "season") {
      that.setData({
        screen_content: [
          { name: 'USA', value: '春' },
          { name: 'CHN', value: '夏' },
          { name: 'BRA', value: '秋' },
          { name: 'JPN', value: '冬' },
        ]
      })
    }
    if (data.name == "state") {
      that.setData({
        screen_content: [
          { name: 'USA', value: '正常' },
          { name: 'CHN', value: '重置' },
        ]
      })
    }
    this.setData({
      screen_display: "block",
    })
    this.setData({
      screen_opacity: util.opacity(1)
    })
  },
  screen_close: function () {
    this.setData({
      screen_opacity: util.opacity(0),
      screen: "",
      screen_content_height: "-270px",
    })
    setTimeout(() => {
      this.setData({
        screen_display: "none",
      })
    }, 300)

  },
  //盘点库存
  stock: function (e) {
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
    this.setData({
      modal_opacity: util.opacity(1)
    })
  },
  modal_close: function () {
    this.setData({
      modal_opacity: util.opacity(0)
    })
    setTimeout(() => {
      this.setData({
        modal: "none",
      })
    }, 300)
  },
  //打开货品详情
  upload: function (e) {
    var that = this
    let data = e.target.dataset
    if (data.id) {
      wx.request({
        url: 'http://192.168.2.221:8088/product/getProductInit',
        data: {
          storeId: 1,
          id: data.id,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            id: res.data.data.id,
            updata_name: res.data.data.name,
            updata_code: res.data.data.code,
            updata_wholeprice: res.data.data.wholeprice,
            updata_packprice: res.data.data.packprice,
            updata_retailprice: res.data.data.retailprice,
            updata_purchaseprice: res.data.data.purchaseprice,
            updata_tagprice: res.data.data.tagprice,
            updata_handcount: res.data.data.handcount,
            year: res.data.data.year,
            season: res.data.data.season,
            warnHigh: res.data.data.warnHigh,
            warnLow: res.data.data.warnLow,
          })
        }
      })
    }else{
      var date = new Date(Date.now());

      that.setData({
        id: "",
        updata_name: "",
        updata_code: "",
        updata_wholeprice: "",
        updata_packprice: "",
        updata_retailprice: "",
        updata_purchaseprice: "",
        updata_tagprice: "",
        updata_handcount: "",
        date_up: util.formatTime(new Date),
        date_down: util.formatTime(new Date(Date.now() + 31536000000)),
        year: date.getFullYear(),
        season: "",
        warnHigh: "",
        warnLow: "",
      })
    }
    this.setData({
      upload: "0"
    })
  },
  producttype: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      producttype_modal: "block",
    })
    this.setData({
      producttype_modal_opacity: util.opacity(1)
    })
  },
  producttype_modal_close: function () {
    this.setData({
      producttype_modal_opacity: util.opacity(0)
    })
    setTimeout(() => {
      this.setData({
        producttype_modal: "none",
      })
    }, 300)
  },
  //添加种类
  producttype_add: function (e) {
    var that = this
    if (e.detail.value.catename) {
      wx.request({
        url: 'http://192.168.2.221:8088/cate/saveCate',
        data: {
          storeId: 1,
          catename: e.detail.value.catename,
          fastcode: e.detail.value.fastcode,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    } else {
      wx.showToast({
        title: '种类不能为空',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  product_radio: function (e) {
    this.setData({
      product_radio: e.detail.value
    })
  },
  //删除种类
  // product_delete: function () {
  //   var that = this
  //   wx.request({
  //     url: 'http://192.168.2.221:8088/cate/deleteCate',
  //     data: {
  //       id: that.data.product_radio,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function(res) {
  //       console.log('删除种类')
  //     }
  //   })
  //   wx.request({
  //     url: 'http://192.168.2.221:8088/product/getProductInit',
  //     data: {
  //       storeId: 1,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       var producttype = []
  //       for (var i = 0; i < res.data.data.productTypeList.length; i++) {
  //         producttype.push(res.data.data.productTypeList[i].catename)
  //       }
  //       that.setData({
  //         screen_content1: res.data.data.productTypeList,
  //         producttype: producttype,
  //       })
  //     }
  //   })
  // },
  brand: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      brand_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      brand_modal_opacity: animation.export()
    })
  },
  brand_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      brand_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        brand_modal: "none",
      })
    }, 300)
  },
  //添加品牌
  brand_add: function (e) {
    var that = this
    if (e.detail.value.brandname){
      wx.request({
        url: 'http://192.168.2.221:8088/brand/saveBrand',
        data: {
          storeId: 1,
          brandname: e.detail.value.brandname,
          fastcode: e.detail.value.fastcode,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    }else{
      wx.showToast({
        title: '品牌名称不能为空',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  brand_radio: function (e) {
    this.setData({
      brand_radio: e.detail.value
    })
  },
  //删除品牌
  // brand_delete: function () {
  //   var that = this
  //   wx.request({
  //     url: 'http://192.168.2.221:8088/brand/getAllBrands',
  //     data: {
  //       id: that.data.brand_radio,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function(res) {
  //       console.log('删除品牌')
  //     }
  //   })
  //   wx.request({
  //     url: 'http://192.168.2.221:8088/product/getProductInit',
  //     data: {
  //       storeId: 1,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       var brand = []
  //       for (var i = 0; i < res.data.data.brandList.length; i++) {
  //         brand.push(res.data.data.brandList[i].brandname)
  //       }
  //       that.setData({
  //         screen_content2: res.data.data.brandList,
  //         brand: brand,
  //       })
  //     }
  //   })
  // },
  //添加颜色
  color_add: function (e) {
    var that = this
    if (e.detail.value.colorname) {
      wx.request({
        url: 'http://192.168.2.221:8088/color/saveColor',
        data: {
          storeId: 1,
          colorname: e.detail.value.colorname,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    } else {
      wx.showToast({
        title: '颜色名称不能为空',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  color: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      color_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      color_modal_opacity: animation.export()
    })
  },
  image_add: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      image_add_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      image_add_modal_opacity: animation.export()
    })
  },
  image_add_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      image_add_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        image_add_modal: "none",
      })
    }, 300)
  },
  image_search: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      image_search_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      image_search_modal_opacity: animation.export()
    })
  },
  image_search_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      image_search_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        image_search_modal: "none",
      })
    }, 300)
  },
  color_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      color_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        color_modal: "none",
      })
    }, 300)
  },
  size: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      size_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      size_modal_opacity: animation.export()
    })
  },
  size_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      size_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        size_modal: "none",
      })
    }, 300)
  },
  //关闭货品详情
  close: function () {
    this.setData({
      upload: "100%"
    })
  },
  //上传货品详情
  upload_submit: function (e) {
    var that = this
    let data = e.target.dataset
    var info = e.detail.value
    var gradelist = ["GRADE_ONE", "GRADE_TWO", "GRADE_THREE", "GRADE_FOUR", "GRADE_FIVE", "GRADE_SIX"]
      wx.request({
        url: 'http://192.168.2.221:8088/product/saveProduct',
        data: {
          storeId: 1,
          code: info.code,
          timeUp: Date.parse(new Date(info.timeUp)),
          timeDown: Date.parse(new Date(info.timeDown)),
          producttype: that.data.screen_content1[that.data.producttype_index].id,
          brandid: that.data.screen_content2[that.data.brand_index].id,
          season: info.season,
          name: info.name0,
          fastcode: "",
          barcode: "",
          grade: gradelist[info.grade],
          colors: "",
          sizes: "",
          handcount: info.handcount,
          year: info.year,
          barcodes: "",
          warnLow: info.warnLow,
          warnHigh: info.warnHigh,
          purchaseprice: info.purchaseprice,
          tagprice: info.tagprice,
          wholeprice: info.wholeprice,
          packprice: info.packprice,
          retailprice: info.retailprice,
          createTime: Date.parse(new Date()),
          createBy: '1',
          fileList: [],
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log("上传成功")
          console.log(res)
        }
      })
    console.log(e.detail.value)
    console.log(e.detail.value.name0)//名称
    console.log(e.detail.value.code)//货号
    console.log(e.detail.value.wholeprice)//第一单价
    console.log(e.detail.value.packprice)//第二单价
    console.log(e.detail.value.retailprice)//第三单价
    console.log(e.detail.value.purchaseprice)//进货价
    console.log(e.detail.value.tagprice)//吊牌价
    console.log(this.data.screen_content1[this.data.producttype_index].id)//商品种类
    console.log(this.data.screen_content2[this.data.brand_index].id)//商品品牌
    //图片
    console.log(e.detail.value.unit)//单位
    //颜色
    //尺码
    //主条码
    //分条码
    console.log(e.detail.value.year)//年份
    console.log(gradelist[info.grade])//等级
    console.log(e.detail.value.handcount)//一手件数
    console.log(e.detail.value.season)//季节
    console.log(e.detail.value.warnLow)//预警下线
    console.log(e.detail.value.warnHigh)//预警上线
    var timestamp2 = Date.parse(new Date(e.detail.value.timeUp));
    console.log(Date.parse(new Date(e.detail.value.timeUp)))//上架时间
    console.log(Date.parse(new Date(e.detail.value.timeDown)))//下架时间
    if (!e.detail.value.code) {
      wx.showToast({
        title: '货号不可为空',
        mask: true,
        duration: 1000
      })
    }
    if (!e.detail.value.name0) {
      wx.showToast({
        title: '名称不可为空',
        mask: true,
        duration: 1000
      })
    }
    if (!this.data.screen_content1[this.data.producttype_index].id) {
      wx.showToast({
        title: '连接服务器失败',
        mask: true,
        duration: 1000
      })
    }
    if (!this.data.screen_content2[this.data.brand_index].id) {
      wx.showToast({
        title: '连接服务器失败',
        mask: true,
        duration: 1000
      })
    }
    if (!e.detail.value.timeUp) {
      wx.showToast({
        title: '上架时间不可为空',
        mask: true,
        duration: 1000
      })
    }
    if (!e.detail.value.timeDown) {
      wx.showToast({
        title: '下架时间不可为空',
        mask: true,
        duration: 1000
      })
    }
  },
  brandPicker: function (e) {
    this.setData({
      brand_index: e.detail.value
    })
  },
  producttypePicker: function (e) {
    this.setData({
      producttype_index: e.detail.value
    })
  },
  unitPicker: function (e) {
    this.setData({
      unit_index: e.detail.value
    })
  },
  gradePicker: function (e) {
    this.setData({
      grade_index: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    var that = this
    let data = e.target.dataset
    console.log(e.detail.value)
      that.setData({
        index: e.detail.value
      })
  },
  //年份
  year: function (e) {
    const val = e.detail.value
    this.setData({
      year: val
    })
  },
  //上架时间
  bindDateChange_up: function (e) {
    const val = e.detail.value
    this.setData({
      date_up: val
    })
  },
  //下架时间
  bindDateChange_down: function (e) {
    const val = e.detail.value
    this.setData({
      date_down: val
    })
  },
  //搜索货号
  search: function (e) {
    var that = this
    if (e.detail.value.search) {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      })
      animation.opacity(0).step()
      setTimeout(() => {
        that.setData({
          screen_display: "none",
        })
      }, 300)
      this.setData({
        condition: "100%",
        screen: "",
        screen_content_height: "-270px",
        sort: "",
        sortop: "",
        screen_opacity: animation.export(),
      })
      wx.request({
        url: 'http://192.168.2.221:8088/product/getProducts',
        data: {
          code: e.detail.value.search,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
          }
          var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease',
          })
          animation.opacity(0).step()
          that.setData({
            product: res.data.data,
            screen_opacity: animation.export(),
          })
          setTimeout(() => {
            that.setData({
              screen_display: "none",
            })
          }, 300)
        }
      })
    }
  },
  screen_submit: function (e) {
    var that = this
    let data = e.target.dataset
    var screen = e.detail.value.screen
    if (screen) {
      if (data.screen == "classify") {
        var classify = ""
        for (var key in screen) {
          if (key == 0) {
            classify += screen[key]
          } else {
            classify += "," + screen[key]
          }
        }
        that.setData({
          screen_classify: classify
        })
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            productTypeArray: classify,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            var animation = wx.createAnimation({
              duration: 300,
              timingFunction: 'ease',
            })
            animation.opacity(0).step()
            setTimeout(() => {
              that.setData({
                screen_display: "none",
              })
            }, 300)
            that.setData({
              product: res.data.data,
              sort: "",
              sortop: "",
              screen: "",
              screen_opacity: animation.export(),
            })
          }
        })
      }
      if (data.screen == "brand") {
        var brand = ""
        for (var key in screen) {
          if (key == 0) {
            brand += screen[key]
          } else {
            brand += "," + screen[key]
          }
        }
        that.setData({
          screen_brand: brand
        })
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            productBrandArray: brand,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            var animation = wx.createAnimation({
              duration: 300,
              timingFunction: 'ease',
            })
            animation.opacity(0).step()
            setTimeout(() => {
              that.setData({
                screen_display: "none",
              })
            }, 300)
            that.setData({
              product: res.data.data,
              sort: "",
              sortop: "",
              screen: "",
              screen_opacity: animation.export(),
            })
          }
        })
      }
      if (data.screen == "season") {
        var season = ""
        for (var key in screen) {
          if (key == 0) {
            season += screen[key]
          } else {
            season += "," + screen[key]
          }
        }
        that.setData({
          screen_season: season
        })
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            productSeasonArray: season,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            var animation = wx.createAnimation({
              duration: 300,
              timingFunction: 'ease',
            })
            animation.opacity(0).step()
            setTimeout(() => {
              that.setData({
                screen_display: "none",
              })
            }, 300)
            that.setData({
              product: res.data.data,
              sort: "",
              sortop: "",
              screen: "",
              screen_opacity: animation.export(),
            })
          }
        })
      }
      if (data.screen == "state") {
        var state = ""
        for (var key in screen) {
          if (key == 0) {
            state += screen[key]
          } else {
            state += "," + screen[key]
          }
        }
        that.setData({
          screen_state: state
        })
        wx.request({
          url: 'http://192.168.2.221:8088/product/getProducts',
          data: {
            status: state,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
            }
            var animation = wx.createAnimation({
              duration: 300,
              timingFunction: 'ease',
            })
            animation.opacity(0).step()
            setTimeout(() => {
              that.setData({
                screen_display: "none",
              })
            }, 300)
            that.setData({
              product: res.data.data,
              sort: "",
              sortop: "",
              screen: "",
              screen_opacity: animation.export(),
            })
          }
        })
      }
    }
  },
  //更多的功能
  more_function: function () {
    this.setData({
      more_function: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      more_function_opacity: animation.export()
    })
  },
  more_function_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      more_function_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        more_function: "none",
      })
    }, 300)
  }
})
