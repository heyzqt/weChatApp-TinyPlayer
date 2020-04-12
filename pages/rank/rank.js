//index.js
import {
  setNavigationBarTitle,
  showLoading,
  hideLoading
} from '../../common/wx'
import {
  fetchMusicRankingsData
} from '../../fetch/request'
import {
  DEFAULT_MUSIC
} from '../../config/index.js'
const computedBehavior = require('miniprogram-computed')
const global = require('../../utils/global')
const util = require('../../utils/util')

//获取应用实例
const app = getApp()

Component({
  behaviors: [computedBehavior],
  data: {
    isPlay: app.globalData.isPlay,
    slidermin: 0,
    slidermax: Math.floor(app.globalData.slidermax),
    playProgress: Math.floor(app.globalData.playProgress),
    currentTime: util.formatAudioTime(app.globalData.currentTime),
    duration: util.formatAudioTime(app.globalData.duration),
    audioList: [],
    curAudioIndex: 0
  },
  methods: {
    onLoad: function () {
      this.getData();
    },
    getData: function () {
      fetchMusicRankingsData().then(resp => {
        this.setData({
          audioList: resp.data.result
        })
      })
    },
    playMusic: function (e) {
      if (this.data.isPlay) {
        app.globalData.globalAudioManager.pause();
      } else {
        // app.globalData.globalBgAudioManager.createAudioCtx(DEFAULT_MUSIC)
        app.globalData.globalBgAudioManager.createAudioCtx(this.data.audioList.list[this.data.curAudioIndex])
      }
    },
    handlePlayAudio: function (e) {
      let {
        id
      } = e.currentTarget.dataset;
      if (!id) {
        id = this.data.audioList.list[app.globalData.globalAudioListManager.currentIndex].id;
      }
      this.playTargetAudio(id)
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
        if (!app.globalData.globalAudioListManager.isSamePlayList(this.data.audioList.id)) {
          app.globalData.globalAudioListManager.changeAudioList(this.data.audioList.id, this.data.audioList.list)
        }

        if (app.globalData.globalAudioListManager.changeCurrentAudioById(id)) {
          app.globalData.globalBgAudioManager.changeAudio(app.globalData.globalAudioListManager.getCurrentAudio());
        }
      }
    },
    handleSliderMoveChange(e) {
      console.log(e)
      app.globalData.globalBgAudioManager.seekAudio(e.detail.value)
    },
    handleSliderMoveStart() {
      app.globalData.globalBgAudioManager.setIsMovingSlider(true)
    },
    handleSliderMoveEnd() {
      app.globalData.globalBgAudioManager.setIsMovingSlider(false)
    },
    handlePrevAudio() {

      if ((this.data.curAudioIndex - 1) === -1) {
        wx.showToast({
          title: '没有更多歌曲了',
        })
        return
      }

      this.setData({
        curAudioIndex: this.data.curAudioIndex - 1
      })
      app.globalData.globalBgAudioManager.createAudioCtx(this.data.audioList.list[this.data.curAudioIndex])
    },
    handleNextAudio(lastSongShowToast = true) {
      if (app.globalData.globalAudioListManager.changeCurrentAudioByIndex(app.globalData.globalAudioListManager.currentIndex + 1, lastSongShowToast)) {
        app.globalData.globalBgAudioManager.changeAudio(app.globalData.globalAudioListManager.getCurrentAudio())
      }



      // if ((this.data.curAudioIndex + 1) === this.data.audioList.list.length) {

      //   if (!fromEnd) {
      //     wx.showToast({
      //       title: '没有更多歌曲了',
      //     })
      //   }
      //   return
      // }

      // this.setData({
      //   curAudioIndex: this.data.curAudioIndex + 1
      // })

      // app.globalData.globalBgAudioManager.createAudioCtx(this.data.audioList.list[this.data.curAudioIndex])
    }
  }
})