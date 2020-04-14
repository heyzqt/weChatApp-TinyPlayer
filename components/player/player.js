// components/player/player.js
import {
  DEFAULT_MUSIC
} from '../../config/index'
var app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propPlayListId: {
      type: String,
      value: ''
    },
    propAudioList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    audioPlayListId: DEFAULT_MUSIC.id,
    audioList: [{
      id: DEFAULT_MUSIC.id,
      musicName: DEFAULT_MUSIC.musicName,
      artistName: DEFAULT_MUSIC.artistName,
      musicPic: DEFAULT_MUSIC.musicPic,
      musicUrl: DEFAULT_MUSIC.musicUrl
    }],
    curAudioIndex: 0,
    audio: {},
    isPlay: false
  },

  pageLifetimes: {
    show: function () {
      console.log('playListId = ', this.data.propPlayListId)
      console.log('audio list = ', this.data.propAudioList)

      this.initData()

      app.globalData.globalBgAudioManager.setPlayCallback((playstate) => {
        console.log('setPlayCallback playstate = ', playstate, ', isPlay=', app.globalData.isPlay)
        this.setData({
          isPlay: app.globalData.isPlay
        })
        if (playstate === global.AUDIO_STATE_END) {
          if ((app.globalData.globalAudioListManager.currentIndex + 1) === this.data.audioList.list.length) {
            app.globalData.currentTime = 0;
            app.globalData.playProgress = 0;
            this.setData({
              currentTime: app.globalData.currentTime,
              playProgress: app.globalData.playProgress
            })
          }

          this.handleNextAudio(false)
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData() {
      this.setData({
        audio: this.data.audioList[this.data.curAudioIndex]
      })
    },
    handlePlay() {
      this.playTargetAudio(this.data.audio.id)
    },
    // * 点击／自动播放 目标音频
    // * @param {*Number} targetAudioId
    // * - 检查是否点击到同一个音频
    // * - 检查是否完全播放完毕
    // * - 若未播放完毕，或者点击的不是同一个音频，先暂停当前音频
    // * - 执行音频播放操作
    playTargetAudio(id) {
      if (app.globalData.globalAudioListManager.isSameAudio(id)) {
        //同一个音频
        if (!app.globalData.currentTime) {
          //currentTimeW为0时，可能是当前音频播放完毕，stop后的一个状态，此时使用play是不能重新播放的
          //必须重新设置audio的src才能重新播放
          if (app.globalData.globalAudioListManager.changeCurrentAudioById(id)) {
            //更换并播放背景音乐
            app.globalData.globalBgAudioManager.changeAudio(app.globalData.globalAudioListManager.getCurrentAudio());
          }
        } else {
          if (!app.globalData.globalAudioManager.paused) {
            app.globalData.globalAudioManager.pause();
          } else {
            app.globalData.globalAudioManager.play();
          }
        }
      } else {
        //播放新音频，检查是否是同一个播放列表
        //如果是同一个播放列表，就直接切换音频播放
        //如果不是用一个播放列表，就先更换播放列表，再播放音频
        if (!app.globalData.globalAudioListManager.isSamePlayList(this.data.audioPlayListId)) {
          app.globalData.globalAudioListManager.changeAudioList(this.data.audioPlayListId, this.data.audioList)
        }

        if (app.globalData.globalAudioListManager.changeCurrentAudioById(id)) {
          app.globalData.globalBgAudioManager.changeAudio(app.globalData.globalAudioListManager.getCurrentAudio());
        }
      }
    }
  }
})