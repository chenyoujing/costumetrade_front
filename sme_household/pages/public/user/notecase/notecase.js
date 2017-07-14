// pages/grid/user/notecase/notecase.js
Page({
  data: {
    current:"0"
  },
  notecasetype:function(e){
    let data = e.target.dataset
    this.setData({
      current: data.notecase,
    })

  }
})