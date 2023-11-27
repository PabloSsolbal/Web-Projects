import { urls } from "./config.js";
import {
  showNotification,
  failure,
  success,
  body,
  incorrect,
  modifyUserData,
  addRecord,
  updateUserPointsAndCoins,
} from "./script.js";
import { loseModal } from "./hangman.js";

export const riddlerMenu = document.querySelector(".RiddlermainMenu");
const riddlerOptions = document.querySelectorAll(".riddlerOption");
const riddlerDifficultBtns = document.querySelectorAll(".dificultBtnRiddler");
const riddlerLoseModal = loseModal.cloneNode(true);
const riddlerResults = document.querySelector(".riddler-results");

let difficult = "facil";
let riddlerUrl = urls.RiddlerData;
let Answer = null;
let Attempts = 0;
let basePoints = 0;
let record = 0;

export const updateRiddlerRecord = () => {
  let maxrecord = JSON.parse(localStorage.getItem("RiddlerStrike"));
  let formatedRecord = maxrecord < 10 ? `0${maxrecord}` : maxrecord;
  document.querySelector(
    ".riddler-highscore"
  ).innerHTML = `<span class="DLevel">Racha Maxima:<span/> ${formatedRecord}`;
};

const saveRecord = () => {
  if (JSON.parse(localStorage.getItem("RiddlerStrike")) < record) {
    localStorage.setItem("RiddlerStrike", JSON.stringify(record));
    addRecord({ record: record }, "riddles");
    showNotification("Nuevo Record");
  }
};

const recordAdd = () => {
  let formatedRecord = record < 10 ? `0${record}` : record;
  riddlerResults.innerHTML = `<span>Maxima Actual:</span> ${formatedRecord}`;
};

const updateAttempts = () => {
  const app = document.querySelector(".RiddlerApp");
  app.querySelector(
    ".riddlerAttemps"
  ).innerHTML = `<span>Intentos:</span> ${Attempts}`;
};

const checkAnswer = () => {
  let Attemp = document.getElementById("AnswersInput");
  if (Attemp.value === Answer) {
    Attemp.value = "";
    win();
  } else {
    Attemp.value = "";
    Attempts--;
    incorrect.play();
    updateAttempts();
    if (Attempts === 0) {
      failure.play();
      lose();
    }
  }
};

const setBasePointsValue = () => {
  const values = {
    facil: 5,
    media: 10,
    dificil: 15,
    muy_dificil: 20,
  };
  basePoints = values[difficult];
};

const buildRiddleGame = ({ riddle, answer, attempts }) => {
  const app = document.querySelector(".RiddlerApp");
  app.querySelector(
    ".riddlerAttemps"
  ).innerHTML = `<span>Intentos:</span> ${attempts}`;
  app.querySelector(".riddleContainer p").textContent = riddle;
  app.querySelector(
    ".hint"
  ).innerHTML = `<span>Cantidad de letras:</span> ${answer.length}`;
  Answer = answer;
  Attempts = attempts;
  setBasePointsValue();
  app.classList.remove("hidden");
  riddlerMenu.classList.add("hidden");
};

const getRiddle = async (url) => {
  let response = await fetch(url);
  let data = await response.json();
  buildRiddleGame(await data);
};

const createLoseModal = () => {
  riddlerLoseModal.querySelector(
    ".show-word-container"
  ).innerHTML = `<span>La respuesta era:</span> ${Answer}`;
  localStorage.getItem("Animations") === "false"
    ? (riddlerLoseModal.classList.remove("glow"),
      riddlerLoseModal.querySelector(".modal-img").classList.remove("glow"))
    : (riddlerLoseModal.classList.add("glow"),
      riddlerLoseModal.querySelector(".modal-img").classList.add("glow"));
  body.appendChild(riddlerLoseModal);
};

const lose = () => {
  failure.play();
  createLoseModal();
  record = 0;
  riddlerLoseModal.classList.remove("hidden");
};

const win = () => {
  success.play();
  record += basePoints;
  modifyUserData("Points", Math.max(basePoints + Attempts, 0));
  modifyUserData("GatoCoins", Math.max(basePoints * 2 + Attempts, 0));
  setTimeout(() => {
    riddlerMenu.prepend(updateUserPointsAndCoins());
    showNotification(
      `Ganaste ${Math.max(basePoints * 2 + Attempts, 0)} GatoCoins`
    );
    stop();
  }, 1250);
};

const stop = () => {
  document.querySelector(".RiddlerApp").classList.add("hidden");
  riddlerMenu.classList.remove("hidden");
  recordAdd();
  saveRecord();
  updateRiddlerRecord();
};

document.addEventListener("DOMContentLoaded", () => {
  riddlerLoseModal
    .querySelector("#Close-hangman-modal")
    .setAttribute("id", "Close-riddler-modal");
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".riddler-check")) {
    checkAnswer();
  }
  if (e.target.matches(".riddler-stop")) {
    stop();
  }
  if (e.target.matches("#Close-riddler-modal")) {
    body.removeChild(riddlerLoseModal);
    stop();
  }
});

riddlerDifficultBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    difficult = btn.getAttribute("data-difficult");
    showNotification(`Dificultad ${btn.textContent} establecida`);
  })
);

riddlerOptions.forEach((option) =>
  option.addEventListener("click", () => {
    if (option.classList.contains("locked")) {
      return;
    }
    let url = `${riddlerUrl}${option.textContent.toLowerCase()}?difficult=${difficult}`;
    getRiddle(url);
  })
);
