const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatAudioTime = seconds => {
  if (typeof (seconds) === 'undefined' || seconds === '') {
    seconds = 0
  }

  let m, s;
  m = Math.floor(seconds / 60)
  m = m.toString().length === 1 ? ('0' + m) : m
  s = Math.floor(seconds - 60 * m)
  s = s.toString().length === 1 ? ('0' + s) : s
  return m + ':' + s
}

const isEmptyObject = obj => {
  return !obj || Object.keys(obj).length === 0;
}

module.exports = {
  formatTime: formatTime,
  formatAudioTime: formatAudioTime,
  isEmptyObject: isEmptyObject
}