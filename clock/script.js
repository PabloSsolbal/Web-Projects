// este codigo crea una aplicacion de reloj que incluye un cronometro con marcado de vueltas, un reloj en tiempo real con funcion de alarma y un temporizador funcional

//reloj
//para empezar a crear el reloj primero construimos el contenedor de este
const clock = document.querySelector(".clock-time-container");
//creamos las variables que vamos a utilizar para almacenar las horas, minutos y segundos del reloj
let hour = null;
let minutes = null;
let seconds = null;
//construimos la funcion para obtener y formatear las horas, minutos y segundos
const getHour = () => {
  //obtenemos la fecha actual y la guardamos en una variable
  let today = new Date();

  //obtenemos las horas, minutos y segundos de la fecha actual y las guardamos en las variables correspondientes
  hour = today.getHours();
  minutes = today.getMinutes();
  seconds = today.getSeconds();
  //formateamos las horas, minutos y segundos para que sean de dos digitos y que sean de tipo string
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = String(minutes).padStart(2, "0");
  hour = String(hour).padStart(2, "0");
};

//construimos la funcion para actualizar el reloj
const updateClock = () => {
  //llamamos a la funcion para obtener las horas, minutos y segundos
  getHour();
  //actualizamos el reloj con las horas, minutos y segundos
  clock.innerHTML = `<div class="clock-time time">${hour}:${minutes}:${seconds}</div>`;
};

//creamos un intervalo para actualizar el reloj cada segundo
const clockInterval = setInterval(updateClock, 1000);

//cronometro
//construimos los elementos del cronometro
//el contenedor
const stopWatch = document.querySelector(".stopwatch-time-container");
//el boton de inicio
const stopWatchStart = document.querySelector(".stopwatch-start-btn");
//el boton de pausa
const stopWatchStop = document.querySelector(".stopwatch-stop-btn");
//el boton de reinicio
const stopwatchRestart = document.querySelector(".stopwatch-restart-btn");
//el boton de vueltas
const stopWatchLap = document.querySelector(".stopwatch-lap-btn");
//el contenedor de las vueltas
const stopWatchLapSet = document.querySelector(".laps");
//el contenedor del tiempo
const stopWatchTime = document.querySelector(".stopwatch-time");

//creamos las variables a utilizar para almacenar las horas, minutos y segundos del cronometro
let swHour = 0;
let swMinutes = 0;
let swSeconds = 0;
//creamos una variable para el intervalo del cronometro
let stopWatchIntervalID = null;
//una para verificar si esta corriendo
let isRunning = false;
//y un contador de vueltas
let lapCounter = 0;

//creamos la funcion para actualizar las horas, minutos y segundos del cronometro
const updateStopWatch = () => {
  //primero aumentamos los segundos
  swSeconds += 1;
  //hacemos un if para que si los segundos llegan a 60, los minutos sean aumentados y los segundos sean 0
  if (swSeconds == 60) {
    swSeconds = 0;
    swMinutes += 1;
  }
  //hacemos otro if para que si los minutos llegan a 60, las horas sean aumentadas y los minutos sean 0
  if (swMinutes == 60) {
    swMinutes = 0;
    swHour += 1;
  }
  //hacemos un if para que si las horas llegan a 24, las horas sean 0
  if (swHour == 24) {
    swHour = 0;
  }
  //formateamos las horas, minutos y segundos para que sean de dos digitos y que sean de tipo string
  const fSwSeconds = String(swSeconds).padStart(2, "0");
  const fSwMinutes = String(swMinutes).padStart(2, "0");
  const fSwHours = String(swHour).padStart(2, "0");
  //actualizamos el cronometro con las horas, minutos y segundo
  stopWatch.innerHTML = `<div class="stopwatch-time time">${fSwHours}:${fSwMinutes}:${fSwSeconds}</div>`;
};
//construimos la funcion para iniciar el cronometro
const startStopWatch = () => {
  //primero comprobamos que el cronometro no este corriendo
  if (!isRunning) {
    //si no lo esta, iniciamos el intervalo del cronometro
    stopWatchIntervalID = setInterval(updateStopWatch, 1000);
    //actualizamos el cronometro a 'corriendo'
    isRunning = true;
    stopWatchStart.textContent = `Start`;
  }
};
//construimos la funcion para pausar el cronometro
const stopStopWatch = () => {
  //comprobamos que este corriendo
  if (isRunning) {
    //si lo esta, detenemos el intervalo del cronometro
    clearInterval(stopWatchIntervalID);
    //actualizamos el cronometro a 'parado'
    isRunning = false;
    //cambiamos el boton start a continue por si quieren reanudar la cuenta
    stopWatchStart.textContent = `Continue`;
  }
};
//construimos la funcion para reiniciar el cronometro
const restartStopWatch = () => {
  //llamamos a la funcion para parar el cronometro
  stopStopWatch();
  //reiniciamos las variables de las horas, minutos y segundo
  swHour = 0;
  swMinutes = 0;
  swSeconds = 0;
  lapCounter = 0;
  //cambiamos el contenido del contenedor del cronometro a 0:00:00
  stopWatch.innerHTML = `<div class="stopwatch-time time">0${swHour}:0${swMinutes}:0${swSeconds}</div>`;
  //cambiamos el contenido del boton start
  stopWatchStart.textContent = `Start`;
  //cambiamos el contenido del contenedor de las vueltas a 0
  stopWatchLapSet.textContent = `Laps: ${lapCounter} | Last Lap: 00:00:00`;
};
//creamos las llamadas a las funciones para iniciar, pausar y reiniciar el cronometro en sus respectivos botones
stopWatchStart.addEventListener("click", startStopWatch);
stopWatchStop.addEventListener("click", stopStopWatch);
stopwatchRestart.addEventListener("click", restartStopWatch);
//creamos la funcion para guardar las vueltas del cronometro
stopWatchLap.addEventListener("click", () => {
  //comprobamos que este corriendo
  if (isRunning) {
    //si lo esta sumamos una vuelta al contador de vueltas
    lapCounter += 1;
    //actualizamos el contenido del contenedor de las vuelta
    stopWatchLapSet.textContent = `Laps: ${lapCounter} | Last Lap: ${stopWatch.textContent}`;
  }
});

//temporizador
//construimos los elementos del temporizador
//el contenedor
const timer = document.querySelector(".timer-time-container");
//el contenedor de las opciones
const timerOptions = document.querySelectorAll(".timer-option");
//el boton de inicio
const timerStart = document.querySelector(".timer-start-btn");
//el boton de pausa
const timerStop = document.querySelector(".timer-stop-btn");
//el boton de reinicio
const timerRestart = document.querySelector(".timer-restart-btn");

//creamos las variables a utilizar para almacenar las horas, minutos y segundos del temporizador
let tSeconds = 0;
let tMinutes = 0;
let tHours = 0;
//creamos una variable para el intervalo del temporizador
let timerIntervalID = null;

//creamos el audio del temporizador
const timerSound = new Audio();
timerSound.src = "/Projects2.0/ProyectosJs/clock/sounds/Temporizador.mp3";

//creamos la funcion para actualizar las horas, minutos y segundos del temporizador
const updateTimer = () => {
  //comprobamos si las horas, minutos y segundos son iguales a 0, si lo son, borramos el intervalo
  if (tHours === 0 && tMinutes === 0 && tSeconds === 0) {
    clearInterval(timerIntervalID);
  }
  //vamos reduciendo los segundos en 1
  tSeconds -= 1;
  //hacemos las comprobaciones para determinar el flujo del temprizador
  if (tSeconds < 0) {
    if (tMinutes === 0) {
      if (tHours === 0) {
        //si las horas, minutos y segundos son iguales a 0, borramos el intervalo y reproducimos el sonido del temporizador
        timerSound.play();
        timerRestartCountdown();
        return;
      } else {
        //si las horas no son iguales a 0, restamos una hora y los minutos a 59
        tHours -= 1;
        tMinutes = 59;
      }
    } else {
      //si los minutos no son iguales a 0, restamos un minuto
      tMinutes -= 1;
    }
    //cambiamos los segundos a 59
    tSeconds = 59;
  }
  //formateamos las horas, minutos y segundos para que sean de dos digitos y que sean de tipo string
  const fTSeconds = String(tSeconds).padStart(2, "0");
  const fTMinutes = String(tMinutes).padStart(2, "0");
  const fTHours = String(tHours).padStart(2, "0");
  //cambiamos el contenido del contenedor del temporizador
  timer.innerHTML = `<div class="timer-time time">${fTHours}:${fTMinutes}:${fTSeconds}</div>`;
};

//creamos las escuchas para cada boton de la opcion del temporizador
timerOptions.forEach((timerOption) => {
  //creamos la funcion para cambiar las horas, minutos y segundos del temporizador segun la opcion seleccionada
  timerOption.addEventListener("click", () => {
    //obtenemos el contenido de la opcion seleccionada
    const timerOpc = timerOption.textContent;
    //lo convertimos a un numero y lo almacenamos en una variable
    const newTime = parseInt(timerOpc);
    //almacenamos el tiempo en la variable minutos
    tMinutes += newTime;
    if (tMinutes >= 60) {
      //si minutos mayor o igual a 60, comprobamos cuantas horas hay que sumar
      //lo hacemos con la funcion floor para redondear el numero dividiendo los minutos entre 60
      const extraHours = Math.floor(tMinutes / 60);
      //sumamos las horas a las horas que hay que sumar
      tHours += extraHours;
      //establecemos los minutos restantes con el residuo de la division entre 60
      tMinutes = tMinutes % 60;
    }
    //formateamos las horas, minutos y segundos para que sean de dos digitos y que sean de tipo string
    const fTSeconds = String(tSeconds).padStart(2, "0");
    const fTMinutes = String(tMinutes).padStart(2, "0");
    const fTHours = String(tHours).padStart(2, "0");
    //cambiamos el contenido del contenedor del temporizador
    timer.innerHTML = `<div class="timer-time time">${fTHours}:${fTMinutes}:${fTSeconds}</div>`;
  });
});

//creamos la funcion para iniciar el temporizador
const timerStartCountdown = () => {
  //almacenamos el intervalo en una variable
  timerIntervalID = setInterval(updateTimer, 1000);
};

//creamos la funcion para pausar el temporizador
const timerStopCountdown = () => {
  //borramos el intervalo
  clearInterval(timerIntervalID);
  //cambiamos el texto del boton start a continue
  timerStart.textContent = `Continue`;
};

//creamos la funcion para reiniciar el temporizador
const timerRestartCountdown = () => {
  //paramos el temporizador
  timerStopCountdown();
  //reiniciamos las variables
  tSeconds = 0;
  tMinutes = 0;
  tHours = 0;
  //cambiamos el contenido del contenedor del temporizador
  timer.innerHTML = `<div class="timer-time time">0${tHours}:0${tMinutes}:0${tSeconds}</div>`;
};

//agregamos las escuchas a los botones del temporizador
timerStart.addEventListener("click", timerStartCountdown);
timerStop.addEventListener("click", timerStopCountdown);
timerRestart.addEventListener("click", timerRestartCountdown);

//alarma para reloj
//creamos los elementos de la alarma
//el contenedor de la alarma
const alarmContainer = document.querySelector(".alarm-time-input");
//el titulo de la alarma
const alarmSetTitle = document.querySelector(".alarm-set-title");
//el input para la hora
const alarmHours = document.getElementById("timer-input-hours");
//el input para los minutos
const alarmMinutes = document.getElementById("timer-input-minutes");
//el boton para iniciar la alarma
const setAlarmBtn = document.querySelector(".alarm-set-btn");
//el boton para borrar la alarma
const deleteAlarmBtn = document.querySelector(".delete-alarm-btn");

//creamos la variablea para almacenar el timeout de la alarma
let alarmTimeoutID = null;
//y  la variable para saber si la alarma esta activa
let isAlarmSet = false;

//creamos el audio de la alarma
const alarmSound = new Audio();
alarmSound.src = "/Projects2.0/ProyectosJs/clock/sounds/Alarma.mp3";

//construimos la funcion para crear la alarma que recibe como parametros la hora y minutos
const setAlarm = (newHour, newMinutes) => {
  //creamos un nueva fecha para establecer el tiempo del timeout
  const now = new Date();
  //construimos la fecha con los valores de la hora y minutos recibidos
  const alarmTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    newHour,
    newMinutes,
    0
  );
  //hacemos comprobaciones para saber si la hora ingresada es menor o igual a la hora actual
  if (alarmTime <= now) {
    //si lo es cancelamos la alarma ya que la hora ya paso
    cancelAlarm();
    return;
  }
  //tambien comprobamos si la alarma ya esta activa
  if (isAlarmSet) {
    return;
  }
  //construimos la diferencia de tiempo para el timeout
  const timeDifference = alarmTime.getTime() - now.getTime();
  //creamos el timeout y lo almacenamos en su respectiva variable
  alarmTimeoutID = setTimeout(() => {
    //cuando el contador acabe colocamos la alarma como no activa
    isAlarmSet = false;
    //suena el audio de la alarma
    alarmSound.play();
    //y el contenedor de titulo vuelve a su estado inicial
    alarmContainer.style.display = "flex";
    alarmSetTitle.textContent = `-SET YOUR ALARM-`;
  }, timeDifference);
  //al crear la alarma la activamos
  isAlarmSet = true;
  //formateamos las horas y minutos para que sean de dos digitos y que sean de tipo string
  const faMinutes = String(newMinutes).padStart(2, "0");
  const faHours = String(newHour).padStart(2, "0");
  //cambiamos el contenido del contenedor del titulo de la alarma y escondemos los inputs
  alarmContainer.style.display = "none";
  alarmSetTitle.textContent = `-ALARM SET TO ${faHours}:${faMinutes}-`;
};
//construimos la funcion para borrar la alarma
const cancelAlarm = () => {
  //comprobamos que la alarma este activa
  if (isAlarmSet) {
    //si lo esta borramos el timeout y la alarma
    clearTimeout(alarmTimeoutID);
    alarmTimeoutID = null;
    isAlarmSet = false;
    //devolvemos el titulo a su estado inicial y los inputs a su estado inicial
    alarmContainer.style.display = "flex";
    alarmSetTitle.textContent = `-SET YOUR ALARM-`;
  }
};
//creamos la escucha para los botones de la alarma
setAlarmBtn.addEventListener("click", (e) => {
  //prevenimos el comportamiento por defecto del boton
  e.preventDefault();
  //convertimos los valores de los inputs a enteros
  const hoursInput = parseInt(alarmHours.value, 10);
  const minutesInput = parseInt(alarmMinutes.value, 10);
  //validamos los valores de los inputs para que esten dentro del rango de 0 a 23 y de 0 a 59
  if (hoursInput > 23 || minutesInput > 59) {
    //si lo estan reseteamos los inputs y salimos de la funcion
    alarmHours.value = "";
    alarmMinutes.value = "";
    return;
  }
  //si son validos llamamos a la funcion de alarma y le pasamos la hora y minuto ingresado
  setAlarm(hoursInput, minutesInput);
  //posterior reseteamos los inputs
  alarmHours.value = "";
  alarmMinutes.value = "";
});
//la escucha para el boton de borrar la alarma
deleteAlarmBtn.addEventListener("click", cancelAlarm);
