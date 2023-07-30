/**
 * ? This code implements a memory game where the player needs to match pairs of cards with the same emotion image.
 * * The game keeps track of the number of moves and the time taken to complete the game.
 * * It allows the player to start and stop the game, and displays the results when all pairs are matched.
 * TODO: Implement additional difficulty levels with different card sets and grid sizes
 * TODO: Add animations and visual effects to enhance the game experience
 * TODO: Implement a high-score system to keep track of the best times for each difficulty level
 * TODO: Add a timer countdown option to add time pressure to the game
 * TODO: Improve accessibility by adding keyboard navigation and screen reader support
 */

// ? get the memory elements
/**
 * * the app container
 * * board
 * * move count container
 * * time count container
 * * card containers
 * * result modal
 * * result container
 * * start and stop btns
 */
const app = document.querySelector(".app");
const gameBoard = document.querySelector(".board");
const moveCountContainer = document.querySelector(".move-count");
const timeCountContainer = document.querySelector(".time-count");
const cardsContainer = document.querySelector(".cards-container");
const resultContainer = document.querySelector(".results-container");
const result = document.getElementById("result");
const stopBtn = document.getElementById("stop");
const startBtn = document.getElementById("start");

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

// ? items array to const the cards
const items = [
  { name: "happy", image: "images/alegria.png" },
  { name: "sad", image: "images/tristeza.png" },
  { name: "angry", image: "images/enojo.png" },
  { name: "anxious", image: "images/ansiedad.png" },
  { name: "disgust", image: "images/asco.png" },
  { name: "calm", image: "images/calma.png" },
  { name: "frustated", image: "images/frustrado.png" },
  { name: "scared", image: "images/miedo.png" },
  { name: "preoccupied", image: "images/preocupacion.png" },
  { name: "satisfaction", image: "images/satisfaccion.png" },
];

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
    reverseCard.textContent = "?";

    const frontCard = document.createElement("div");
    frontCard.classList.add("card-front");
    frontCard.innerHTML = `<img src="${card.image}" alt="${card.name}"> <p class="emotion-desc">${card.name}</p>`;

    cardElement.appendChild(reverseCard);
    cardElement.appendChild(frontCard);
    cardsContainer.appendChild(cardElement);
  });
};

// ? flip audio for the cards
const flip = new Audio();
flip.src = "sounds/flipcard.mp3";

// ! Game logic
// ? event listeners for the cards
/**
 * @description - Adds click listeners to all the cards on the screen
 * * Gets all the cards elements by querying the DOM for elements with the class name "card"
 * * Iterates over the cards elements array
 * * Adds a click listener to each card element
 * * The click listener function checks if the card is not already matched or flipped
 * * If the card is not matched or flipped, it flips the card
 * * If the card is the first card clicked, it stores the card value in the firstCardValue variable
 * * If the card is the second card clicked, it compares the card value to the firstCardValue variable
 * * If the card values match, it adds the cards to the matched array and increments the winCount variable
 * * If the card values do not match, it flips the cards back
 */

const addCardListeners = () => {
  cardsElements = document.querySelectorAll(".card");

  cardsElements.forEach((cardE) => {
    cardE.addEventListener("click", (e) => {
      e.preventDefault();

      if (
        !cardE.classList.contains("matched") &&
        !cardE.classList.contains("flipped")
      ) {
        flip.play();
        cardE.classList.add("flipped");

        if (!firstCard) {
          firstCard = cardE;
          firstCardValue = cardE.getAttribute("card-value");
        } else {
          flip.play();
          moveCounter();
          secondCard = cardE;

          let secondCardValue = cardE.getAttribute("card-value");

          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;

            if (winCount == Math.floor(cardsElements.length / 2)) {
              setTimeout(() => {
                let fseconds = seconds < 10 ? `0${seconds}` : seconds;
                let fminutes = minutes < 10 ? `0${minutes}` : minutes;
                result.innerHTML = `<span>Time: </span>${fminutes}:${fseconds}   <span>Moves: </span>${moveCount}`;
                stop();
              }, 1500);
            }
          } else {
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
    });
  });
};

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
  gameBoard.classList.remove("hiden");
  resultContainer.classList.add("hiden");
  stopBtn.classList.remove("hiden");

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

  result.classList.remove("hiden");
  app.classList.add("before");
  gameBoard.classList.add("hiden");
  resultContainer.classList.remove("hiden");
  stopBtn.classList.add("hiden");
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

  intervalID = setInterval(timer, 1000);

  cardsRandomGenerator();
  addCardListeners();

  moveCountContainer.innerHTML = `<span>Moves: </span>00`;
  timeCountContainer.innerHTML = `<span>Time: </span>00:00`;
};

// ? event listeners for the start and stop button
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
