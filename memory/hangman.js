/**
 * @author Pablo Solbal <pablossolbal@gmail.com>
 * @copyright Pablo Solbal 2023
 * @license MIT
 */
/**
 * ? Hangman Game Script
 *
 * * This script handles the functionality of the Hangman game, including user input, game state updates, and interaction with the Hangman API.
 */
/**
 * ? Imports for Hangman game elements and sound effects.
 *
 * * These imports are used to access various elements and sound effects needed for the Hangman game.
 */
import {
  success,
  correct,
  incorrect,
  failure,
  modifyUserData,
  updateUserPointsAndCoins,
  showNotification,
} from "./script.js";
import { addRecord } from "./user.js";
import { hangmanMenu } from "./memory.js";
import { urls } from "./config.js";

/**
 * ? Hangman Game Variables and DOM Elements
 *
 * * These variables and DOM elements are essential for managing the Hangman game.
 */
const hangmanApp = document.querySelector(".hangman-app");
const attempsContainer = document.querySelector(".attemps-count");
const wordContainer = document.querySelector(".word-container");
const letterInput = document.querySelector(".letter-checker");
const usedLetterContainer = document.querySelector(".used");
export const loseModal = document.querySelector(".lose-modal");
const continueBtn = document.getElementById("Close-hangman-modal");
const showWordContainer = document.querySelector(".show-word-container");
const hangmanPic = document.querySelector(".hangman-pic");
const hangmanHigscore = document.querySelector(".hangman-highscore");
export const hangmanResults = document.querySelector(".hangman-results");
const keyboardContainer = document.querySelector(".keyBoard");
const optionBtns = document.querySelectorAll(".option");

// ? The base URL for fetching Hangman words.
let hangmanurl = urls.HangmanWord;
let alternativeHangmanUrl = urls.HangmanWords;

// ? Variables for game state and data.
let word = null;
let hidden = null;
let maxAttemps;
let attempsCounter = null;
let strikeCounter = 0;

const validCharacters = "abcdefghijklmnñopqrstuvwxyz";
const keyBoardCharacters = "qwertyuiopasdfghjklzxcvbnm↩⏎";
const usedLetters = new Set();

/**
 * ? Generates a virtual keyboard with specified characters.
 *
 * @param {string[]} characters - An array of characters for the virtual keyboard.
 * @returns {DocumentFragment} - A document fragment containing the virtual keyboard.
 *
 * @example
 * * const keyboard = keyBoard(["A", "B", "C", "D"]);
 * * document.querySelector(".keyboard-container").appendChild(keyboard);
 */
export const keyBoard = (Characters) => {
  const keyboard = document.createDocumentFragment();

  for (let letter of Characters) {
    const letterContainer = document.createElement("div");
    letterContainer.classList.add("letter-container");
    letterContainer.textContent = `${letter}`;
    keyboard.appendChild(letterContainer);
  }
  return keyboard;
};

/**
 * ? Update the displayed strike counter in the Hangman game.
 * * Retrieves the strike counter from local storage, formats it, and updates the HTML element.
 *
 * @function
 *
 * @example
 * * UpdateStrike();
 */
export const UpdateStrike = () => {
  let strikeCounter = JSON.parse(localStorage.getItem("HangmanStrike"));

  let formatedStrikeCounter =
    strikeCounter < 10 ? `0${strikeCounter}` : strikeCounter;

  hangmanHigscore.innerHTML = `<span>Racha Maxima: </span>${formatedStrikeCounter}`;
};

/**
 * ? Saves the current hangman strike counter as a new record if it's higher than the existing record.
 */
const SaveStrike = () => {
  if (JSON.parse(localStorage.getItem("HangmanStrike")) < strikeCounter) {
    localStorage.setItem("HangmanStrike", JSON.stringify(strikeCounter));

    addRecord({ strike: strikeCounter }, "hangman");
    showNotification("Nuevo record");
  }
};

/**
 * ? Updates the displayed hangman strike counter on the UI.
 */
const StrikeCounterAdd = () => {
  let formatedStrikeCounter =
    strikeCounter < 10 ? `0${strikeCounter}` : strikeCounter;

  hangmanResults.innerHTML = `<span>Racha Actual: </span>${formatedStrikeCounter}`;
};

/**
 * Set Hangman Picture
 *
 * ? This function updates the Hangman game's displayed picture based on the number of remaining attempts.
 * It calculates the appropriate picture index and sets the source of the Hangman image to reflect the current game state.
 *
 * Example:
 * * - If there are 3 attempts remaining out of a maximum of 6, it sets the Hangman image source to 'hangman4.png'.
 * * - If the game is about to end with 0 attempts left, it sets the Hangman image source to 'hangman0.png'.
 */

const setHangmanPic = () => {
  let picIndex = parseInt((attempsCounter / maxAttemps) * 6);
  hangmanPic.src = `imgs/hangman${Math.abs(6 - picIndex)}.png`;
};

/**
 * Update the remaining attempts and display them on the screen.
 *
 * ? This function decreases the remaining attempts by 1 and updates the display to show the updated attempts count.
 */

const updateAttemps = () => {
  attempsCounter -= 1;
  let attemps = attempsCounter;
  attemps = attemps < 10 ? `0${attemps}` : attemps;
  attempsContainer.innerHTML = `<span>Intentos:</span> ${attemps}`;
};

/**
 * Update the displayed word with the hidden word's current state.
 *
 * ? This function updates the Hangman game's displayed word to show the current state of the hidden word, with revealed letters and underscores.
 */

const updateWord = () => {
  wordContainer.textContent = hidden.join(" ");
};

/**
 * Display the used letters on the screen.
 *
 * ? This function updates the display to show the letters that have been used in the game.
 */

export const usedLetter = (letter = null) => {
  if (letter == null) {
    usedLetters.clear();
  } else {
    usedLetters.add(letter);
  }

  usedLetterContainer.innerHTML = `<span>Letras Usadas:</span> ${Array.from(
    usedLetters
  ).join("")}`;
};

/**
 * Create and display the Hangman game based on the retrieved data.
 *
 * ? This function takes the data received from the Hangman API and sets up the Hangman game for display.
 *
 * @param {Object} data - The data containing information about the Hangman game, including the word, hidden word, and remaining attempts.
 *
 * Example:
 *   * - If valid data is provided, it configures the Hangman game with the word, hidden word, and attempts information.
 *   * - The Hangman game is displayed with the appropriate details.
 */

const createHangman = (data) => {
  hangmanApp.classList.remove("hidden");
  hangmanMenu.classList.add("hidden");

  const attemps = data.attemps;
  const formatedattemps = attemps < 10 ? `0${attemps}` : attemps;

  attempsContainer.innerHTML = `<span>Intentos:</span> ${formatedattemps}`;

  word = data.word;
  hidden = data.hidden;
  maxAttemps = data.attemps;
  attempsCounter = data.attemps;

  if (JSON.parse(localStorage.getItem("keyboard")) === true) {
    keyboardContainer.innerHTML = ``;
    keyboardContainer.appendChild(keyBoard(keyBoardCharacters));
  } else {
    keyboardContainer.innerHTML = ``;
  }

  updateWord();
  setHangmanPic();
};

/**
 * Fetch a word from the Hangman API based on the specified category and create the Hangman game.
 *
 * ? This function sends a request to the Hangman API with the specified category and retrieves a word for the game.
 * * It then creates the Hangman game using the received data.
 *
 * @param {string} category - The category of the word to fetch.
 *
 * Example:
 *   * - If 'animals' is provided as the category, it fetches a word related to animals from the API and sets up the Hangman game with that word.
 *   * - If an invalid category or an error occurs during the API request, an error message is logged to the console.
 */

export const getWord = async (category) => {
  let data = null;

  try {
    let response = await fetch(hangmanurl + category);
    data = await response.json();
  } catch (error) {
    let response = await fetch(alternativeHangmanUrl + category);
    data = await response.json();
    data = await data[Math.round(Math.random() * data.length - 1)];
  }

  createHangman(await data);
};

/**
 * Check if the provided letter exists in the target word and update game state accordingly.
 *
 * ? This function checks if the given letter is present in the target word and updates the displayed word and game state.
 *
 * @param {string} letter - The letter to check.
 *
 * Example:
 *   * - If the letter "a" is provided and it exists in the target word, it updates the displayed word and triggers a success sound.
 *   * - If the letter "z" is provided and it doesn't exist in the target word, it updates the remaining attempts and, if no attempts are left, displays the correct word.
 */

const checkLetter = (letter) => {
  usedLetter(letter);

  if (word.includes(letter)) {
    for (let a in word) {
      if (word[a] == letter) {
        hidden[a] = letter;
      }
    }

    correct.play();
    updateWord();

    if (hidden.join("") == word.join("")) {
      success.play();
      strikeCounter += 1;

      StrikeCounterAdd();
      SaveStrike();
      UpdateStrike();

      modifyUserData("Points", Math.max(5 + attempsCounter * 2, 0));
      modifyUserData("GatoCoins", Math.max(20 + attempsCounter * 2, 0));

      setTimeout(() => {
        hangmanApp.classList.add("hidden");
        hangmanMenu.classList.remove("hidden");
        hangmanMenu.prepend(updateUserPointsAndCoins());
        showNotification(
          `Ganaste ${Math.max(20 + attempsCounter * 2, 0)} Gatocoins`
        );
      }, 1250);
    }
  } else {
    incorrect.play();
    updateAttemps();
    setHangmanPic();

    if (attempsCounter == 0) {
      failure.play();

      SaveStrike();
      strikeCounter = 0;
      StrikeCounterAdd();
      UpdateStrike();

      showWordContainer.innerHTML = `<span>La palabra era:</span> ${word.join(
        ""
      )}`;

      setTimeout(() => {
        loseModal.classList.remove("hidden");
      }, 1000);
    }
  }
};

/**
 * Get a letter from the user input and perform validation.
 *
 * ? This function checks if the user input is a valid letter, processes it, and updates the list of used letters.
 *
 * @returns {string} The lowercase letter obtained from user input or a status message:
 *   * - If the input is empty, it returns "empty."
 *   * - If the input is the correct word, it returns "success."
 *   * - If the input is a valid letter, it returns the lowercase letter.
 *   * - If the input is not a valid letter, it returns "Por favor ingresa un caracter valido."
 *
 * Example:
 *   * - If the user inputs "A", the function returns "a" (lowercase).
 *   * - If the user inputs "1", the function returns "Por favor ingresa un caracter valido."
 */

const getLetter = () => {
  if (letterInput.value == "") {
    letterInput.value = "";
    return "empty";
  }

  let text = letterInput.value.toLowerCase();

  if (text == word.join("")) {
    for (let letter of text) {
      checkLetter(letter);
    }
    letterInput.value = "";
    return "success";
  }

  if (validCharacters.includes(text)) {
    if (text.length > 0) {
      let letter = text.split("")[0];

      if (
        typeof letter == "string" &&
        validCharacters.includes(letter.toLowerCase())
      ) {
        letterInput.value = "";
        usedLetter(letter);
        return letter.toLowerCase();
      } else {
        letterInput.value = "";
        return "Por favor ingresa un caracter valido";
      }
    }
  } else {
    letterInput.value = "";
    return "empty";
  }
};

/**
 * Handle Click Events
 *
 * ? This event listener handles click events on various elements within the Hangman game.
 * * It responds to clicks on buttons, modals, and other interactive elements to control the game flow and user interactions.
 *
 * @param {Event} e - The click event object.
 *
 * Example:
 * * - If the user clicks the "continue" button after losing a game, it hides the lose modal, resets the game, and displays the Hangman menu.
 * * - If the user clicks the "check" button to submit a letter, it processes the input and updates the game based on the letter provided.
 * * - If the user clicks the "home" button, it hides the Hangman menu.
 * * - If the user clicks the "hangman-stop" button, it hides the Hangman game and shows the menu.
 */

document.addEventListener("click", (e) => {
  // ? Handle clicks in the integrated keyboard
  if (e.target.matches(".letter-container")) {
    //
    if (e.target.parentElement.matches(".keyBoard")) {
      let l = e.target.textContent;

      if (l == "⏎") {
        document.querySelector(".check").click();
        //
      } else if (l == "↩") {
        let actualWord = letterInput.value;
        console.log(actualWord);

        let changedWord = Array.from(actualWord);
        changedWord.pop(actualWord.length - 1);

        letterInput.value = changedWord.join("");
        //
      } else {
        letterInput.value += l;
      }
    }
  }

  // ? Handle click on the continue button in the lose modal.
  if (e.target == continueBtn) {
    loseModal.classList.add("hidden");
    hangmanApp.classList.add("hidden");
    hangmanMenu.classList.remove("hidden");

    SaveStrike();
    strikeCounter = 0;
    StrikeCounterAdd();
    UpdateStrike();
  }

  // ? Check the letter input
  if (e.target.matches(".check")) {
    let letter = getLetter();
    if (letter == "success") {
      return;
    }

    if (letter != "empty") {
      checkLetter(letter);
    }
  }

  if (e.target.matches(".home")) {
    hangmanMenu.classList.add("hidden");
  }

  // ? Stop the game
  if (e.target.matches(".hangman-stop")) {
    hangmanApp.classList.add("hidden");
    hangmanMenu.classList.remove("hidden");

    SaveStrike();
    strikeCounter = 0;
    StrikeCounterAdd();
    UpdateStrike();
  }
});

/**
 * Handle Keyup Events
 *
 * ? This event listener handles keyup events, specifically the "Enter" key, for submitting letters in the Hangman game.
 * * It listens for the "Enter" keypress and processes the input if it's a valid letter.
 *
 * @param {KeyboardEvent} e - The keyup event object.
 *
 * Example:
 * * - If the user presses the "Enter" key after entering a letter, it processes the input and updates the game based on the letter provided.
 */

document.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    let letter = getLetter();
    if (letter == "success") {
      return;
    }

    if (letter != "empty") {
      checkLetter(letter);
    }
  }
});

/**
 * ? Event listener for option buttons. Fetches a word for the selected category and updates the UI.
 */
optionBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (!btn.classList.contains("locked")) {
      let category = btn.textContent;
      await getWord(category.toLowerCase());
      usedLetter();
    }
  });
});
