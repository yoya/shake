// http://phiary.me/webaudio-api-getting-started/

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var buffer = null;

// Audio 用の buffer を読み込む
var getAudioBuffer = function(url, fn) {
  var req = new XMLHttpRequest();
  // array buffer を指定
  req.responseType = 'arraybuffer';

  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 0 || req.status === 200) {
        // array buffer を audio buffer に変換
        context.decodeAudioData(req.response, function(buffer) {
          // コールバックを実行
          fn(buffer);
        });
      }
    }
  };

  req.open('GET', url, true);
  req.send('');
};

// サウンドを再生
var soundmax = document.getElementById("soundmax");
var soundmin = document.getElementById("soundmin");
var playSound = function(volume) {
  // source を作成
  var source = context.createBufferSource();
  var gain = context.createGain();
  // buffer をセット
  source.buffer = buffer;
  if (soundmax && soundmin) {
      max = parseFloat(soundmax.value);
      min = parseFloat(soundmin.value);
      source.playbackRate.value = min + Math.random() * (max - min);
  } else {
      source.playbackRate.value = 1.0
  }
  gain.gain.value = volume;
  // context に connect
  source.connect(gain);
  gain.connect(context.destination);
  // 再生
  source.start(0);
};

// main
var soundfile = document.getElementById("soundfile");
window.onload = function() {
  // サウンドを読み込む
  getAudioBuffer(soundfile.value, function(b) { buffer = b; });
};

document.addEventListener("touchstart", touch, false);

function touch() {
    // console.debug("touch");
    playSound(1);
}

window.addEventListener("devicemotion", motion);
function motion(ev) {
    var ax = ev.accelerationIncludingGravity.x;
    var ay = ev.accelerationIncludingGravity.y;
    var power = ax*ax+ay*ay;
    if (power  > 1000) {
	console.debug("shake:" + power);
	if (power > 4000) {
	    power = 4000;
	}
	playSound((power - 1000) / 3000);
    }
}

