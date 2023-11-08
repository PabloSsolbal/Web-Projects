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
import { getWord, usedLetter } from "./hangman.js";
import { app, mainMenu, hangmanMenu } from "./memory.js";

const configMenu = document.querySelector(".Config");

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

const changeCardsTheme = (theme) => {
  localStorage.setItem("CardsTheme", theme);
};

/**
 * ? Click Event Listener
 *
 * *This event listener handles click events on various elements in the application.
 *
 * @param {MouseEvent} e - The mouse click event object.
 */
document.addEventListener("click", (e) => {
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
    let content = "Desactivar";
    if (e.target.textContent == "Desactivar") {
      content = "Activar";
    }
    e.target.textContent = content;
  }
  if (e.target.matches(".soundOption")) {
    let content = "Desactivar";
    for (let audio of audios) {
      audio.volume = 1;
    }
    if (e.target.textContent == "Desactivar") {
      for (let audio of audios) {
        audio.volume = 0;
      }
      content = "Activar";
    }
    e.target.textContent = content;
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
