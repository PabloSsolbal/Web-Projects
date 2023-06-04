//this code creates a memory game
//first select the elements that will be used
const app = document.querySelector(".app"); //game container
const gameBoard = document.querySelector(".board"); //game board
const moveCountContainer = document.querySelector(".move-count"); //move count container
const timeCountContainer = document.querySelector(".time-count"); //time count container
const cardsContainer = document.querySelector(".cards-container"); //cards grid container
const resultContainer = document.querySelector(".results-container"); //results container
const result = document.getElementById("result"); //results
//buttons
const stopBtn = document.getElementById("stop"); //stop button
const startBtn = document.getElementById("start"); //start button
//variables
let moveCount = 0;
let seconds = 0;
let minutes = 0;
let winCount = 0;
let intervalID = null;
let firstCard = false;
let secondCard = false;
let firstCardValue = "";

//items array for the cards
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

//functions
//timer function for the game
const timer = () => {
  //first, increase the seconds
  seconds += 1;
  //timer logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //formatting the time (00:00)
  let fseconds = seconds < 10 ? `0${seconds}` : seconds;
  let fminutes = minutes < 10 ? `0${minutes}` : minutes;
  //update the time count
  timeCountContainer.innerHTML = `<span>Time: </span>${fminutes}:${fseconds}`;
};
//move counter function
const moveCounter = () => {
  //first, increase the moves
  moveCount += 1;
  //formatting the move count if <10 add 0
  let fmoveCount = moveCount < 10 ? `0${moveCount}` : moveCount;
  //update the move count
  moveCountContainer.innerHTML = `<span>Moves: </span>${fmoveCount}`;
};
//shuffle cards function
const shuffleArray = (array) => {
  //shuffle logic
  //Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    //run array from the last element to the first
    const j = Math.floor(Math.random() * (i + 1));
    //swap elements
    [array[i], array[j]] = [array[j], array[i]];
  }
  //return the shuffled array
  return array;
};
//card generator function
const cardsRandomGenerator = () => {
  //clean the cards container
  cardsContainer.innerHTML = "";
  //create a new array with the items and the items
  const pairedCards = [...items, ...items];
  //shuffle the array
  const shuffledCards = shuffleArray(pairedCards);
  //create the cards
  shuffledCards.forEach((card) => {
    //for every element in the array, create a card div
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    //set the card value
    cardElement.setAttribute("card-value", card.name);
    //create the reverse of the card
    const reverseCard = document.createElement("div");
    reverseCard.classList.add("card-reverse");
    reverseCard.textContent = "?";
    //create the front of the card
    const frontCard = document.createElement("div");
    frontCard.classList.add("card-front");
    frontCard.innerHTML = `<img src="${card.image}" alt="${card.name}"> <p class="emotion-desc">${card.name}</p>`;
    //append the reverse and the front to the card
    cardElement.appendChild(reverseCard);
    cardElement.appendChild(frontCard);
    //append the card to the cards container
    cardsContainer.appendChild(cardElement);
  });
};
//create the audio for the flipped cards
const flip = new Audio();
flip.src = "sounds/flipcard.mp3";
//create the listener for the cards
const addCardListeners = () => {
  //select all the cards
  cardsElements = document.querySelectorAll(".card");
  //add the listener to each card
  cardsElements.forEach((cardE) => {
    cardE.addEventListener("click", (e) => {
      //prevent the default behavior
      e.preventDefault();
      //check if the card is not matched or flipped
      if (
        !cardE.classList.contains("matched") &&
        !cardE.classList.contains("flipped")
      ) {
        //play the audio for the flipped card
        flip.play();
        //add the flipped class
        cardE.classList.add("flipped");
        //check if firstCard are null
        if (!firstCard) {
          //if it is not null, the card is the firstCard
          firstCard = cardE;
          //get the card value
          firstCardValue = cardE.getAttribute("card-value");
        } else {
          //else the card is the secondCard
          //play the flip audio
          flip.play();
          //the card is the second card flipped so add a move
          moveCounter();
          secondCard = cardE;
          //get the card value
          let secondCardValue = cardE.getAttribute("card-value");
          //check if the values are the same
          if (firstCardValue == secondCardValue) {
            //if are the same add the matched class to both cards
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard false again
            firstCard = false;
            //aument the win count
            winCount += 1;

            //check if the win count is equal to the cards
            if (winCount == Math.floor(cardsElements.length / 2)) {
              //set a timeout to end the game before showing the result because all the cards are matched
              setTimeout(() => {
                //show the final time and moves
                let fseconds = seconds < 10 ? `0${seconds}` : seconds;
                let fminutes = minutes < 10 ? `0${minutes}` : minutes;
                result.innerHTML = `<span>Time: </span>${fminutes}:${fseconds}   <span>Moves: </span>${moveCount}`;
                //call the stop function
                stop();
              }, 1500);
            }
          } else {
            //if cards values are different flip the cards to reverse again
            let temporalFirst = firstCard;
            let temporalSecond = secondCard;
            //set the cards back to false
            firstCard = false;
            secondCard = false;
            //set a timeout to backflip the cards
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
//start game function
const start = () => {
  //reset the variables
  seconds = 0;
  minutes = 0;
  moveCount = 0;
  //change the class of the elements
  app.classList.remove("before");
  gameBoard.classList.remove("hiden");
  resultContainer.classList.add("hiden");
  stopBtn.classList.remove("hiden");
  //call the starter function
  starter();
  //scroll to the bottom of the page to center the game
  window.scrollTo(0, document.documentElement.scrollHeight);
};
//stop game function
const stop = () => {
  //first clear the interval
  clearInterval(intervalID);
  //change the class of the elements
  result.classList.remove("hiden");
  app.classList.add("before");
  gameBoard.classList.add("hiden");
  resultContainer.classList.remove("hiden");
  stopBtn.classList.add("hiden");
};
//starter function for the game
const starter = () => {
  //clear the result container
  result.innerText = "";
  //set the win count to 0
  winCount = 0;
  //start the timer
  intervalID = setInterval(timer, 1000);
  //call the card generator function and the card listener function
  cardsRandomGenerator();
  addCardListeners();
  //reset the move count and time count content
  moveCountContainer.innerHTML = `<span>Moves: </span>00`;
  timeCountContainer.innerHTML = `<span>Time: </span>00:00`;
};
//add listeners to the buttons
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
