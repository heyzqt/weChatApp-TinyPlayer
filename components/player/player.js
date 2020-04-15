// components/player/player.js
import pubsub from '../../utils/pubsub'
var app = getApp()

Component({
  properties: {},
  data: {
    audio: {},
    isPlay: false
  },
  pageLifetimes: {
    //组件显示
    show: function () {
      this.initData()
      this.initCallBack()
      this.initRegister()
    }
  },
  methods: {
    initData: function () {
      this.setData({
        audio: app.globalData.globalAudioListManager.getCurrentAudio(),
        isPlay: app.globalData.isPlay
      })
    },
    initCallBack: function () {
      app.globalData.globalBgAudioManager.setPlayCallback((playstate) => {
        console.log('setPlayCallback playstate = ', playstate, ', isPlay=', app.globalData.isPlay)
        this.setData({
          isPlay: app.globalData.isPlay
        })
      })
    },
    initRegister: function() {
      pubsub.on('updateAudio', payload => {
        console.log('payload=', payload);
        this.setData({audio: payload})//更新视图
        this.playTargetAudio(this.data.audio)//更新音频
      })
    },
    handlePlayClick: function () {
      this.playTargetAudio(app.globalData.globalAudioListManager.getCurrentAudio())
    },
    playTargetAudio: function (targetAudio) {
      if (!app.globalData.currentTime) {
        //初始化音频，currentTimeW为0时，可能是当前音频播放完毕，stop后的状态，此时使用play是不能重新播放的
        //必须重新设置audio的src才能重新播放
        app.globalData.globalAudioListManager.changeAudio(targetAudio)
        app.globalData.globalBgAudioManager.changeAudio(app.globalData.globalAudioListManager.getCurrentAudio())
      } else {
        if (!app.globalData.globalAudioManager.paused) {
          app.globalData.globalAudioManager.pause();
        } else {
          app.globalData.globalAudioManager.play();
        }
      }
    }
  }
})