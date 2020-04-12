import {
  hideLoading,
  showLoading
} from '../common/wx.js'
var global = require('../utils/global')

class AudioBackgroundManager {
  constructor(props) {
    this.instance = undefined;
    this.isMovingSlider = false; //用户是否正在移动Slider
    this.callback = null; //音乐播放的回调
    this.updateTimeCallback = null; //更新播放时间的回调
  }

  static getInstance() {
    if (typeof (this.instance) === 'undefined') {
      this.instance = new AudioBackgroundManager()
    }
    return this.instance;
  }

  setPlayCallback = (callback) => {
    this.callback = callback;
  }

  setUpdateTimeCallback = (callback) => {
    this.updateTimeCallback = callback;
  }

  setIsMovingSlider = (moving) => {
    this.isMovingSlider = moving
  }

  seekAudio = (position) => {
    this.app.globalData.globalAudioManager.seek(position)
  }

  changeAudio = (audio) => {
    this.createAudioCtx(audio);
  }

  createAudioCtx = async (audio) => {
    try {
      if (typeof (this.app) === 'undefined') {
        this.app = getApp();
      }
      this.app.globalData.globalAudioManager.src = audio.musicUrl;
      this.app.globalData.globalAudioManager.title = audio.musicName;
      this.app.globalData.globalAudioManager.coverImgUrl = audio.musicPic;
      this.app.globalData.globalAudioManager.singer = audio.artistName;

      this.app.globalData.globalAudioManager.onPlay(() => {
        console.log('audio play')
        hideLoading();
        this.app.globalData.isPlay = true
        this.callback(global.AUDIO_STATE_PLAY)
      })

      this.app.globalData.globalAudioManager.onPause(() => {
        console.log('audio pause')
        this.app.globalData.isPlay = false;
        this.callback(global.AUDIO_STATE_PAUSE)
      })

      this.app.globalData.globalAudioManager.onTimeUpdate(() => {
        console.log('onTimeUpdate')
        setTimeout(() => {
          hideLoading();
        }, 300); //设置300ms延时，避免加载过快一闪而过用户体验不好
        this.app.globalData.slidermax = Math.floor(this.app.globalData.globalAudioManager.duration);
        if (!this.isMovingSlider) {
          this.app.globalData.playProgress = Math.floor(this.app.globalData.globalAudioManager.currentTime);
        }
        this.app.globalData.currentTime = this.app.globalData.globalAudioManager.currentTime;
        this.app.globalData.duration = this.app.globalData.globalAudioManager.duration;
        this.updateTimeCallback();
      })
      this.app.globalData.globalAudioManager.onSeeked(() => {
        console.log('audio onSeeked')
      })

      this.app.globalData.globalAudioManager.onEnded(() => {
        console.log('audio ended')
        this.app.globalData.globalAudioManager.stop();
        this.app.globalData.isPlay = false;
        this.callback(global.AUDIO_STATE_END);
      })

      this.app.globalData.globalAudioManager.onWaiting(() => {
        console.log('onWaiting')
        showLoading();
        this.callback(global.AUDIO_STATE_WAITING);
      })

      this.app.globalData.globalAudioManager.onError((res) => {
        console.log('onError error: ', res)
        this.app.globalData.isPlay = false;
      })
    } catch (err) {
      console.log('createAudioCtx err: ', err);
    }
  }
}

export default AudioBackgroundManager.getInstance();