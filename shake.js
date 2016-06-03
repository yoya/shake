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
var playSound = function() {
  // source を作成
  var source = context.createBufferSource();
  // buffer をセット
  source.buffer = buffer;
  // context に connect
  source.connect(context.destination);
  // 再生
  source.start(0);
};

// main
window.onload = function() {
  // サウンドを読み込む
  var soundfile = document.getElementById("soundfile");
  getAudioBuffer(soundfile.value, function(b) { buffer = b; });
};

document.addEventListener("touchstart", touch, false);

function touch() {
    console.log("touch");
    playSound();
}

window.addEventListener("devicemotion", motion);
function motion(ev) {
    var ax = ev.accelerationIncludingGravity.x;
    var ay = ev.accelerationIncludingGravity.y;
    if (ax*ax+ay*ay > 1000) {
	console.log("shake");
	playSound();
    }
}

