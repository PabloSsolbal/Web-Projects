/**
 * ? Service Worker Registration
 *
 * * This code block checks if the browser supports service workers and registers a service worker if supported.
 * * It also logs messages to the console to indicate the registration status.
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("Registro Exitoso", reg))
      .catch((err) => console.log(err));
  });
} else {
  console.log("serviceWorker no soportado");
}

// ! import the necesary things
import { getWord, usedLetter, hangmanHigscore } from "./hangman.js";
import { app, mainMenu, hangmanMenu } from "./memory.js";

const configMenu = document.querySelector(".Config");
const colorsMenu = document.querySelector(".colorsOptionContainer");

// ? flip audio for the cards
export const flip = new Audio();
flip.src = "sounds/flipcard.mp3";

// ? sound for the modal pop up
export const popUp = new Audio();
popUp.src = "sounds/popmodal.mp3";
popUp.volume = 0.5;

// ? sound for the success game
export const success = new Audio();
success.src = "sounds/success.mp3";
success.volume = 1;

// ? sound for the buttons
const bubble = new Audio();
bubble.src = "sounds/bubble.mp3";
bubble.volume = 1;

// ? sound for correct answers
export const correct = new Audio();
correct.src = "sounds/correct.mp3";

// ? sound for incorrect answers
export const incorrect = new Audio();
incorrect.src = "sounds/incorrect.mp3";

// ? sound for failure game
export const failure = new Audio();
failure.src = "sounds/fail.mp3";

const audios = [bubble, failure, incorrect, correct, success, popUp, flip];

export const UpdateStrike = () => {
  let strikeCounter = JSON.parse(localStorage.getItem("HangmanStrike"));
  let formatedStrikeCounter =
    strikeCounter < 10 ? `0${strikeCounter}` : strikeCounter;
  hangmanHigscore.innerHTML = `<span>Racha Maxima: </span>${formatedStrikeCounter}`;
};

const changeCardsTheme = (theme) => {
  localStorage.setItem("CardsTheme", theme);
};

const toggleAnimations = (value, button) => {
  let items = document.querySelectorAll(".glow");
  let itemsToJSON = [];
  for (let item of items) {
    itemsToJSON.push(item.classList[0]);
  }
  if (value === "Desactivar") {
    localStorage.setItem("Animations", false);
    localStorage.setItem("items", JSON.stringify(itemsToJSON));
    for (let item of items) {
      item.classList.remove("glow");
    }
    button.textContent = "Activar";
  } else if (value === "Activar") {
    localStorage.setItem("Animations", true);
    items = JSON.parse(localStorage.getItem("items"));
    for (let item of items) {
      item = document.querySelectorAll(`.${item}`);
      item.forEach((i) => i.classList.add("glow"));
    }
    button.textContent = "Desactivar";
  }
};

const changeAudioVolume = (value, button) => {
  value = parseInt(value);
  localStorage.setItem("AudioVolume", value);
  if (value === 0) {
    button.textContent = "Activar";
  } else {
    button.textContent = "Desactivar";
  }
  for (let audio of audios) {
    audio.volume = value;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("HangmanStrike")) {
    localStorage.setItem("HangmanStrike", JSON.stringify(0));
  }
  UpdateStrike();
  changeAudioVolume(
    localStorage.getItem("AudioVolume"),
    document.querySelector(".soundOption")
  );
  let animationButton = document.querySelector(".animationOption");
  if (localStorage.getItem("Animations") == "true") {
    toggleAnimations("Activar", animationButton);
  } else {
    toggleAnimations("Desactivar", animationButton);
  }
});

/**
 * ? Click Event Listener
 *
 * *This event listener handles click events on various elements in the application.
 *
 * @param {MouseEvent} e - The mouse click event object.
 */
document.addEventListener("click", (e) => {
  if (e.target.matches(".showColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.add("hidden");
  }
  if (e.target.matches(".closeColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.remove("hidden");
  }
  // ? Options in the Hangman menu
  if (e.target.matches(".option")) {
    let category = e.target.textContent;
    getWord(category.toLowerCase());
    usedLetter();
  }
  // ? Return to the main menu
  if (e.target.matches(".home")) {
    app.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    configMenu.classList.add("hidden");
  }
  if (e.target.matches(".config")) {
    mainMenu.classList.add("hidden");
    configMenu.classList.remove("hidden");
  }
  if (e.target.matches(".configOption")) {
    changeCardsTheme(e.target.textContent);
  }
  if (e.target.matches(".animationOption")) {
    let value = "Activar";
    if (e.target.textContent == "Desactivar") {
      value = "Desactivar";
    }
    toggleAnimations(value, e.target);
  }
  if (e.target.matches(".soundOption")) {
    let value = 1;
    if (e.target.textContent == "Desactivar") {
      value = 0;
    }
    changeAudioVolume(value, e.target);
  }
  // ? Start the Memory game
  if (e.target.matches(".Memory")) {
    mainMenu.classList.add("hidden");
    app.classList.remove("hidden");
  }
  // ? Start the Hangman game
  if (e.target.matches(".Hangman")) {
    mainMenu.classList.add("hidden");
    hangmanMenu.classList.remove("hidden");
  }
  // ? Play the bubble sound
  if (e.target.matches("button")) {
    bubble.play();
  }
});
