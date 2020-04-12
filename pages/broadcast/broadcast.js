// pages/broadcast.js
import {
  fetchMusicBroadcastData
} from '../../fetch/request'

Page({
  data: {
    broadcastList: []
  },
  onLoad: function (options) {
    this.getData();
  },
  getData: function () {
    fetchMusicBroadcastData().then(resp => {
      this.setData({
        broadcastList: resp.data.result[0].channellist
      })
    })
  }
})