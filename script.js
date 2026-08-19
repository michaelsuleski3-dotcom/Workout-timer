const WORK_TIME = 30;
const REST_TIME = 20;
const TOTAL_WORKOUT_TIME = 15 * 60;

const phaseDisplay = document.getElementById("phase");
const timerDisplay = document.getElementById("timer");

const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

let currentPhase = "work";
let setNumber = 1;
let timeLeft = WORK_TIME;
let totalElapsed = 0;
let timerInterval = null;
let isRunning = false;

function updateDisplay() {
    if (currentPhase === "work") {
        phaseDisplay.textContent = `YOU GOT THIS! ${setNumber}`;
    } else {
        phaseDisplay.textContent = "REST";
    }

    timerDisplay.textContent =
        `0:${String(timeLeft).padStart(2, "0")}`;
}

function switchPhase() {
    if (currentPhase === "work") {
        currentPhase = "rest";
        timeLeft = REST_TIME;
    } else {
        currentPhase = "work";

        setNumber++;

        if (setNumber > 3) {
            setNumber = 1;
        }

        timeLeft = WORK_TIME;
    }

    updateDisplay();
}

function tick() {
    totalElapsed++;
    timeLeft--;

    if (totalElapsed >= TOTAL_WORKOUT_TIME) {
        finishWorkout();
        return;
    }

    if (timeLeft <= 0) {
        switchPhase();
    } else {
        updateDisplay();
    }
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    updateDisplay();

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
    setNumber = 1;
    timeLeft = WORK_TIME;
    totalElapsed = 0;

    phaseDisplay.textContent = "READY";
    timerDisplay.textContent = "0:30";
}

function finishWorkout() {
    pauseTimer();

    phaseDisplay.textContent = "DONE";
    timerDisplay.textContent = "0:00";
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

resetTimer();
