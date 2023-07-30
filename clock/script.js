/**
 * ? This code implements a clock application with features like a stopwatch, timer, and alarm.
 * * The clock displays the current time and updates every second.
 * * The stopwatch allows users to start, stop, and reset the elapsed time. It also supports lap functionality.
 * * The timer enables users to set a countdown time and start or stop the countdown.
 * * The alarm feature allows users to set an alarm for a specific hour and minutes, triggering an audio notification.
 * TODO: Implement UI styling and improve user experience
 * TODO: Add additional features such as multiple alarms and customization options
 * TODO: Enhance the timer functionality by adding preset time options
 * TODO: Refactor and optimize the code for better performance
 */

// ? get clock container
const clock = document.querySelector(".clock-time-container");

// ? set the hours, minutes and seconds for the clock
let hour = null;
let minutes = null;
let seconds = null;

// ? Function to retrieve the current hour, minutes, and seconds from the system clock
/**
 * @description - Retrieves the current hour, minutes, and seconds from the system clock
 * * Creates a new Date object representing the current date and time
 * * Extracts the hour, minutes, and seconds from the current time
 * * Formats the seconds with leading zeros if it's less than 10
 * * Formats the minutes and hour with leading zeros if necessary
 */

const getHour = () => {
  let today = new Date();

  hour = today.getHours();
  minutes = today.getMinutes();
  seconds = today.getSeconds();

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = String(minutes).padStart(2, "0");
  hour = String(hour).padStart(2, "0");
};

// ? Updates the clock display
/**
 * * Updates the clock display with the current time
 * * Calls the getHour function to retrieve the current hour, minutes, and seconds
 * * Updates the clock's HTML content with the formatted time
 */
const updateClock = () => {
  getHour();

  clock.innerHTML = `<div class="clock-time time">${hour}:${minutes}:${seconds}</div>`;
};

// ? call the updateClock function every second
const clockInterval = setInterval(updateClock, 1000);

// ? get the stopwatch elements
/**
 * * stopwatch container
 * * stopwatch start btn
 * * stopwatch stop btn
 * * stopwatch start btn
 * * stopwatch lap btn
 * * stopwatch lap container
 * * stopwatch time container
 */
const stopWatch = document.querySelector(".stopwatch-time-container");
const stopWatchStart = document.querySelector(".stopwatch-start-btn");
const stopWatchStop = document.querySelector(".stopwatch-stop-btn");
const stopwatchRestart = document.querySelector(".stopwatch-restart-btn");
const stopWatchLap = document.querySelector(".stopwatch-lap-btn");
const stopWatchLapSet = document.querySelector(".laps");
const stopWatchTime = document.querySelector(".stopwatch-time");

// ? set the stopwatch variables
let swHour = 0;
let swMinutes = 0;
let swSeconds = 0;
let lapCounter = 0;

// ? set the stopwatch interval ID
let stopWatchIntervalID = null;

// ? set running as false
let isRunning = false;

// ? Updates the stopwatch display
/**
 * @description - Updates the stopwatch display with the elapsed time
 * * Increments the stopwatch seconds by 1
 * * Checks if the stopwatch seconds reach 60, and resets them to 0 while incrementing the minutes
 * * Checks if the stopwatch minutes reach 60, and resets them to 0 while incrementing the hours
 * * Checks if the stopwatch hours reach 24 and resets them to 0
 * * Formats the stopwatch time components with leading zeros if necessary
 * * Updates the stopwatch's HTML content with the formatted time
 */

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

// ? Starts the stopwatch
/**
 * @description - Starts the stopwatch if it is not already running
 * * Sets an interval to call the updateStopWatch function every 1000 milliseconds (1 second)
 * * Updates the isRunning flag to true
 * * Updates the start button text content to "Start"
 */

const startStopWatch = () => {
  if (!isRunning) {
    stopWatchIntervalID = setInterval(updateStopWatch, 1000);

    isRunning = true;
    stopWatchStart.textContent = `Start`;
  }
};

// ? Stops the stopwatch
/**
 * @description - Stops the stopwatch if it is currently running
 * * Clears the interval set by startStopWatch function using clearInterval
 * * Updates the isRunning flag to false
 * * Updates the start button text content to "Continue"
 */

const stopStopWatch = () => {
  if (isRunning) {
    clearInterval(stopWatchIntervalID);

    isRunning = false;

    stopWatchStart.textContent = `Continue`;
  }
};

// ? Restarts the stopwatch
/**
 * @description - Restarts the stopwatch by resetting all the values
 * * Calls stopStopWatch function to stop the stopwatch if it is running
 * * Resets the stopwatch hour, minutes, seconds, and lap counter to 0
 * * Updates the stopwatch HTML content with the initial time value
 * * Updates the start button text content to "Start"
 * * Updates the lap set text content to the initial lap counter value
 */

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

// ? add the listeners to the stopwatch btns
stopWatchStart.addEventListener("click", startStopWatch);
stopWatchStop.addEventListener("click", stopStopWatch);
stopwatchRestart.addEventListener("click", restartStopWatch);

// ? Event listener for the lap button
/**
 * @description - Handles the click event on the lap button
 * * Checks if the stopwatch is currently running
 * * If running, increments the lap counter by 1
 * * Updates the lap set text content with the updated lap counter value and the last lap time from the stopwatch
 */

stopWatchLap.addEventListener("click", () => {
  if (isRunning) {
    lapCounter += 1;

    stopWatchLapSet.textContent = `Laps: ${lapCounter} | Last Lap: ${stopWatch.textContent}`;
  }
});

// ! timer code

/**
 * ? get the timer elements
 * * timer container
 * * timer time options -btns-
 * * timer start btn
 * * timer stop btn
 * * timer restart btn
 */
const timer = document.querySelector(".timer-time-container");
const timerOptions = document.querySelectorAll(".timer-option");
const timerStart = document.querySelector(".timer-start-btn");
const timerStop = document.querySelector(".timer-stop-btn");
const timerRestart = document.querySelector(".timer-restart-btn");

// ? set timer time variables
let tSeconds = 0;
let tMinutes = 0;
let tHours = 0;

// ? set the timer interval ID
let timerIntervalID = null;

// ? create the timer audio
const timerSound = new Audio();
timerSound.src = "sounds/Temporizador.mp3";

// ? Function to update the timer
/**
 * @description - Updates the timer display with the current time
 * * Checks if the timer has reached zero (tHours, tMinutes, tSeconds all equal to 0)
 * * If so, clears the timer interval
 * * Decrements the timer by 1 second
 * * If tSeconds becomes negative, adjusts tMinutes and tHours accordingly
 * * Formats the timer values with leading zeros if necessary
 * * Updates the timer HTML content with the formatted time
 */

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

// ? Event listeners for timer options
/**
 * @description - Handles the click event on each timer option
 * * Retrieves the selected timer option's text content
 * * Parses the content to an integer representing the new time value
 * * Adds the new time to the current tMinutes
 * * If tMinutes exceeds 60, calculates the extra hours and adjusts tHours and tMinutes accordingly
 * * Formats the timer values with leading zeros if necessary
 * * Updates the timer HTML content with the formatted time
 */

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

// ? Timer countdown functions

/**
 * @description - Starts the timer countdown
 * * Sets an interval to call the updateTimer function every second
 * * Updates the timer start button text to "Start"
 */

const timerStartCountdown = () => {
  timerIntervalID = setInterval(updateTimer, 1000);

  timerStart.textContent = `Start`;
};

/**
 * @description - Stops the timer countdown
 * * Clears the interval set by timerStartCountdown
 * * Updates the timer start button text to "Continue"
 */

const timerStopCountdown = () => {
  clearInterval(timerIntervalID);

  timerStart.textContent = `Continue`;
};

/**
 * @description - Restarts the timer countdown
 * * Calls timerStopCountdown to clear the interval
 * * Resets the timer values (tSeconds, tMinutes, tHours) to zero
 * * Updates the timer HTML content with the initial time
 */

const timerRestartCountdown = () => {
  timerStopCountdown();

  tSeconds = 0;
  tMinutes = 0;
  tHours = 0;

  timer.innerHTML = `<div class="timer-time time">0${tHours}:0${tMinutes}:0${tSeconds}</div>`;
};

// ? add the listeners to the timer btns
timerStart.addEventListener("click", timerStartCountdown);
timerStop.addEventListener("click", timerStopCountdown);
timerRestart.addEventListener("click", timerRestartCountdown);

// ! alarm code

/**
 * ? get the alarm elements
 * * alarm container
 * * alarm title container
 * * alarm hours input
 * * alarm minutes input
 * * set alarm btn
 * * delete alarm btn
 */
const alarmContainer = document.querySelector(".alarm-time-input");
const alarmSetTitle = document.querySelector(".alarm-set-title");
const alarmHours = document.getElementById("timer-input-hours");
const alarmMinutes = document.getElementById("timer-input-minutes");
const setAlarmBtn = document.querySelector(".alarm-set-btn");
const deleteAlarmBtn = document.querySelector(".delete-alarm-btn");

// ? alarm timeout ID
let alarmTimeoutID = null;
// ? set alarm boolean as false
let isAlarmSet = false;

// ? create the alarm audio
const alarmSound = new Audio();
alarmSound.src = "sounds/Alarma.mp3";

// ? Set the alarm
/**
 * @description - Sets the alarm for the specified hour and minutes
 * * Retrieves the current date and time using the new Date() constructor
 * * Creates a new Date object representing the alarm time based on the specified hour and minutes
 * * Compares the alarm time with the current time to check if the alarm should be canceled
 * * If the alarm time is in the past, cancels the alarm by calling cancelAlarm function
 * * Checks if the alarm is already set and returns if it is
 * * Calculates the time difference between the alarm time and current time
 * * Sets a timeout to trigger the alarm when the time difference elapses
 * * Updates the necessary variables and elements to indicate that the alarm is set
 * * Displays the alarm set time in the UI
 */

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

// ? Cancel the alarm
/**
 * @description - Cancels the currently set alarm
 * * Checks if the alarm is set
 * * Clears the alarm timeout using clearTimeout
 * * Resets the necessary variables and elements to their initial state
 * * Displays the default alarm set title in the UI
 */

const cancelAlarm = () => {
  if (isAlarmSet) {
    clearTimeout(alarmTimeoutID);
    alarmTimeoutID = null;
    isAlarmSet = false;

    alarmContainer.style.display = "flex";
    alarmSetTitle.textContent = `-SET YOUR ALARM-`;
  }
};

// ? Event listener for setting the alarm
/**
 * @description - Handles the click event for setting the alarm
 * * Prevents the default form submission behavior
 * * Retrieves the input values for hours and minutes
 * * Validates the input values for valid hour and minute ranges
 * * Calls the setAlarm function with the input hour and minutes
 * * Resets the input fields to their initial state
 */

setAlarmBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const hoursInput = parseInt(alarmHours.value, 10);
  const minutesInput = parseInt(alarmMinutes.value, 10);

  if (
    hoursInput > 23 ||
    hoursInput <= 0 ||
    minutesInput > 59 ||
    minutesInput <= 0 ||
    alarmHours.value == "" ||
    alarmMinutes.value == ""
  ) {
    alarmHours.value = "";
    alarmMinutes.value = "";
    return;
  }

  setAlarm(hoursInput, minutesInput);

  alarmHours.value = "";
  alarmMinutes.value = "";
});

// ? add event listener for cancelling the alarm
deleteAlarmBtn.addEventListener("click", cancelAlarm);
