/**
 * @file Code for a memory game
 * @author Pablo Solbal <pablossolbal@gmail.com>
 * @copyright Pablo Solbal 2023
 * @license MIT
 * /
/** @version 0.0.1 */
/**
 * ? This code implements a memory game where the player needs to match pairs of cards with the same emotion image.
 * * The game keeps track of the number of moves and the time taken to complete the game.
 * * It allows the player to start and stop the game, and displays the results when all pairs are matched.
 * TODO: Implement additional difficulty levels with different card sets and grid sizes
 * TODO: Implement a high-score system to keep track of the best times for each difficulty level
 * TODO: Add a timer countdown option to add time pressure to the game
 */

// ? get the memory elements

import {
  correct,
  flip,
  popUp,
  success,
  incorrect,
  modifyUserData,
  updateUserPointsAndCoins,
  showNotification,
} from "./script.js";
import { addRecord } from "./user.js";
import { urls } from "./config.js";
/**
 * * the app container
 * * board
 * * move count container
 * * time count container
 * * card containers
 * * result modal
 * * result container
 * * result text
 * * start and stop btns
 * * highscore text
 * * highscore results container
 * * body
 */
export const app = document.querySelector(".app");
const gameBoard = document.querySelector(".board");
const moveCountContainer = document.querySelector(".move-count");
const timeCountContainer = document.querySelector(".time-count");
const cardsContainer = document.querySelector(".cards-container");
const resultContainer = document.querySelector(".results-container");
const resultText = document.querySelector(".results-text");
const result = document.getElementById("result");
const stopBtn = document.getElementById("stop");
const startBtns = document.querySelectorAll(".start");
const highscoreText = document.querySelector(".highscore-text");
const highscoreContainer = document.getElementById("highscore");
const body = document.querySelector("body");
export const mainMenu = document.querySelector(".main-menu");
export const hangmanMenu = document.querySelector(".hangman-menu");
const dificultButtons = document.querySelectorAll(".dificultBtn");

// ? memory variables for move and time counts
let moveCount = 0;
let seconds = 0;
let minutes = 0;

// ? logic variables
/**
 * * count to win (inc if cards match)
 * * interval ID
 * * variables for first and second card
 * * variable for first card value
 */
let winCount = 0;
let intervalID = null;
let firstCard = false;
let secondCard = false;
let firstCardValue = "";

// ? variable to check if there's new highscore
let newHighscore = false;

// ? items array to const the cards
let items = [];

// ? Emotions elements list contains:
/**
 * * Emotion img src
 * * Emotion name
 * * Emotion description
 * * A question about the emotion
 */
let modalElements = {};

// ? url to get the necesary data
let url = urls.MemoryData;

let cardsQuantity = 10;

/**
 * ? Retrieves the selected card theme from local storage. If not found, sets it to "Blue" and returns it.
 * @returns {string} The selected card theme.
 */
const getCardTheme = () => {
  if (localStorage.getItem("CardsTheme")) {
    return localStorage.getItem("CardsTheme");
  } else {
    localStorage.setItem("CardsTheme", "Blue");
    return "Blue";
  }
};

/**
 * ? Fetches and stores data for a specific category from a given URL.
 *
 * * This function performs an asynchronous operation to fetch data related to a specific category
 * * from a specified URL. The retrieved data is then stored in `modalElements` and processed
 * * to create an array of items, each containing a name and an image.
 *
 * @async
 * @param {string} CategoryName - The name or identifier of the category to fetch data for.
 */
const getCategoryData = async (CategoryName) => {
  const thisUrl = url + CategoryName + `?number=${cardsQuantity}`;
  console.log(thisUrl);
  try {
    const response = await fetch(thisUrl);
    const data = await response.json();

    modalElements = {};
    modalElements = data.data;
    console.log(modalElements);

    items = [];

    for (let [name, properties] of Object.entries(data.data)) {
      items.push({ name: properties.name, image: properties.img_route });
    }
    start();
  } catch (error) {
    console.log(error);
    return;
  }
};

// ? timer function
/**
 * @description - Increments the timer by 1 second and updates the time display
 * * Increments the seconds variable by 1
 * * If the seconds variable is greater than or equal to 60, it resets to 0 and increments the minutes variable by 1
 * * Formats the seconds and minutes variables with leading zeros if necessary
 * * Updates the timeCountContainer element with the formatted time
 */
const timer = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let fseconds = seconds < 10 ? `0${seconds}` : seconds;
  let fminutes = minutes < 10 ? `0${minutes}` : minutes;
  timeCountContainer.innerHTML = `<span>Time: </span>${fminutes}:${fseconds}`;
};

// ? move count function
/**
 * @description - Increments the move count by 1 and updates the display
 * * Increments the moveCount variable by 1
 * * Formats the moveCount variable with leading zeros if necessary
 * * Updates the moveCountContainer element with the formatted move count
 */

const moveCounter = () => {
  moveCount += 1;
  let fmoveCount = moveCount < 10 ? `0${moveCount}` : moveCount;
  moveCountContainer.innerHTML = `<span>Moves: </span>${fmoveCount}`;
};

// ? function to shuffle the array
/**
 * @description - Shuffles the elements of an array in place
 * * Iterates over the array from the end to the beginning
 * * For each iteration, generates a random number between 0 and the current index
 * * Swaps the current element with the element at the random index
 * * Returns the shuffled array
 */

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// ? cards generator function
/**
 * @description - Generates a random array of cards and displays them on the screen
 * * Clears the contents of the cardsContainer element
 * * Creates an array of paired cards by duplicating the items array
 * * Shuffles the paired cards array
 * * Iterates over the shuffled cards array
 * * Creates a card element for each card
 * * Appends the card element to the cardsContainer element
 */

const cardsRandomGenerator = () => {
  cardsContainer.innerHTML = "";

  const pairedCards = [...items, ...items];

  const shuffledCards = shuffleArray(pairedCards);

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("card-value", card.name);

    const reverseCard = document.createElement("div");
    reverseCard.classList.add("card-reverse");
    reverseCard.classList.add(getCardTheme());
    reverseCard.textContent = "?";

    const frontCard = document.createElement("div");
    frontCard.classList.add("card-front");
    frontCard.innerHTML = `<img src="${card.image}" alt="${card.name}"> <p class="emotion-desc">${card.name}</p>`;

    cardElement.appendChild(reverseCard);
    cardElement.appendChild(frontCard);
    cardsContainer.appendChild(cardElement);
  });
};

/**
 * ? Displays the highscore on the screen, including time and moves.
 *
 * * This function retrieves the highscore data from local storage, formats and displays it
 * * on the screen. The highscore information includes the time (in minutes and seconds) and the
 * * number of moves made by the player.
 *
 * @param {string} message - The message to be displayed alongside the highscore data.
 */
const showHighscore = (message) => {
  let highscore = null;
  if (JSON.parse(localStorage.getItem("highscore")) !== null) {
    highscore = JSON.parse(localStorage.getItem("highscore"));
  } else {
    return;
  }

  highscoreText.textContent = message;

  let fseconds =
    highscore.seconds < 10 ? `0${highscore.seconds}` : highscore.seconds;
  let fminutes =
    highscore.minutes < 10 ? `0${highscore.minutes}` : highscore.minutes;

  highscoreContainer.innerHTML = `<span class="Dlevel">${highscore.difficult} </span><span>Time: </span>${fminutes}:${fseconds}   <span>Moves: </span>${highscore.moves}`;

  highscoreText.classList.remove("hidden");
  highscoreContainer.classList.remove("hidden");
};

/**
 * ? Stores a new highscore in local storage and displays it on the screen.
 *
 * * This function is responsible for storing a new highscore in local storage
 * * by saving the minutes, seconds, and moves. It then triggers the display of the
 * * new highscore on the screen with a provided message.
 *
 * @param {number} minutes - The number of minutes in the new highscore.
 * @param {number} seconds - The number of seconds in the new highscore.
 * @param {number} moves - The number of moves in the new highscore.
 */
const newRecord = (difficult, minutes, seconds, moves) => {
  let record = {
    difficult: difficult,
    minutes: minutes,
    seconds: seconds,
    moves: moves,
  };
  localStorage.setItem("highscore", JSON.stringify(record));
  addRecord(record, "memory");

  showHighscore("Nuevo Record!!");
};

const checkDifficult = (difficult) => {
  if (typeof difficult == "number") {
    switch (difficult) {
      case 10:
        difficult = "Facil";
        break;
      case 12:
        difficult = "Intermedia";
        break;
      case 14:
        difficult = "Dificil";
        break;
    }
  } else {
    switch (difficult) {
      case "Facil":
        difficult = 10;
        break;
      case "Intermedia":
        difficult = 12;
        break;
      case "Dificil":
        difficult = 14;
    }
  }

  return difficult;
};

/**
 * ? Checks if a new highscore is achieved and updates it if necessary.
 *
 * * This function compares the current game's time and moves to the existing highscore
 * * stored in local storage. If a new highscore is achieved, it updates the highscore
 * * and displays a message on the screen. If no previous highscore exists, it records
 * * the current game as a new highscore.
 *
 * @param {number} minutes - The number of minutes in the current game.
 * @param {number} seconds - The number of seconds in the current game.
 * @param {number} moves - The number of moves in the current game.
 */
const checkHighScore = (minutes, seconds, moves) => {
  if (JSON.parse(localStorage.getItem("highscore")) !== null) {
    //
    let highScore = JSON.parse(localStorage.getItem("highscore"));
    let difficult = highScore.difficult;
    let difficultValue = checkDifficult(difficult);

    if (cardsQuantity > difficultValue) {
      newRecord(checkDifficult(cardsQuantity), minutes, seconds, moves);
      newHighscore = true;
    } else if (cardsQuantity == difficultValue) {
      if (minutes < highScore.minutes) {
        //
        newRecord(checkDifficult(cardsQuantity), minutes, seconds, moves);
        newHighscore = true;
        //
      } else if (minutes == highScore.minutes) {
        //
        if (seconds < highScore.seconds) {
          newRecord(checkDifficult(cardsQuantity), minutes, seconds, moves);
          newHighscore = true;
          //
        } else if (seconds == highScore.seconds) {
          //
          if (moves < highScore.moves) {
            newRecord(checkDifficult(cardsQuantity), minutes, seconds, moves);
            newHighscore = true;
            //
          } else {
            showHighscore("Tu Record: ");
            newHighscore = false;
          }
        }
      }
    } else {
      newHighscore = false;
    }
  } else {
    newRecord(checkDifficult(cardsQuantity), minutes, seconds, moves);
    newHighscore = true;
  }
};

// ? Win Function
const Win = () => {
  modifyUserData("Points", Math.max(30 - moveCount, 0));
  modifyUserData("GatoCoins", Math.max(cardsQuantity * 6 - moveCount * 2, 0));
  setTimeout(() => {
    let fseconds = seconds < 10 ? `0${seconds}` : seconds;
    let fminutes = minutes < 10 ? `0${minutes}` : minutes;
    result.innerHTML = `<span class="Dlevel">${checkDifficult(
      cardsQuantity
    )} </span><span>Time: </span>${fminutes}:${fseconds}   <span>Moves: </span>${moveCount}`;
    checkHighScore(minutes, seconds, moveCount);
    stop();
    if (newHighscore) {
      result.classList.add("hidden");
      resultText.classList.add("hidden");
    }
    app.prepend(updateUserPointsAndCoins());
    showNotification(`Ganaste ${Math.max(70 - moveCount * 2, 0)} Gatocoins`);
  }, 1500);
};

// ! Game logic

// ? event listeners for the cards
/**
 * * Event listener callback for handling card clicks in the memory game.
 *
 * * This function is attached to the document's click event and handles clicks on
 * * elements with the "card-reverse" class. It manages the game's logic, including
 * * flipping cards, checking for matches, and determining when the game is won.
 *
 * @param {Event} e - The click event object.
 */
/**
 * * The click listener function checks if the card is not already matched or flipped
 * * - If the card is not matched or flipped, it flips the card
 * * - If the card is the first card clicked, it stores the card value in the firstCardValue variable
 * * - If the card is the second card clicked, it compares the card value to the firstCardValue variable
 * * - If the card values match, it adds the cards to the matched array and increments the winCount variable
 * * - If the card values match, pass the value to the modal function to display a modal of the emotion
 * * - If the card values do not match, it flips the cards back
 */

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("card-reverse")) {
    let cardE = e.target.parentElement;

    if (
      !cardE.classList.contains("matched") &&
      !cardE.classList.contains("flipped")
    ) {
      //
      flip.currentTime = 0;
      flip.play();
      cardE.classList.add("flipped");

      if (!firstCard) {
        firstCard = cardE;
        firstCardValue = cardE.getAttribute("card-value");
        //
      } else {
        //
        flip.currentTime = 0;
        flip.play();
        moveCounter();
        secondCard = cardE;

        let secondCardValue = cardE.getAttribute("card-value");

        if (firstCardValue == secondCardValue) {
          correct.play();
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");
          if (localStorage.getItem("Animations") === "true") {
            firstCard.classList.add("glow");
            secondCard.classList.add("glow");
          }

          displayModal(firstCardValue);

          firstCard = false;
          winCount += 1;

          if (winCount == items.length) {
            Win();
            success.play();
          }
          //
        } else {
          incorrect.play();
          let temporalFirst = firstCard;
          let temporalSecond = secondCard;

          firstCard = false;
          secondCard = false;

          setTimeout(() => {
            temporalFirst.classList.remove("flipped");
            temporalSecond.classList.remove("flipped");
          }, 950);
        }
      }
    }
  }
});

// ? start game function
/**
 * @description - Starts the game
 * * Resets the seconds, minutes, and moveCount variables
 * * Removes the "before" class from the app element
 * * Removes the "hiden" class from the gameBoard element
 * * Adds the "hiden" class to the resultContainer element
 * * Removes the "hiden" class from the stopBtn element
 * * Calls the starter function
 * * Scrolls the window to the bottom
 */

const start = () => {
  seconds = 0;
  minutes = 0;
  moveCount = 0;

  app.classList.remove("before");
  gameBoard.classList.remove("hidden");
  cardsContainer.innerHTML = "";
  resultContainer.classList.add("hidden");
  stopBtn.classList.remove("hidden");

  starter();
  window.scrollTo(0, document.documentElement.scrollHeight);
};

// ? stop game function
/**
 * @description - Stops the game
 * * Clears the intervalID variable
 * * Removes the "hiden" class from the result element
 * * Adds the "before" class to the app element
 * * Adds the "hiden" class to the gameBoard element
 * * Removes the "hiden" class from the resultContainer element
 * * Adds the "hiden" class to the stopBtn element
 */

const stop = () => {
  clearInterval(intervalID);

  result.classList.remove("hidden");
  resultText.classList.remove("hidden");
  app.classList.add("before");
  gameBoard.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  stopBtn.classList.add("hidden");

  if (newHighscore) {
    result.classList.add("hidden");
    resultText.classList.add("hidden");
  }

  window.scrollTo(0, 0);
};

// ? starter function
/**
 * @description - Initializes the game
 * * Clears the result element's inner text
 * * Resets the winCount variable
 * * Sets the intervalID variable to the value of the setInterval function
 * * Calls the cardsRandomGenerator function
 * * Calls the addCardListeners function
 * * Sets the value of the moveCountContainer element's inner HTML to "Moves: 00"
 * * Sets the value of the timeCountContainer element's inner HTML to "Time: 00:00"
 */

const starter = () => {
  result.innerText = "";
  winCount = 0;
  newHighscore = false;

  clearInterval(intervalID);

  intervalID = setInterval(timer, 1000);

  cardsRandomGenerator();

  moveCountContainer.innerHTML = `<span>Moves: </span>00`;
  timeCountContainer.innerHTML = `<span>Time: </span>00:00`;
};

// ? Event listeners for the start and stop button

/**
 * ? Event listener callback to start the game with the selected category.
 *
 * *This function is attached to a click event on specific buttons. It retrieves the
 * * category from the clicked button's text content and uses it to fetch data related
 * * to the category, then starts the game.
 *
 * @param {Event} event - The click event object.
 */
startBtns.forEach((Btn) => {
  Btn.addEventListener("click", async () => {
    if (!Btn.classList.contains("locked")) {
      let category = Btn.textContent;
      await getCategoryData(category);
    }
  });
});

stopBtn.addEventListener("click", () => {
  stop();
  resultText.classList.add("hidden");
});

// ! display modal function //

// ? Get modal elements
/**
 * * Modal container
 * * Modal emotion image
 * * Modal emotion name
 * * Modal emotion description
 * * Modal question container
 * * Continue button
 */
const modal = document.querySelector(".modal");
const modalImg = document.querySelector(".modal .modal-card .emotion-img");
const emotionName = document.querySelector(".emotion-name");
const emotionDesc = document.querySelector(".emotion-description");
const questionCont = document.querySelector(".question");

const continueGameBtn = document.getElementById("continue");

// ? Display modal function
/**
 *
 * @param Emotion - emotion name
 * * Search the emotion name in the modal elements list
 * * Set the modal elements to the modal elements list
 * * Show the modal
 * * Clear the interval to pause the game
 */
const displayModal = (element) => {
  let elements = modalElements[element];
  modalImg.src = elements.img_route;
  emotionName.innerText = elements.name;
  emotionDesc.innerText = elements.description;
  questionCont.innerText = elements.question;

  body.classList.add("displayed");
  modal.classList.remove("hidden");

  popUp.play();

  clearInterval(intervalID);
};

// ? Continue btn event listener to hide the modal and continue the game time countdown
continueGameBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  body.classList.remove("displayed");
  intervalID = setInterval(timer, 1000);
});

// ? Load the record of the user when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("highscore")) {
    showHighscore("Tu Record: ");
  }
});

/**
 * ? Event listener for difficulty buttons to set the number of cards based on the selected difficulty.
 */
dificultButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    cardsQuantity = parseInt(btn.getAttribute("data-cards"));
    showNotification(`Dificultad ${btn.textContent} establecida`);
  });
});
