const clock = document.querySelector(".clock-time-container");

let hour = null;
let minutes = null;
let seconds = null;

const getHour = () => {
  let today = new Date();

  hour = today.getHours();
  minutes = today.getMinutes();
  seconds = today.getSeconds();
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = String(minutes).padStart(2, "0");
  hour = String(hour).padStart(2, "0");
};

const updateClock = () => {
  getHour();
  clock.innerHTML = `<div class="clock-time time">${hour}:${minutes}:${seconds}</div>`;
};

const clockInterval = setInterval(updateClock, 1000);

//cronometro
const stopWatch = document.querySelector(".stopwatch-time-container");
const stopWatchStart = document.querySelector(".stopwatch-start-btn");
const stopWatchStop = document.querySelector(".stopwatch-stop-btn");
const stopwatchRestart = document.querySelector(".stopwatch-restart-btn");
const stopWatchLap = document.querySelector(".stopwatch-lap-btn");
const stopWatchLapSet = document.querySelector(".laps");
const stopWatchTime = document.querySelector(".stopwatch-time");

let swHour = 0;
let swMinutes = 0;
let swSeconds = 0;
let stopWatchIntervalID = null;
let isRunning = false;
let lapCounter = 0;

const updateStopWatch = () => {
  swSeconds += 1;

  if (swSeconds == 60) {
    swSeconds = 0;
    swMinutes += 1;
  }
  if (swMinutes == 60) {
    swMinutes = 0;
    swHour += 1;
  }
  if (swHour == 24) {
    swHour = 0;
  }
  const fSwSeconds = String(swSeconds).padStart(2, "0");
  const fSwMinutes = String(swMinutes).padStart(2, "0");
  const fSwHours = String(swHour).padStart(2, "0");
  stopWatch.innerHTML = `<div class="stopwatch-time time">${fSwHours}:${fSwMinutes}:${fSwSeconds}</div>`;
};

const startStopWatch = () => {
  if (!isRunning) {
    stopWatchIntervalID = setInterval(updateStopWatch, 1000);
    isRunning = true;
    stopWatchStart.textContent = `Start`;
  }
};

const stopStopWatch = () => {
  if (isRunning) {
    clearInterval(stopWatchIntervalID);
    isRunning = false;
    stopWatchStart.textContent = `Continue`;
  }
};

const restartStopWatch = () => {
  stopStopWatch();
  swHour = 0;
  swMinutes = 0;
  swSeconds = 0;
  lapCounter = 0;
  stopWatch.innerHTML = `<div class="stopwatch-time time">0${swHour}:0${swMinutes}:0${swSeconds}</div>`;
  stopWatchStart.textContent = `Start`;
  stopWatchLapSet.textContent = `Laps: ${lapCounter} | Last Lap: 00:00:00`;
};

stopWatchStart.addEventListener("click", startStopWatch);
stopWatchStop.addEventListener("click", stopStopWatch);
stopwatchRestart.addEventListener("click", restartStopWatch);
stopWatchLap.addEventListener("click", () => {
  if (isRunning) {
    lapCounter += 1;
    stopWatchLapSet.textContent = `Laps: ${lapCounter} | Last Lap: ${stopWatch.textContent}`;
  }
});

//temporizador
const timer = document.querySelector(".timer-time-container");
const timerOptions = document.querySelectorAll(".timer-option");
const timerStart = document.querySelector(".timer-start-btn");
const timerStop = document.querySelector(".timer-stop-btn");
const timerRestart = document.querySelector(".timer-restart-btn");

let tSeconds = 0;
let tMinutes = 0;
let tHours = 0;
let timerIntervalID = null;

const timerSound = new Audio();
timerSound.src = "/Projects2.0/ProyectosJs/clock/sounds/Temporizador.mp3";

const updateTimer = () => {
  if (tHours === 0 && tMinutes === 0 && tSeconds === 0) {
    clearInterval(timerIntervalID);
  }
  tSeconds -= 1;
  if (tSeconds < 0) {
    if (tMinutes === 0) {
      if (tHours === 0) {
        timerSound.play();
        timerRestartCountdown();
        return;
      } else {
        tHours -= 1;
        tMinutes = 59;
      }
    } else {
      tMinutes -= 1;
    }

    tSeconds = 59;
  }
  const fTSeconds = String(tSeconds).padStart(2, "0");
  const fTMinutes = String(tMinutes).padStart(2, "0");
  const fTHours = String(tHours).padStart(2, "0");
  timer.innerHTML = `<div class="timer-time time">${fTHours}:${fTMinutes}:${fTSeconds}</div>`;
};

timerOptions.forEach((timerOption) => {
  timerOption.addEventListener("click", () => {
    const timerOpc = timerOption.textContent;
    const newTime = parseInt(timerOpc);
    tMinutes += newTime;
    if (tMinutes >= 60) {
      const extraHours = Math.floor(tMinutes / 60);
      tHours += extraHours;
      tMinutes = tMinutes % 60;
    }
    const fTSeconds = String(tSeconds).padStart(2, "0");
    const fTMinutes = String(tMinutes).padStart(2, "0");
    const fTHours = String(tHours).padStart(2, "0");
    timer.innerHTML = `<div class="timer-time time">${fTHours}:${fTMinutes}:${fTSeconds}</div>`;
  });
});

const timerStartCountdown = () => {
  timerIntervalID = setInterval(updateTimer, 1000);
};

const timerStopCountdown = () => {
  clearInterval(timerIntervalID);
  timerStart.textContent = `Continue`;
};

const timerRestartCountdown = () => {
  timerStopCountdown();
  tSeconds = 0;
  tMinutes = 0;
  tHours = 0;
  timer.innerHTML = `<div class="timer-time time">0${tHours}:0${tMinutes}:0${tSeconds}</div>`;
};

timerStart.addEventListener("click", timerStartCountdown);
timerStop.addEventListener("click", timerStopCountdown);
timerRestart.addEventListener("click", timerRestartCountdown);

//alarma para reloj

const alarmContainer = document.querySelector(".alarm-time-input");
const alarmSetTitle = document.querySelector(".alarm-set-title");
const alarmHours = document.getElementById("timer-input-hours");
const alarmMinutes = document.getElementById("timer-input-minutes");
const setAlarmBtn = document.querySelector(".alarm-set-btn");
const deleteAlarmBtn = document.querySelector(".delete-alarm-btn");

let alarmTimeoutID = null;
let isAlarmSet = false;

const alarmSound = new Audio();
alarmSound.src = "/Projects2.0/ProyectosJs/clock/sounds/Alarma.mp3";

const setAlarm = (newHour, newMinutes) => {
  const now = new Date();
  const alarmTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    newHour,
    newMinutes,
    0
  );

  if (alarmTime <= now) {
    cancelAlarm();
    return;
  }

  if (isAlarmSet) {
    return;
  }

  const timeDifference = alarmTime.getTime() - now.getTime();

  alarmTimeoutID = setTimeout(() => {
    isAlarmSet = false;
    alarmSound.play();
    alarmContainer.style.display = "flex";
    alarmSetTitle.textContent = `-SET YOUR ALARM-`;
  }, timeDifference);

  isAlarmSet = true;

  const faMinutes = String(newMinutes).padStart(2, "0");
  const faHours = String(newHour).padStart(2, "0");
  alarmContainer.style.display = "none";
  alarmSetTitle.textContent = `-ALARM SET TO ${faHours}:${faMinutes}-`;
};

const cancelAlarm = () => {
  if (isAlarmSet) {
    clearTimeout(alarmTimeoutID);
    alarmTimeoutID = null;
    isAlarmSet = false;

    alarmContainer.style.display = "flex";
    alarmSetTitle.textContent = `-SET YOUR ALARM-`;
  }
};

setAlarmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const hoursInput = parseInt(alarmHours.value, 10);
  const minutesInput = parseInt(alarmMinutes.value, 10);

  if (hoursInput > 23 || minutesInput > 59) {
    alarmHours.value = "";
    alarmMinutes.value = "";
    return;
  }

  setAlarm(hoursInput, minutesInput);
  alarmHours.value = "";
  alarmMinutes.value = "";
});

deleteAlarmBtn.addEventListener("click", cancelAlarm);
