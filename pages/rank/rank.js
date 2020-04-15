//index.js
import {
  fetchMusicRankingsData
} from '../../fetch/request'

Component({
  data: {},
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
    }
  }
})