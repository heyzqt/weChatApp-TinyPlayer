//微信提示消息方法
const toast = (params) => wx.showToast(params);

//微信发送网络请求方法
const request = (params) => wx.request(params);

//显示loading的方法
const showLoading = (params) => wx.showLoading(params);

//隐藏loading的方法
const hideLoading = (params) => wx.hideLoading(params);

//获取背景音乐播放BackgroundAudioManager实例
const createBackgroundAudioManager = () => wx.getBackgroundAudioManager();

module.exports = {
  toast,
  request,
  showLoading,
  hideLoading,
  createBackgroundAudioManager
}