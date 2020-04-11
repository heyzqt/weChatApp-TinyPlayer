import {
  fetch
} from 'fetch'

const baseUrl = 'https://api.apiopen.top';

//音乐排行榜接口
const musicRankingUrl = '/musicRankings';

//音乐排行榜详情接口
//参数 type: Number，榜单的type
//https://api.apiopen.top/musicRankingsDetails?type=2
const musicRankingDetailUrl = '/musicRankingsDetails';

//音乐电台接口
const musicBroadcastUrl = '/musicBroadcasting';

//音乐电台详情接口
//参数channelname：String，值为音乐电台中item的ch_name对应的值，比如public_tuijian_spring
//https://api.apiopen.top/musicBroadcastingDetails?channelname=public_tuijian_spring
const musicBroadcastDetailUrl = '/musicBroadcastingDetails';

//音乐详情接口
//参数id: String，对应歌曲的songid
//https://api.apiopen.top/musicDetails?id=704051
const musicDetailUrl = '/musicDetails';

//获取音乐排行榜请求
const fetchMusicRankingsData = () => {
  return fetch('GET', baseUrl + musicRankingUrl, {})
}

//获取音乐排行榜详情请求
const fetchMusicRankingsDetail = (params) => {
  return fetch('GET', baseUrl + musicRankingDetailUrl, params)
}

//获取音乐电台请求
const fetchMusicBroadcastData = () => {
  return fetch('GET', baseUrl + musicBroadcastUrl, {})
}

//获取音乐电台详情请求
const fetchMusicBroadcastDetail = (params) => {
  return fetch('GET', baseUrl + musicBroadcastDetailUrl, params)
}

//获取音乐详情请求
const fetchMusicData = (params) => {
  return fetch('GET', baseUrl + musicDetailUrl, params)
}

export {
  fetchMusicRankingsData,
  fetchMusicRankingsDetail,
  fetchMusicBroadcastData,
  fetchMusicBroadcastDetail,
  fetchMusicData
}