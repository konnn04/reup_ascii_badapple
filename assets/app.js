console.log = (function(originalLog) {
    const maxLogBuffer = 100;
    let logCount = 0;
    
    return function(...args) {
        if (logCount < maxLogBuffer) {
            originalLog.apply(console, args);
            logCount++;
        } else if (logCount === maxLogBuffer) {
            originalLog.apply(console, ["Log limit reached, suppressing further logs to improve performance..."]);
            logCount++;
        }
    };
})(console.log);
const frames = [];
let fps = 30;
let width = 120;
let height = 60;
let isPlaying = false;
let currentFrame = 0;
let animationInterval;
let startTime;
let pausedPosition = 0;

const loadingElem = document.getElementById('loading');
const controlsElem = document.getElementById('controls');
const playBtn = document.getElementById('play-btn');
const invertBtn = document.getElementById('invert-btn');
const progressElem = document.getElementById('progress');
const asciiContainer = document.getElementById('ascii-container');
const audioPlayer = document.getElementById('audio-player');
const seekSlider = document.getElementById('seek-slider');

function updateProgress() {
    progressElem.textContent = `${currentFrame + 1} / ${frames.length}`;
    seekSlider.value = Math.floor((currentFrame / (frames.length - 1)) * 100);
}

function showFrame(index) {
    if (index < 0 || index >= frames.length) return;
    
    asciiContainer.innerHTML = '';
    const frameLines = frames[index].split('\n');
    
    frameLines.forEach(line => {
        if (line.trim()) {
            const p = document.createElement('p');
            p.textContent = line;
            asciiContainer.appendChild(p);
        }
    });
    
    currentFrame = index;
    updateProgress();
}

function seek(percentage) {
    if (frames.length === 0) return;
    
    const targetFrame = Math.floor((frames.length - 1) * (percentage / 100));
    
    const audioDuration = audioPlayer.duration || 0;
    const audioTime = (percentage / 100) * audioDuration;
    
    showFrame(targetFrame);
    
    if (!isNaN(audioTime) && isFinite(audioTime)) {
        audioPlayer.currentTime = audioTime;
    }
    
    if (isPlaying) {
        const frameInterval = 1000 / fps;
        startTime = Date.now() - (targetFrame * frameInterval);
    } else {
        pausedPosition = targetFrame;
    }
}

function togglePlayback() {
    if (frames.length === 0) return;
    
    if (isPlaying) {
        clearInterval(animationInterval);
        audioPlayer.pause();
        playBtn.textContent = 'Play';
        pausedPosition = currentFrame;
    } else {
        const frameInterval = 1000 / fps;
        
        if (currentFrame >= frames.length - 1) {
            currentFrame = 0;
            pausedPosition = 0;
        }
        
        startTime = Date.now() - (pausedPosition * frameInterval);
        
        animationInterval = setInterval(() => {
            const elapsedMs = Date.now() - startTime;
            const targetFrame = Math.floor(elapsedMs / frameInterval);
            
            if (targetFrame >= frames.length) {
                clearInterval(animationInterval);
                isPlaying = false;
                playBtn.textContent = 'Play';
                return;
            }
            
            if (targetFrame !== currentFrame) {
                showFrame(targetFrame);
            }
        }, frameInterval / 2); // Kiểm tra mỗi nửa khung hình để giảm độ trễ
        
        const audioDuration = audioPlayer.duration || 0;
        const audioTime = (pausedPosition / (frames.length - 1)) * audioDuration;
        
        if (!isNaN(audioTime) && isFinite(audioTime)) {
            audioPlayer.currentTime = audioTime;
        }
        
        audioPlayer.play().catch(err => {
            console.error("Lỗi khi phát audio:", err);
        });
        
        playBtn.textContent = 'Pause';
    }
    
    isPlaying = !isPlaying;
}

function toggleInvert() {
    document.body.classList.toggle('inverted');
}

// Tải từ file ascii_frames.js
function loadFrames() {
    try {
        if (typeof frameData === 'undefined') {
            throw new Error("Frame data not loaded");
        }
        console.log("Bắt đầu xử lý frames (sẽ tốn khá nhiều tài nguyên)...");
        
        fps = frameData.fps || fps;
        width = frameData.width || width;
        height = frameData.height || height;
        
        console.log(`Metadata: FPS=${fps}, WIDTH=${width}, HEIGHT=${height}`);
        
        frameData.frames.forEach((frameText, index) => {
            frames.push(frameText);
            
            if (index % 100 === 0 || index === 0) {
                console.log(`Đã xử lý ${index + 1}/${frameData.frames.length} frames`);
            }
        });
        
        console.log(`Đã tải ${frames.length} frames từ JavaScript`);
        
        seekSlider.max = 100;
        seekSlider.value = 0;
        
        loadingElem.style.display = 'none';
        controlsElem.style.display = 'block';
        
        updateProgress();
        showFrame(0);
        
    } catch (error) {
        console.error('Lỗi khi tải frames:', error);
        loadingElem.textContent = 'Lỗi khi tải ASCII frames. Vui lòng thử lại.';
    }
}

playBtn.addEventListener('click', togglePlayback);
invertBtn.addEventListener('click', toggleInvert);

seekSlider.addEventListener('input', function() {
    const percentage = parseInt(this.value);
    const targetFrame = Math.floor((frames.length - 1) * (percentage / 100));
    showFrame(targetFrame);
});

seekSlider.addEventListener('change', function() {
    seek(parseInt(this.value));
});

// Khởi tạo main
window.addEventListener('load', loadFrames);