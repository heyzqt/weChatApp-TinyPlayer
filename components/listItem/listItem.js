// components/listItem/listItem.js
import {
  fetchMusicData
} from '../../fetch/request'
import {
  DEFAULT_MUSIC
} from '../../config/index'
import pubsub from '../../utils/pubsub'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: String,
      value: ''
    },
    pic: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handlePlayClick: function () {
      this.getAudio()
    },
    getAudio: function () {
      fetchMusicData({
        id: this.id
      }).then((res) => {
        console.log('res=', res)
        const {
          songName: musicName = DEFAULT_MUSIC.musicName,
          songLink: musicUrl = DEFAULT_MUSIC.musicUrl,
          songPicBig: musicPic = DEFAULT_MUSIC.musicPic,
          artistName: artistName = DEFAULT_MUSIC.artistName
        } = res.data.result.songList[0]
        pubsub.emit('updateAudioList', {
          musicName,
          musicUrl,
          musicPic,
          artistName
        }) //通知对应page更新
      })
    },
    onUnload: function () {
      console.log('onUnload')
      //todo 取消订阅
    }
  }
})