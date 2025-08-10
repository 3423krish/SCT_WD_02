/* script.js - corrected version */

// Create floating background circles (same as before)
function createBackgroundCircles() {
  const colors = [
    'rgba(83, 125, 93, 0.1)',
    'rgba(115, 148, 107, 0.1)',
    'rgba(158, 188, 138, 0.1)',
    'rgba(210, 208, 160, 0.1)'
  ];

  for (let i = 0; i < 12; i++) {
    const circle = document.createElement('div');
    circle.className = 'bg-circle';

    const size = Math.random() * 150 + 50;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const left = Math.random() * 100;

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.background = colors[Math.floor(Math.random() * colors.length)];
    circle.style.animationDuration = `${duration}s`;
    circle.style.animationDelay = `${delay}s`;
    circle.style.left = `${left}vw`;
    circle.style.top = '100vh';

    document.body.appendChild(circle);
  }
}
createBackgroundCircles();

// Stopwatch state
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 1;

// Elements
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const lapsContainer = document.getElementById('laps-container');

// Helpers
function formatTime(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const centiseconds = Math.floor((time % 1000) / 10);
  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(centiseconds).padStart(2, '0')
  );
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
  if (isRunning) {
    display.style.animation = 'none';
    void display.offsetWidth; // reflow
    display.style.animation = 'pulse 1s infinite alternate';
  } else {
    display.style.animation = 'none';
  }
}

function setButtonStates() {
  if (isRunning) {
    startBtn.disabled = true;
    startBtn.textContent = 'Start';
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
  } else {
    startBtn.disabled = false;
    startBtn.textContent = elapsedTime ? 'Resume' : 'Start';
    pauseBtn.disabled = true;
    // only enable lap if there's some elapsed time
    lapBtn.disabled = (elapsedTime === 0);
  }
}

// Actions
function startTimer() {
  if (isRunning) return;
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
  isRunning = true;
  setButtonStates();
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  setButtonStates();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  elapsedTime = 0;
  lapCount = 1;
  updateDisplay();
  lapsContainer.innerHTML = '<div class="placeholder">Lap times will appear here</div>';
  setButtonStates();
}

function recordLap() {
  // require either running OR some elapsed time
  if (!isRunning && elapsedTime === 0) return;

  // remove placeholder safely
  const first = lapsContainer.firstElementChild;
  if (first && first.classList.contains('placeholder')) {
    lapsContainer.innerHTML = '';
  }

  const lapTime = document.createElement('div');
  lapTime.className = 'lap-item';
  lapTime.textContent = `Lap ${lapCount++}: ${formatTime(elapsedTime)}`;
  // put newest on top
  if (lapsContainer.firstChild) {
    lapsContainer.insertBefore(lapTime, lapsContainer.firstChild);
  } else {
    lapsContainer.appendChild(lapTime);
  }
  // ensure lap button remains enabled while running
  setButtonStates();
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);

// Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    isRunning ? pauseTimer() : startTimer();
  }
  if (e.key.toLowerCase() === 'l') recordLap();
  if (e.key.toLowerCase() === 'r') resetTimer();
});

// Init
updateDisplay();
setButtonStates();