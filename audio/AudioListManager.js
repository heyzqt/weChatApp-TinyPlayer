import {
	DEFAULT_MUSIC
} from '../config/index'

class AudioListManager {
	constructor(props) {
		this.instance = undefined;
		this.audio = DEFAULT_MUSIC;
	}

	static getInstance() {
		if (typeof (this.instance) === 'undefined') {
			this.instance = new AudioListManager();
		}
		return this.instance;
	}

	//检查是否是同一首歌
	isSameAudio = (id) => {
		return id == this.audio.song_id
	}

	//获取当前音频
	getCurrentAudio = () => {
		return this.audio;
	}

	//切换音乐
	changeAudio = (audio) => {
		this.audio = audio
	}
}

export default AudioListManager.getInstance();