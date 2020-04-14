// pages/rankDetail/rankDetail.js
import {
  setNavigationBarTitle
} from '../../common/wx'
import {
  fetchMusicRankingsDetail
} from '../../fetch/request'

Page({
  data: {
    audioList: []
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
      playListId: 'type='+type
    })

    fetchMusicRankingsDetail({
      type: type
    }).then((resp) => {
      this.setData({
        audioList: resp.data.result
      })
    })
  },
})