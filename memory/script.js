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
  { name: "Alegria", image: "images/alegria.png" },
  { name: "Tristeza", image: "images/tristeza.png" },
  { name: "Enojo", image: "images/enojo.png" },
  { name: "Ansiedad", image: "images/ansiedad.png" },
  { name: "Asco", image: "images/asco.png" },
  { name: "Calma", image: "images/calma.png" },
  { name: "Frustracion", image: "images/frustrado.png" },
  { name: "Miedo", image: "images/miedo.png" },
  { name: "Preocupacion", image: "images/preocupacion.png" },
  { name: "Satisfaccion", image: "images/satisfaccion.png" },
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
 * * If the card values match, pass the value to the modal function to display a modal of the emotion
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
            displayModal(firstCardValue);
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
  gameBoard.classList.remove("hidden");
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
  app.classList.add("before");
  gameBoard.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  stopBtn.classList.add("hidden");
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

// ? Event listeners for the start and stop button
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);

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
const modalImg = document.querySelector(".emotion-img");
const emotionName = document.querySelector(".emotion-name");
const emotionDesc = document.querySelector(".emotion-description");
const questionCont = document.querySelector(".question");

const continueGameBtn = document.getElementById("continue");

// ? Emotions elements list contains:
/**
 * * Emotion img src
 * * Emotion name
 * * Emotion description
 * * A question about the emotion
 */
const modalElements = {
  Alegria: {
    img: "./images/alegria.png",
    name: "Alegria",
    description:
      "Es cuando sientes una felicidad especial que te hace sonreír y reír. Puede ser cuando juegas con tus amigos, abrazas a tu mascota o pasas tiempo con tu familia. La alegria es como un regalo mágico que te hace sentir bien por dentro y te llena de energía y positividad.",
    question: "En que momento te sientes feliz?",
  },
  Tristeza: {
    img: "./images/tristeza.png",
    name: "Tristeza",
    description:
      "La tristeza es como una nube gris en el cielo de tus sentimientos. A veces, te hace sentir un poco apagado y sin muchas ganas de hacer cosas divertidas. Puede ser cuando extrañas a alguien, te sientes solo o algo no sale como esperabas. La tristeza es una emoción que todos sentimos a veces, y está bien.",
    question: "En que momento te sientes triste?",
  },
  Enojo: {
    img: "./images/enojo.png",
    name: "Enojo",
    description:
      "El enojo es como un volcán dentro de ti que quiere salir. Es cuando te sientes furioso por algo que pasó y puede hacerte sentir caliente y agitado. A veces, puedes sentir que quieres gritar o golpear algo. Pero es importante recordar que el enojo no es malo, es una emoción que te dice que algo no está bien.",
    question: "En que momento te sientes enojado?",
  },
  Ansiedad: {
    img: "./images/ansiedad.png",
    name: "Ansiedad",
    description:
      "La ansiedad es como una mariposa revoloteando en tu estómago. Es cuando sientes un poco de nerviosismo y preocupación por cosas que van a pasar. A veces, puede hacerte sentir inquieto e inseguro. Puede ser cuando tienes que hacer algo nuevo o enfrentar una situación desconocida. Pero recuerda que todos sienten ansiedad a veces, ¡incluso los adultos!",
    question: "En que momento sientes ansiedad?",
  },
  Asco: {
    img: "./images/asco.png",
    name: "Asco",
    description:
      "El asco es como una mueca en tu cara cuando encuentras algo que te parece muy desagradable. Es cuando sientes una sensación de rechazo y no quieres estar cerca de eso. Puede ser cuando ves algo que no te gusta en la comida o cuando tocas algo que te parece sucio. El asco es una manera de protegerte, para que no te acerques a cosas que podrían hacerte daño.",
    question: "En que momento sientes asco?",
  },
  Calma: {
    img: "./images/calma.png",
    name: "Calma",
    description:
      "Es cuando todo parece estar en su lugar y no hay prisas ni preocupaciones. Puedes sentir la calma cuando estás rodeado de cosas que te hacen sentir bien, como estar en un lugar tranquilo o hacer algo que te relaja. Es como si tu mente y tu corazón estuvieran en armonía, y te sientes en paz.",
    question: "En que momento te sientes calmado?",
  },
  Frustracion: {
    img: "./images/frustrado.png",
    name: "Frustracion",
    description:
      "La frustración es como un rompecabezas que no puedes resolver fácilmente. Es cuando te sientes atrapado porque algo no está saliendo como esperabas. Puede hacer que te sientas enojado y agobiado. Puede ser cuando intentas hacer algo y encuentras obstáculos en el camino. Pero recuerda, ¡todos enfrentamos momentos de frustración! Puedes tratar de tomar un descanso o pedir ayuda",
    question: "En que momento te sientes frustrado?",
  },
  Miedo: {
    img: "./images/miedo.png",
    name: "Miedo",
    description:
      "El miedo es como una sombra que se asoma cuando algo te hace sentir inseguro. Es cuando sientes un escalofrío o un nudo en el estómago porque te enfrentas a algo desconocido o que te preocupa. Puede ser cuando tienes que hacer algo nuevo o enfrentar algo que te da nervios. Aunque el miedo puede ser intimidante, recuerda que todos tenemos miedos a veces.",
    question: "En que momento sientes miedo?",
  },
  Preocupacion: {
    img: "./images/preocupacion.png",
    name: "Preocupacion",
    description:
      "La preocupación es como una pequeña nube que flota en tu mente. Es cuando te sientes inquieto por algo que podría pasar en el futuro. Puede hacer que pienses mucho en las cosas y te sientas nervioso. La preocupación a veces es como un recordatorio de que te importa algo, pero también puede ser abrumadora. Puedes manejarla hablando sobre lo que te preocupa con alguien de confianza.",
    question: "En que momento te sientes preocupado?",
  },
  Satisfaccion: {
    img: "./images/satisfaccion.png",
    name: "Satisfaccion",
    description:
      "La satisfacción es como un cálido abrazo que envuelve tu corazón. Es cuando sientes una sensación de logro y contento por haber alcanzado algo que te propusiste. Puede ser cuando terminas una tarea difícil o cuando ves los frutos de tu esfuerzo. La satisfacción te hace sonreír y sentirte orgulloso de ti mismo.",
    question: "En que momento te sientes satisfecho?",
  },
};

// ? Display modal function
/**
 *
 * @param Emotion - emotion name
 * * Search the emotion name in the modal elements list
 * * Set the modal elements to the modal elements list
 * * Show the modal
 * * Clear the interval to pause the game
 */
const displayModal = (emotion) => {
  elements = modalElements[emotion];
  modalImg.src = elements.img;
  emotionName.innerText = elements.name;
  emotionDesc.innerText = elements.description;
  questionCont.innerText = elements.question;
  modal.classList.remove("hidden");
  clearInterval(intervalID);
};

// ? Continue btn event listener to hide the modal and continue the game time countdown
continueGameBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  intervalID = setInterval(timer, 1000);
});
