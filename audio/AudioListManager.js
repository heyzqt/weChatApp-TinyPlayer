import { toast } from '../common/wx'
const utils = require('../utils/util')

class AudioListManager {
  constructor(props) {
    this.instance = undefined;
    this.audioInfo = {
      id: 'heyzqt'
    };//当前播放的音频
    this.audioList = []; //当前播放音乐列表，因为需要Ended里判断播放下一首歌
    this.playListId = ''; //当前播放歌单id
    this.currentIndex = 0; //指向当前播放的音频
  }

  static getInstance() {
    if (typeof (this.instance) === 'undefined') {
      return new AudioListManager();
    }
    return this.instance;
	}
	
	isAudioListEmpty = () => {
		return this.audioInfo.id === 'heyzqt' || this.audioInfo.id === ''
	}

  	//获取当前音频
	getCurrentAudio = () => {
		return this.audioInfo;
  }
  
  isSamePlayList = (id) => {
		return !(this.playListId === '' || id !== this.playListId)
	}

	isSameAudio = (id) => {
		return this.audioInfo && !utils.isEmptyObject(this.audioInfo) && id === this.audioInfo.id;
	}

	//更换整个音频列表
	changeAudioList = (id, list) => {
		this.playListId = id;
		this.audioList = list.slice();
	}

	//修改当前音频，主要用于响应“上一首/下一首”点击
	changeCurrentAudioByIndex = (index, lastSongShowToast) => {
		if (index !== index) {
			//index是NaN的情况，NaN不等于本身
			return false
		}
		
		if (this.isLeftEdge(index) || this.isRightEdge(index)) {
      if (lastSongShowToast) {
        toast({title: '没有更多音频了哦', icon: 'none', duration: 2000}) 
      }
			return false
		}

		if (index < this.currentIndex) {
			this.audioInfo = this.getPrevAudio()
		} else {
			this.audioInfo = this.getNextAudio()
		}
		this.currentIndex = index
		return true
	}

	//修改当前音频，主要用于响应点击特定的音频
	changeCurrentAudioById = (id) => {
		if (id === '' || typeof(id) === 'undefined') {
			return false
		}
		
		let index = 0;
		for (let item of this.audioList) {
			if (id === item.id) {
				this.audioInfo = item;
        this.currentIndex = index;
				break
			}
			index++;
		}
		return true
	}

	//获取上一首音频
	getPrevAudio() {
		return this.audioList[this.currentIndex - 1];
	}

	//获取下一首音频
	getNextAudio() {
		return this.audioList[this.currentIndex + 1];
	}

	//检查是否有上一个音频
	isLeftEdge(index) {
		return index === -1
	}

	//检查是否有下一个音频
	isRightEdge(index) {
		return index === this.audioList.length
	}
}

export default AudioListManager.getInstance();