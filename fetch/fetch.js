import {
  hideLoading,
  request,
  toast
} from '../common/wx.js'

function promise(method, url, data) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      data: data,
      header: {
        "Content-Type": "application/json"
      },
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        hideLoading();
        if (res.data.code === 200) {
          resolve(res)
        } else {
          toast({
            title: "服务器异常，请稍后再试",
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function(res) {
        hideLoading();
        toast({
          title: "服务器异常，请稍后再试",
          icon: "none",
          duration: 2000
        })
        reject(res)
      }
    })
  })
}

function fetch(method, url, data) {
  return promise(method, url, data);
}

module.exports = {
  fetch
};