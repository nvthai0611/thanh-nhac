let progressBar = document.querySelector('.progress-bar');
let progress = document.querySelector('.progress');
let progressSpan = document.querySelector('span');
let progressBarWidth = progressBar.clientWidth;

let handleChange = function (width) {
     let value = (width * 100) / progressBarWidth;
     if(value < 0){
        value = 0;
     }
     if(value > 100){
        value = 100;
     }
     progress.style.width = `${value}%`
     currentWidth = width;  
}
let isDrag = false;
let initalClientX = 0;
let current = 0;
let currentWidth = 0;
progressBar.addEventListener("mousedown", function (e) {
    if(e.which === 1){
        handleChange(e.offsetX); 
        isDrag = true; 
        initalClientX = e.clientX;
        current = e.offsetX;
    }

});

progressSpan.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    isDrag = true;
    initalClientX = e.clientX;
    console.log(initalClientX);
    
});

document.addEventListener("mouseup", function (e) {
    isDrag = false;
    current = currentWidth;
});

document.addEventListener('mousemove', function (e) {
    if(isDrag){
        let moveWidth = e.clientX - initalClientX
        // moveWidth CHỈ LÀ KHOẢNG KÉO THÊM
        handleChange(current + moveWidth);
    }
});


// Xây dựng trình phát nhạc
let audio = new Audio("./mp3/Alan Walker - Faded.mp3");
let playBtn = document.querySelector('.play-btn');
let currentTimeEl = progressBar.previousElementSibling;
let durationEl = progressBar.nextElementSibling;
// là ngôn ngữ lập trình bất đồng bộ nên file mp3 chưa tải xong 
// console.log(audio.duration);
let getTime = function (seconds) {
    let mins = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - mins * 60);
    return `${mins < 10 ? "0" + mins : mins }:${seconds < 10 ? "0" + seconds : seconds}`
}
audio.addEventListener('loadeddata', function () {
    durationEl.innerHTML = getTime(audio.duration)
})

let pauseIcon = `<i class="fa-solid fa-pause"></i>`;
let playIcon = `<i class="fa-solid fa-play"></i>`;

playBtn.addEventListener('click', function (e) {
    if(audio.paused){
        audio.play();
        this.innerHTML = pauseIcon;
    } else {
        audio.pause();
        this.innerHTML = playIcon;
    }
});
audio.addEventListener('timeupdate', function () {
    console.log(audio.currentTime);
    currentTimeEl.innerText = getTime(audio.currentTime);
    let value = (audio.currentTime * 100) / audio.duration;
    progress.style.width = `${value}%`;
})




