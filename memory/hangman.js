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
  hangmanMenu,
  popUp,
  success,
  correct,
  incorrect,
  failure,
} from "./memory.js";

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
const loseModal = document.querySelector(".lose-modal");
const continueBtn = document.getElementById("Close-hangman-modal");
const showWordContainer = document.querySelector(".show-word-container");
const hangmanPic = document.querySelector(".hangman-pic");

// ? The base URL for fetching Hangman words.
let hangmanurl = "https://memory-1-u4335091.deta.app/get_word/";

// ? Variables for game state and data.
let word = null;
let hidden = null;
let maxAttemps;
let attempsCounter = null;

// ? Valid characters for the Hangman game.
const validCharacters = "abcdefghijklmnopqrstuvwxyz";

// ? Array to store used letters in the game.
let usedLetters = [];

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

export const usedLetter = () => {
  usedLetterContainer.innerHTML = `<span>Letras Usadas:</span> ${usedLetters.join(
    " "
  )}`;
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
  let response = await fetch(hangmanurl + category);
  let data = await response.json();

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
      setTimeout(() => {
        hangmanApp.classList.add("hidden");
        hangmanMenu.classList.remove("hidden");
        usedLetters = [];
      }, 1250);
    }
  } else {
    incorrect.play();
    updateAttemps();
    setHangmanPic();
    if (attempsCounter == 0) {
      failure.play();
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
        usedLetters.push(letter.toLowerCase());
        usedLetter();
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
  if (e.target == continueBtn) {
    loseModal.classList.add("hidden");
    hangmanApp.classList.add("hidden");
    hangmanMenu.classList.remove("hidden");
    usedLetters = [];
    usedLetter();
  }
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
  if (e.target.matches(".hangman-stop")) {
    hangmanApp.classList.add("hidden");
    hangmanMenu.classList.remove("hidden");
    usedLetters = [];
    usedLetter();
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
