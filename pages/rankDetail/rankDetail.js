// pages/rankDetail/rankDetail.js
import {
  setNavigationBarTitle
} from '../../common/wx'
import {
  fetchMusicRankingsDetail
} from '../../fetch/request'
import pubsub from '../../utils/pubsub'

Page({
  data: {
    audioList: [],
    playListId: ''
  },
  onLoad: function (options) {
    console.log(options)
    const {
      type,
      name,
      bg,
      bgcolor
    } = options;
    setNavigationBarTitle({
      title: name
    })

    this.setData({
      bg: bg,
      bgcolor: bgcolor,
      playListId: 'type_' + type
    })
    console.log('onLaunch playListId=', this.data.playListId)

    fetchMusicRankingsDetail({
      type: type
    }).then((resp) => {
      this.setData({
        audioList: resp.data.result
      })
    })
  },
  onReady: function () {
    //注册updateAudioList订阅事件
    pubsub.on('updateAudioList', (audio) => {
      console.log('updateAudioList audio= ', audio);
      pubsub.emit('updatePlayer', {
        playListId: this.data.playListId,
        audio,
        audioList: this.data.audioList
      }) //通知player更新数据和视图
    })
  },

  //更新UI
  updateControlsInAudio: function () {
    this.setData({

    })
  },

  onUnload: function () {
    //todo 解除订阅
  }
})