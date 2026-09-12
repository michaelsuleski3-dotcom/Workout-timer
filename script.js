let WORK_TIME = 30;
let REST_TIME = 20;
let TOTAL_WORKOUT_MINUTES = 15;

const ALARM_TIME = 2000; // 2 seconds — DO NOT CHANGE

const phaseDisplay = document.getElementById("phase");
const timerDisplay = document.getElementById("timer");

const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

const workMinusButton = document.getElementById("work-minus");
const workPlusButton = document.getElementById("work-plus");
const workTimeDisplay = document.getElementById("work-time-display");

const restMinusButton = document.getElementById("rest-minus");
const restPlusButton = document.getElementById("rest-plus");
const restTimeDisplay = document.getElementById("rest-time-display");

const totalMinusButton = document.getElementById("total-minus");
const totalPlusButton = document.getElementById("total-plus");
const totalTimeDisplay = document.getElementById("total-time-display");

let currentPhase = "work";
let setNumber = 1;
let timeLeft = WORK_TIME;
let totalElapsed = 0;

let timerInterval = null;
let transitionTimeout = null;
let isRunning = false;
let isTransitioning = false;

let audioContext = null;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateSettingDisplays() {
    workTimeDisplay.textContent = `${WORK_TIME} sec`;
    restTimeDisplay.textContent = `${REST_TIME} sec`;
    totalTimeDisplay.textContent = `${TOTAL_WORKOUT_MINUTES} min`;
}

function updateDisplay() {
    if (currentPhase === "work") {
        phaseDisplay.textContent = `YOU GOT THIS! ${setNumber}`;
    } else {
        phaseDisplay.textContent = "REST";
    }

    timerDisplay.textContent = formatTime(timeLeft);
}

function unlockAudio() {
    try {
        if (!audioContext) {
            audioContext =
                new (window.AudioContext ||
                     window.webkitAudioContext)();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
    } catch (error) {
        console.log("Audio unavailable");
    }
}

function playAlarm() {
    if (!audioContext) return;

    try {
        const startTime = audioContext.currentTime;

        // Four quick beeps over approximately 2 seconds
        for (let i = 0; i < 4; i++) {
            const oscillator =
                audioContext.createOscillator();

            const gainNode =
                audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 900;
            oscillator.type = "sine";

            const beepStart =
                startTime + (i * 0.5);

            const beepEnd =
                beepStart + 0.3;

            gainNode.gain.setValueAtTime(
                0.7,
                beepStart
            );

            gainNode.gain.setValueAtTime(
                0,
                beepEnd
            );

            oscillator.start(beepStart);
            oscillator.stop(beepEnd);
        }
    } catch (error) {
        console.log("Alarm unavailable");
    }
}

function prepareNextPhase() {
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
}

function transitionToNextPhase() {
    clearInterval(timerInterval);
    timerInterval = null;

    isTransitioning = true;

    // Sound alarm first
    playAlarm();

    transitionTimeout = setTimeout(() => {
        if (!isRunning) return;

        // Change to the next phase AFTER the alarm
        prepareNextPhase();

        updateDisplay();

        isTransitioning = false;

        // Start counting down AFTER the alarm
        timerInterval =
            setInterval(tick, 1000);

    }, ALARM_TIME);
}

function tick() {
    timeLeft--;
    totalElapsed++;

    if (
        totalElapsed >=
        TOTAL_WORKOUT_MINUTES * 60
    ) {
        finishWorkout();
        return;
    }

    if (timeLeft <= 0) {
        timerDisplay.textContent = "0:00";
        transitionToNextPhase();
    } else {
        updateDisplay();
    }
}

function startTimer() {
    if (isRunning) return;

    unlockAudio();

    isRunning = true;

    updateDisplay();

    timerInterval =
        setInterval(tick, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    clearTimeout(transitionTimeout);

    timerInterval = null;
    transitionTimeout = null;

    isRunning = false;
    isTransitioning = false;
}

function resetTimer() {
    pauseTimer();

    currentPhase = "work";
    setNumber = 1;

    timeLeft = WORK_TIME;
    totalElapsed = 0;

    phaseDisplay.textContent = "READY";
    timerDisplay.textContent = formatTime(WORK_TIME);

    updateSettingDisplays();
}

function finishWorkout() {
    clearInterval(timerInterval);
    clearTimeout(transitionTimeout);

    timerInterval = null;
    transitionTimeout = null;

    isRunning = false;
    isTransitioning = false;

    playAlarm();

    phaseDisplay.textContent = "DONE";
    timerDisplay.textContent = "0:00";
}

function changeWorkTime(amount) {
    if (isRunning) return;

    WORK_TIME += amount;

    if (WORK_TIME < 5) {
        WORK_TIME = 5;
    }

    if (WORK_TIME > 120) {
        WORK_TIME = 120;
    }

    updateSettingDisplays();

    if (currentPhase === "work") {
        timeLeft = WORK_TIME;
        updateDisplay();
    }
}

function changeRestTime(amount) {
    if (isRunning) return;

    REST_TIME += amount;

    if (REST_TIME < 5) {
        REST_TIME = 5;
    }

    if (REST_TIME > 120) {
        REST_TIME = 120;
    }

    updateSettingDisplays();

    if (currentPhase === "rest") {
        timeLeft = REST_TIME;
        updateDisplay();
    }
}

function changeTotalTime(amount) {
    if (isRunning) return;

    TOTAL_WORKOUT_MINUTES += amount;

    if (TOTAL_WORKOUT_MINUTES < 5) {
        TOTAL_WORKOUT_MINUTES = 5;
    }

    if (TOTAL_WORKOUT_MINUTES > 120) {
        TOTAL_WORKOUT_MINUTES = 120;
    }

    updateSettingDisplays();
}

startButton.addEventListener(
    "click",
    startTimer
);

pauseButton.addEventListener(
    "click",
    pauseTimer
);

resetButton.addEventListener(
    "click",
    resetTimer
);

workMinusButton.addEventListener(
    "click",
    () => changeWorkTime(-5)
);

workPlusButton.addEventListener(
    "click",
    () => changeWorkTime(5)
);

restMinusButton.addEventListener(
    "click",
    () => changeRestTime(-5)
);

restPlusButton.addEventListener(
    "click",
    () => changeRestTime(5)
);

totalMinusButton.addEventListener(
    "click",
    () => changeTotalTime(-5)
);

totalPlusButton.addEventListener(
    "click",
    () => changeTotalTime(5)
);

resetTimer();
