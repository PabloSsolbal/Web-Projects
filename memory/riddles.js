import { urls } from "./config.js";
import {
  showNotification,
  failure,
  success,
  body,
  incorrect,
  modifyUserData,
  updateUserPointsAndCoins,
} from "./script.js";
import { addRecord } from "./user.js";
import { loseModal, keyBoard } from "./hangman.js";

// ? DOM elements
export const riddlerMenu = document.querySelector(".RiddlermainMenu");
const riddlerOptions = document.querySelectorAll(".riddlerOption");
const riddlerDifficultBtns = document.querySelectorAll(".dificultBtnRiddler");
const riddlerLoseModal = loseModal.cloneNode(true);
const riddlerResults = document.querySelector(".riddler-results");
const riddlerMaxRecord = document.querySelector(".riddler-highscore");
const riddlerKeyboard = document.querySelector(".riddlerKeyBoard");
let Attemp = document.getElementById("AnswersInput");

// ? Variables to control the state of the game
let difficult = "facil";
let riddlerUrl = urls.RiddlerData;
let Answer = null;
let Attempts = 0;
let basePoints = 0;
let record = 0;

// ? Valid characters for the Riddler game.
const keyBoardCharacters = "qwertyuiopasdfghjklzxcvbnm ↩⏎";

/**
 * ? Update the displayed Riddler max record based on the stored value in localStorage.
 *
 * @function
 *
 * @example
 * * updateRiddlerRecord();
 * * This function updates the displayed Riddler max record on the page.
 */
export const updateRiddlerRecord = () => {
  let maxrecord = JSON.parse(localStorage.getItem("RiddlerStrike"));
  let formatedRecord = maxrecord < 10 ? `0${maxrecord}` : maxrecord;
  riddlerMaxRecord.innerHTML = `<span>Racha Maxima:</span> ${formatedRecord}`;
};

/**
 * ? Save the Riddler game record if it surpasses the current stored record.
 *
 * @function
 *
 * @example
 * * saveRecord();
 * * This function checks and saves the Riddler game record in localStorage and server if it's a new record.
 */
const saveRecord = () => {
  if (JSON.parse(localStorage.getItem("RiddlerStrike")) < record) {
    localStorage.setItem("RiddlerStrike", JSON.stringify(record));
    addRecord({ record: record }, "riddles");
    showNotification("Nuevo Record");
  }
};

/**
 * ? Update the Riddler game record displayed on the interface.
 *
 * @function
 *
 * @example
 * * recordAdd();
 * * This function updates the displayed Riddler game record on the interface.
 */
const recordAdd = () => {
  let formatedRecord = record < 10 ? `0${record}` : record;
  riddlerResults.innerHTML = `<span>Maxima Actual:</span> ${formatedRecord}`;
};

/**
 * ? Update the number of attempts displayed in the Riddler game interface.
 *
 * @function
 *
 * @example
 * * updateAttempts();
 * * This function updates the displayed number of attempts on the Riddler game interface.
 */
const updateAttempts = () => {
  const app = document.querySelector(".RiddlerApp");
  app.querySelector(
    ".riddlerAttemps"
  ).innerHTML = `<span>Intentos:</span> ${Attempts}`;
};

/**
 * ? Check if the user's input matches the correct answer in the Riddler game.
 * * If the input is correct, it triggers the win function.
 * * If the input is incorrect, it decrements the attempts and updates the interface.
 * * If the attempts reach zero, it triggers the lose function.
 *
 * @function
 *
 * @example
 * * checkAnswer();
 * * This function checks the user's input in the Riddler game and handles the outcome.
 */
const checkAnswer = () => {
  if (Attemp.value === Answer) {
    Attemp.value = "";
    win();
    //
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

/**
 * ? Set the base points value for the Riddler game based on the selected difficulty.
 *
 * @function
 *
 * @example
 * * setBasePointsValue();
 * * This function sets the base points value for the Riddler game.
 */
const setBasePointsValue = () => {
  const values = {
    facil: 5,
    media: 10,
    dificil: 15,
    muy_dificil: 20,
  };

  basePoints = values[difficult];
};

/**
 * ? Build the Riddler game interface with the provided riddle, answer, and attempts information.
 *
 * @function
 * @param {Object} options - The options object containing riddle, answer, and attempts.
 * @param {string} options.riddle - The riddle text.
 * @param {string} options.answer - The correct answer to the riddle.
 * @param {number} options.attempts - The number of attempts allowed in the game.
 *
 * @example
 * const gameOptions = {
 *   riddle: "Sample riddle text",
 *   answer: "sample",
 *   attempts: 5
 * };
 * * buildRiddleGame(gameOptions);
 * * This function builds the Riddler game interface with the provided options.
 */
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

  if (JSON.parse(localStorage.getItem("keyboard")) === true) {
    riddlerKeyboard.innerHTML = ``;
    riddlerKeyboard.appendChild(keyBoard(keyBoardCharacters));
  } else {
    riddlerKeyboard.innerHTML = ``;
  }

  app.classList.remove("hidden");
  riddlerMenu.classList.add("hidden");
};

/**
 * ? Fetch a riddle from the specified URL and build the Riddler game interface with the obtained data.
 *
 * @function
 * @async
 * @param {string} url - The URL from which to fetch the riddle data.
 *
 * @example
 * * const riddleURL = "https://example.com/getRiddle";
 * * getRiddle(riddleURL);
 * * This function fetches a riddle from the specified URL and builds the Riddler game interface.
 */
const getRiddle = async (url) => {
  let response = await fetch(url);
  let data = await response.json();
  buildRiddleGame(await data);
};

/**
 * ? Create and display the lose modal for the Riddler game.
 *
 * @function
 *
 * @example
 * * createLoseModal();
 * * This function creates and displays the lose modal for the Riddler game.
 */
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

/**
 * ? Handle the lose condition in the Riddler game.
 *
 * @function
 *
 * @example
 * * lose();
 * * This function handles the lose condition in the Riddler game, plays a failure sound, creates the lose modal, sets the record to 0, and displays the lose modal.
 */
const lose = () => {
  failure.play();
  createLoseModal();
  record = 0;
  riddlerLoseModal.classList.remove("hidden");
};

/**
 * ? Handle the win condition in the Riddler game.
 *
 * @function
 *
 * @example
 * * win();
 * * This function handles the win condition in the Riddler game, plays a success sound, updates the record and user points and GatoCoins, then displays a notification and stops the game after a delay.
 */
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

/**
 * ? Stop the Riddler game, hide the game interface, and show the menu.
 *
 * @function
 *
 * @example
 * * stop();
 * * This function stops the Riddler game, hides the game interface, and shows the menu.
 */
const stop = () => {
  document.querySelector(".RiddlerApp").classList.add("hidden");
  riddlerMenu.classList.remove("hidden");

  recordAdd();
  saveRecord();
  updateRiddlerRecord();
};

/**
 * ? Update the ID attribute of the close button in the Riddler lose modal.
 */
document.addEventListener("DOMContentLoaded", () => {
  riddlerLoseModal
    .querySelector("#Close-hangman-modal")
    .setAttribute("id", "Close-riddler-modal");
});

/**
 * ? Click Event Listener
 *
 * *This event listener handles click events on various elements in the game.
 *
 * @param {MouseEvent} e - The mouse click event object.
 */
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

  if (e.target.matches(".riddlerKeyBoard .letter-container")) {
    //
    if (e.target.parentElement.matches(".riddlerKeyBoard")) {
      //
      let l = e.target.textContent;

      if (l == "⏎") {
        document.querySelector(".riddler-check").click();
        //
      } else if (l == "↩") {
        let actualWord = Attemp.value;
        console.log(actualWord);
        let changedWord = Array.from(actualWord);
        changedWord.pop(actualWord.length - 1);
        Attemp.value = changedWord.join("");
        //
      } else {
        Attemp.value += l;
      }
    }
  }
});

/**
 * ? Adds event listeners to the Riddler difficulty buttons.
 *
 * @param {HTMLButtonElement[]} buttons - An array of Riddler difficulty buttons.
 *
 * * Get the difficult data of the button set it to the game and show a notification.
 */
riddlerDifficultBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    difficult = btn.getAttribute("data-difficult");
    showNotification(`Dificultad ${btn.textContent} establecida`);
  })
);

/**
 * ? Adds event listeners to the Riddler options.
 *
 * @param {HTMLDivElement[]} options - An array of Riddler options.
 * * Check if the level is not locked, if not create the url endpoint and call getRiddle to fetch the data.
 */
riddlerOptions.forEach((option) =>
  option.addEventListener("click", () => {
    if (option.classList.contains("locked")) {
      return;
    }
    let url = `${riddlerUrl}${option.textContent.toLowerCase()}?difficult=${difficult}`;
    getRiddle(url);
  })
);
