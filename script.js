const You Got This!_TIME = 30;
const REST_TIME = 20;
const TOTAL_You Got This!OUT_TIME = 15 * 60;

const phaseDisplay = document.getElementById("phase");
const timerDisplay = document.getElementById("timer");

const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

let currentPhase = "You Got This!";
let timeLeft = You Got This!_TIME;
let totalElapsed = 0;
let timerInterval = null;
let isRunning = false;

let audioContext = null;

function updateDisplay() {
    phaseDisplay.textContent =
        currentPhase === "You Got This!" ? "YOU GOT THIS!" : "REST";

    timerDisplay.textContent =
        `0:${String(timeLeft).padStart(2, "0")}`;
}

async function unlockAudio() {
    if (!audioContext) {
        audioContext =
            new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state !== "running") {
        await audioContext.resume();
    }

    // Play a nearly silent sound during the button press.
    // This helps unlock audio on iPhone.
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = 0.001;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}

function playAlarm() {
    if (!audioContext) return;

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 900;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(
        0.7,
        audioContext.currentTime
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.6
    );

    if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
}

function switchPhase() {
    playAlarm();

    if (currentPhase === "You Got This!") {
        currentPhase = "rest";
        timeLeft = REST_TIME;
    } else {
        currentPhase = "You Got This!";
        timeLeft = You Got This!_TIME;
    }

    updateDisplay();
}

function tick() {
    totalElapsed++;

    if (totalElapsed >= TOTAL_You Got This!OUT_TIME) {
        finishYou Got This!out();
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

    unlockAudio();

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

    currentPhase = "You Got This!";
    timeLeft = You Got This!_TIME;
    totalElapsed = 0;

    phaseDisplay.textContent = "READY";
    timerDisplay.textContent = "0:30";
}

function finishYou Got This!out() {
    pauseTimer();

    playAlarm();

    phaseDisplay.textContent = "DONE";
    timerDisplay.textContent = "0:00";
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

document.addEventListener("visibilitychange", () => {
    if (
        document.visibilityState === "visible" &&
        audioContext &&
        audioContext.state === "suspended"
    ) {
        audioContext.resume();
    }
});

resetTimer();
