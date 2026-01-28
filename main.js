// VARIABLES
let isFocus = true;         
let duration = 25 * 60;     
let time = duration;        
let timerInterval = null;   

// ELEMENTS HTML
const timeDisplay = document.getElementById("time");
const modeText = document.getElementById("mode");
const progressCircle = document.getElementById("progress");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

// CERCLE SVG
const radius = 180;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = 0;

// METTRE À JOUR LE TIMER ET LE CERCLE
function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const progress = time / duration;
  progressCircle.style.strokeDashoffset = circumference * (1 - progress);
}

// CHANGER LE MODE FOCUS / PAUSE
function switchMode() {
  isFocus = !isFocus;
  if (isFocus) {
    duration = 25 * 60; 
    modeText.textContent = "FOCUS";
  } else {
    duration = 5 * 60; 
    modeText.textContent = "BREAK";
  }
  time = duration;
  updateDisplay();
}

function playSound() {
  const audio = new Audio("sounds/alarm.mp3"); // 
  audio.play();
}

// START TIMER
function startTimer() {
  if (timerInterval) return; 

  startBtn.disabled = true;  
  stopBtn.disabled = false;

  timerInterval = setInterval(() => {
    if (time > 0) {
      time--;           
      updateDisplay();  
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      startBtn.disabled = false;
      stopBtn.disabled = true;

      const audio = new Audio("sounds/alarm.mp3");
      audio.play();

      // Quand le son est fini, demander avant de commencer l'autre mode
      audio.addEventListener("ended", () => {
        const ready = confirm("Ready?");
        if (ready) {
          switchMode();   
          startTimer();   
        }
      });
    }
  }, 1000);
}




// STOP TIMER
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  startBtn.disabled = false; 
}

// RESET TIMER
function resetTimer() {
  stopTimer();
  if (isFocus) {
    duration = 25 * 60;
    modeText.textContent = "FOCUS";
  } else {
    duration = 5 * 60;
    modeText.textContent = "BREAK";
  }
  time = duration;
  updateDisplay();
}

// BOUTONS
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();

