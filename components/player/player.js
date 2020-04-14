// components/player/player.js
import {
  DEFAULT_MUSIC
} from '../../config/index'
import pubsub from '../../utils/pubsub'
var app = getApp()

Component({
  properties: {},
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
    //组件显示
    show: function () {
      this.initData()

      //注册updatePlayer订阅事件
      pubsub.on('updatePlayer', (playListId, audio, audioList) => {
        console.log('updatePlayer playListId= ', playListId)
        console.log('updatePlayer audio=', audio)
        console.log('updatePlayer audioList=', audioList)
      })

      app.globalData.globalBgAudioManager.setPlayCallback((playstate) => {
        console.log('setPlayCallback playstate = ', playstate, ', isPlay=', app.globalData.isPlay)
        this.setData({
          isPlay: app.globalData.isPlay
        })
        //如果不是最后一首歌，自动播放下一曲
        //如果是最后一首歌，停止歌曲并初始化歌曲
        if (playstate === global.AUDIO_STATE_END) {
          if ((app.globalData.globalAudioListManager.currentIndex + 1) === app.globalData.globalAudioListManager.audioList.length) {
            app.globalData.currentTime = 0;
            app.globalData.playProgress = 0;
          }
          this.handleNextAudio()
        }
      })
    }
  },
  methods: {
    initData() {
      //检查有无背景音乐在播放
      if (app.globalData.globalAudioListManager.isAudioListEmpty()) {
        //若无，则设置成默认音乐
        this.setData({
          audio: this.data.audioList[this.data.curAudioIndex]
        })
      } else {
        //若有，则更新播放栏为当前背景音乐
        this.setData({
          audio: app.globalData.globalAudioListManager.getCurrentAudio(),
          audioPlayListId: app.globalData.globalAudioListManager.playListId,
          audioList: app.globalData.globalAudioListManager,
          isPlay: app.globalData.isPlay
        })
      }
      console.log('player initdata audio = ', this.data.audio)
      console.log('player initdata audioPlayListId = ', this.data.audioPlayListId)
      console.log('player initdata audio list = ', this.data.audioList)
    },
    handlePlayClick() {
      this.playTargetAudio(this.data.audio.id)
    },
    playTargetAudio(id) {
      if (app.globalData.globalAudioListManager.isSameAudio(id)) {
        //同一个音频
        if (!app.globalData.currentTime) {
          //currentTimeW为0时，可能是当前音频播放完毕，stop后的状态，此时使用play是不能重新播放的
          //必须重新设置audio的src才能重新播放
          if (app.globalData.globalAudioListManager.changeCurrentAudioById(id)) {
            //更换并播放背景音乐
            this.setData({
              audio: app.globalData.globalAudioListManager.getCurrentAudio()
            })
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
          this.setData({
            audio: app.globalData.globalAudioListManager.getCurrentAudio()
          })
          app.globalData.globalBgAudioManager.changeAudio(app.globalData.globalAudioListManager.getCurrentAudio());
        }
      }
    },
    handleNextClick() {
      if (app.globalData.globalAudioListManager.changeCurrentAudioByIndex(app.globalData.globalAudioListManager.data.currentIndex + 1)) {
        this.audio = app.globalData.globalAudioListManager.getCurrentAudio()
        app.globalData.globalBgAudioManager.changeAudio(app.globalData.globalAudioListManager.getCurrentAudio())
      }
    }
  }
})