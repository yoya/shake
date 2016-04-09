window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioctx = new AudioContext();

var sound = document.getElementById("vibraslap");

function main() {
    console.log("main");
}

function play() {
    console.log("play");
    sound.currentTime = 0;
    sound.play();
}

document.addEventListener("touchstart", touch, false);
function touch() {
    console.log("touch");
    play();
}

window.addEventListener("devicemotion", motion);
function motion(ev) {
    var ax = ev.accelerationIncludingGravity.x;
    var ay = ev.accelerationIncludingGravity.y;
    if (ax*ax+ay*ay > 1000) {
	console.log("shake");
	play();
    }
}



