const WORK_TIME = 30;
const REST_TIME = 20;
const TOTAL_WORKOUT_TIME = 15 * 60;

const phaseDisplay = document.getElementById("phase");
const timerDisplay = document.getElementById("timer");

const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

let currentPhase = "work";
let timeLeft = WORK_TIME;
let totalElapsed = 0;
let timerInterval = null;
let isRunning = false;

function updateDisplay() {
    phaseDisplay.textContent =
        currentPhase === "work" ? "WORK" : "REST";

    timerDisplay.textContent = `0:${String(timeLeft).padStart(2, "0")}`;
}

function playAlarm() {
    const audioContext =
        new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 900;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.start();

    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, 500);

    if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
}

function switchPhase() {
    playAlarm();

    if (currentPhase === "work") {
        currentPhase = "rest";
        timeLeft = REST_TIME;
    } else {
        currentPhase = "work";
        timeLeft = WORK_TIME;
    }

    updateDisplay();
}

function tick() {
    totalElapsed++;

    if (totalElapsed >= TOTAL_WORKOUT_TIME) {
        finishWorkout();
        return;
    }

    timeLeft--;

    if (timeLeft <= 0) {
        switchPhase();
    } else {
        updateDisplay();
    }
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    timerInterval = setInterval(tick, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
}

function resetTimer() {
    pauseTimer();

    currentPhase = "work";
    timeLeft = WORK_TIME;
    totalElapsed = 0;

    phaseDisplay.textContent = "READY";
    timerDisplay.textContent = "0:30";
}

function finishWorkout() {
    pauseTimer();

    playAlarm();

    phaseDisplay.textContent = "DONE";
    timerDisplay.textContent = "0:00";
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

resetTimer();
