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

let audioContext = null;


// ------------------------------------
// DISPLAY
// ------------------------------------

function updateDisplay() {

    if (currentPhase === "work") {
        phaseDisplay.textContent = `YOU GOT THIS! ${setNumber}`;
    } else {
        phaseDisplay.textContent = "REST";
    }

    timerDisplay.textContent =
        `0:${String(timeLeft).padStart(2, "0")}`;
}


// ------------------------------------
// AUDIO
// ------------------------------------

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


// ------------------------------------
// SWITCH BETWEEN EXERCISE AND REST
// ------------------------------------

function switchPhase() {

    // Sound the alarm
    playAlarm();

    if (currentPhase === "work") {

        currentPhase = "rest";
        timeLeft = REST_TIME;

    } else {

        currentPhase = "work";

        // Move to the next number
        setNumber++;

        // After 3, return to 1
        if (setNumber > 3) {
            setNumber = 1;
        }

        timeLeft = WORK_TIME;
    }

    updateDisplay();
}


// ------------------------------------
// TIMER
// ------------------------------------

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


// ------------------------------------
// START
// ------------------------------------

function startTimer() {

    if (isRunning) return;

    // Unlock sound from the START button.
    // The timer does NOT wait for audio.
    unlockAudio();

    isRunning = true;

    updateDisplay();

    timerInterval =
        setInterval(tick, 1000);
}


// ------------------------------------
// PAUSE
// ------------------------------------

function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;
    isRunning = false;
}


// ------------------------------------
// RESET
// ------------------------------------

function resetTimer() {

    pauseTimer();

    currentPhase = "work";
    setNumber = 1;
    timeLeft = WORK_TIME;
    totalElapsed = 0;

    phaseDisplay.textContent = "READY";
    timerDisplay.textContent = "0:30";
}


// ------------------------------------
// FINISH
// ------------------------------------

function finishWorkout() {

    pauseTimer();

    // Final alarm
    playAlarm();

    phaseDisplay.textContent = "DONE";
    timerDisplay.textContent = "0:00";
}


// ------------------------------------
// BUTTONS
// ------------------------------------

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


// ------------------------------------
// INITIAL SCREEN
// ------------------------------------

resetTimer();
