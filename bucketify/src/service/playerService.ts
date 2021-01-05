const audio = document.getElementsByTagName('audio')[0];
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');

// シークバーの初期化
// const seekbarRangeField = document.getElementById("range-field");
const seekbar = document.getElementById('seekbar');
seekbar.setAttribute('min', '0');
seekbar.value = 0;

// 再生ボタン押下時
playButton.addEventListener('click', () => {
  audio.play();

  playButton.classList.add('hide');
  stopButton.classList.remove('hide');
});
// 一時停止ボタン押下時
stopButton.addEventListener('click', () => {
  audio.pause();

  playButton.classList.remove('hide');
  stopButton.classList.add('hide');
});

// シークバーで再生位置変更
document.getElementById('seekbar').addEventListener('click', (e) => {
  const duration = Math.round(audio.duration);
  if (!isNaN(duration)) {
    const mouse = e.pageX;
    const element = document.getElementById('seekbar');
    const rect = element.getBoundingClientRect();
    const position = rect.left + window.pageXOffset;
    const offset = mouse - position;
    const width = rect.right - rect.left;
    audio.currentTime = Math.round(duration * (offset / width));
  }
});

// 時間とシークバーの更新
audio.addEventListener('timeupdate', (e) => {
  const current = Math.floor(audio.currentTime);
  const duration = Math.round(audio.duration);
  if (!isNaN(duration)) {
    document.getElementById('current').innerHTML = playTimeFormatHelper(current);
    document.getElementById('duration').innerHTML = playTimeFormatHelper(duration);

    const percent = Math.round((audio.currentTime / audio.duration) * 1000) / 10;
    document.getElementById('seekbar').style.backgroundSize = percent + '%';
  }
});

// 再生終了時間の設定
audio.addEventListener('durationchange', (e) => {
  const duration = Math.round(audio.duration);
  if (!isNaN(duration)) {
    seekbar.setAttribute('max', Math.round(audio.duration));
  }
});
seekbar.addEventListener('click', (e) => {
  const duration = Math.round(audio.duration);
  if (!isNaN(duration)) {
    const mouse = e.pageX;
    const element = document.getElementById('seekbar');
    const rect = element.getBoundingClientRect();
    const position = rect.left + window.pageXOffset;
    const offset = mouse - position;
    const width = rect.right - rect.left;
    audio.currentTime = Math.round(duration * (offset / width));
  }
});

// 時間表示のフォーマット
const playTimeFormatHelper = (t) => {
  let hms = '';
  const h = (t / 3600) | 0;
  const m = ((t % 3600) / 60) | 0;
  const s = t % 60;
  const z2 = (v) => {
    const s = '00' + v;
    return s.substr(s.length - 2, 2);
  };
  if (h != 0) {
    hms = h + ':' + z2(m) + ':' + z2(s);
  } else if (m != 0) {
    hms = z2(m) + ':' + z2(s);
  } else {
    hms = '00:' + z2(s);
  }
  return hms;
};
