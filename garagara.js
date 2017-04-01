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
var rateMax = document.getElementById("rateMax");
var rateMin = document.getElementById("rateMin");

var source = null;

var playSound = function(volume) {
  // source を作成
  source = context.createBufferSource();
  var gain = context.createGain();
  // buffer をセット
  source.buffer = buffer;
  if (rateMax && rateMin) {
      max = parseFloat(rateMax.value);
      min = parseFloat(rateMin.value);
      source.playbackRate.value = min + Math.random() * (max - min);
  } else {
      source.playbackRate.value = 1.0
  }
  gain.gain.value = volume;
  // context に connect
  source.connect(gain);
  gain.connect(context.destination);
    // 再生
  source.loop = true;
  source.start(0);
};

// main
var soundfile = document.getElementById("soundfile");
window.onload = function() {
  // サウンドを読み込む
  getAudioBuffer(soundfile.value, function(b) { buffer = b; });
};

document.addEventListener("touchstart", touch, false);
document.addEventListener("mousedown", touch, false);

var shakePower = 0;

function touch() {
    console.debug("touch");
    if (source === null) {
	playSound(1);
	shakePower = 100;
	setTimeout(stopHandler, 100);
    } else {
	shakePower = 100;
    }
}

function stopHandler() {
    // console.debug("stopHandler");
    if (source === null) {
	console.debug(source, timerId);
	return ;
    }
    shakePower /= 2;
    if (shakePower < 10) {
	source.stop(0);
	source = null;
	shakePower = 0;
    } else {
	 setTimeout(stopHandler, 100);
    }
}

window.addEventListener("devicemotion", motion);

function motion(ev) {
    var ax = ev.accelerationIncludingGravity.x;
    var ay = ev.accelerationIncludingGravity.y;
    var power = ax*ax+ay*ay;
    if (power  > 1000) {
        console.debug("shake:" + power);
	touch();
    }
}
