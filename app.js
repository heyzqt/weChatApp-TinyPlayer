//app.js
import {createBackgroundAudioManager} from './common/wx.js'
import AudioListManager from './audio/AudioListManager.js'
import AudioBgManagerInstance from './audio/AudioBackgroundManager.js'

App({
  onLaunch: function () {
    console.log('app onLaunch')
  },
  globalData: {
    userInfo: null,
    globalAudioManager: createBackgroundAudioManager(),
    globalBgAudioManager: AudioBgManagerInstance,
    globalAudioListManager: AudioListManager,
    isPlay: false, //背景音乐播放状态
    currentTime: 0
  }
})