//index.js
import {showLoading, hideLoading} from '../../common/wx'
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
    audioList: {},
    curAudioIndex: 0
  },
  methods: {
    onLoad: function () {
      this.getData();

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

      app.globalData.globalBgAudioManager.setUpdateTimeCallback(() => {
        this.setData({
          currentTime: util.formatAudioTime(app.globalData.currentTime),
          duration: util.formatAudioTime(app.globalData.duration),
          slidermax: Math.floor(app.globalData.duration),
          playProgress: Math.floor(app.globalData.currentTime)
        })
      })

      app.globalData.globalBgAudioManager.setSeekCallback(() => {
        this.setData({
          playProgress: app.globalData.playProgress
        })
      })
    },
    getData: function() {
      showLoading({title: '正在加载数据...'})
      new Promise((resolve, reject) => {
        //模仿网络请求获取数据
        setTimeout(()=> resolve(), 2000);
      }).then(res => {
        hideLoading();
        this.setData({
          audioList: {
            id: "gd102",
            list: [{
                "id": "songlist1_0",
                "musicName": '当冬夜渐暖',
                "artistName": "孙燕姿",
                "musicPic": 'https://img4.cache.netease.com/ent/2011/3/15/20110315074632a55d0.jpg',
                "musicUrl": 'http://music.163.com/song/media/outer/url?id=286959.mp3',
              },
              {
                "id": "songlist1_1",
                "musicName": '致爱丽丝',
                "artistName": "xxxxx",
                "musicPic": 'https://img4.cache.netease.com/ent/2011/3/15/20110315074632a55d0.jpg',
                "musicUrl": 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3'
              },
              {
                "id": "songlist1_2",
                "musicName": "王妃",
                "artistName": "萧敬腾",
                "musicPic": 'https://img4.cache.netease.com/ent/2011/3/15/20110315074632a55d0.jpg',
                "musicUrl": 'http://m10.music.126.net/20200412151854/2effd9f07b1a49748c2f5f222e21d513/ymusic/1a1f/912a/c4d2/8f46d77ec35679f03e204a6b30130a4c.mp3'
              }
            ]
          }
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
      let {id} = e.currentTarget.dataset;
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