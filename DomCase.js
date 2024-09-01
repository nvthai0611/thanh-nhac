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
     
     var currentTime = value / 100 * audio.duration;
     audio.currentTime = currentTime;
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
let audio = new Audio("./mp3/hero.mp3");
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
    currentTimeEl.innerText = getTime(audio.currentTime);
    let value = (audio.currentTime * 100) / audio.duration;
    progress.style.width = `${value}%`;
});
console.log(lyrics);


// Xây dựng chức năng karaoke
let karaoke = document.querySelector('.karaoke');
let karaokeInner = karaoke.querySelector('.karaoke-inner');
let karaokePlayBtn = karaoke.querySelector('.karaoke-play');
let karaokeClose = document.querySelector('.close');
let player = document.querySelector('.player');
let karaokeContent = document.querySelector('.karaoke-content');
karaokePlayBtn.addEventListener('click', function () {
    player.classList.add('bottom');
    karaokeInner.classList.add('show');
});

karaokeClose.addEventListener('click', function () {
    karaokeInner.classList.remove('show');
    player.classList.remove('bottom');

});

let karaokeInterval;

// Lắng nghe sự kiện play
audio.addEventListener('play', function () {
    console.log("play");
    karaokeInterval = setInterval(handleKaraoke, 100);
});

// Lắng nghe sự kiện pause
audio.addEventListener('pause', function () {
    console.log("pause");
    clearInterval(karaokeInterval);
});


let handleKaraoke = function () {
    let currentTime = audio.currentTime * 1000;
    let index = lyrics.findIndex(function (lyricItem) {
        let firstWord = lyricItem.words[0];
        let lastWord = lyricItem.words[lyricItem.words.length - 1];
        return currentTime >= firstWord.startTime && currentTime <= lastWord.endTime;
    });

    if (index !== -1) {
        let currentSentence = getSentence(index);
        let nextSentence = getSentence(index + 1);
        console.log(currentSentence, nextSentence);
        if (karaokeContent.children.length === 0) {
            // Initial setup
            karaokeContent.innerHTML = `<p>${currentSentence}</p><p>${nextSentence}</p>`;
        } else {
            // Update the appropriate line
            let lineToUpdate = index % 2;
            karaokeContent.children[lineToUpdate].textContent = currentSentence;
            karaokeContent.children[1 - lineToUpdate].textContent = nextSentence;
        }
    }
}

let getSentence = function (index) {
    if (!lyrics[index]) return '';
    return lyrics[index].words.map(word => word.data).join(' ');
};

/*
 Index = 1 -> Ẩn element 0 -> hiển thị index = 2
 Index = 2 -> Ẩn element 1 -> hiển thị index = 3
 Index = 3 -> Ẩn element 0 -> hiển thị index = 4
 Index = 4 -> Ẩn element 1 -> hiển thị index = 5
*/