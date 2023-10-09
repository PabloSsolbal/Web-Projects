// ! Import the necesary functions and variables
import { CreateInfoView, pkmnObject } from "./app.js";

import { $screen, CreatePokemonViewer, createLoader } from "./builder.js";

// ? API URL to get the cards data
let API = "https://pokemontcg-1-b2036309.deta.app/TcgData/";

// ? Variable to count the cards and chek if is odd or even
let cardCounter = 1;

/**
 * ? This function sets the Pokémon cards data for the current Pokémon based on its name.
 * * - It retrieves Pokémon card data from the API using the Pokémon's name.
 * * - The fetched data is stored in the 'pkmnObject.cards' property.
 */

export const SetPokemonCards = async () => {
  const PokemonName = pkmnObject.name;

  const Response = await fetch(API + PokemonName);
  const Data = await Response.json();

  pkmnObject.cards = Data;
};

/**
 * ? Function to create card element
 * ? This function creates a card element based on the provided card data.
 * * It alternates between two styles for card elements based on the cardCounter.
 * * -Each card includes an image, card name, and rarity.
 * @param {Object} card - The card object containing information such as name, imageUrl, and rarity.
 * @returns {HTMLElement} - The card element as an HTML div.
 */

const CreateCards = (card) => {
  const $Card = document.createElement("div");
  $Card.classList.add("Card");

  try {
    if (cardCounter % 2 == 0) {
      $Card.classList.add("CenterEvenlyColumnReverse");
    } else {
      $Card.classList.add("CenterEvenlyColumn");
    }

    const $CardImage = document.createElement("img");
    $CardImage.src = card.imageUrl;
    $CardImage.classList.add("CardImage");
    $CardImage.classList.add("Shadow4");

    // ? Create text function

    const createCardText = (text) => {
      const $CardText = document.createElement("p");
      $CardText.textContent = text;
      $CardText.classList.add("Font10");

      return $CardText;
    };

    const $CardInfo = document.createElement("div");
    $CardInfo.classList.add("CardInfo");
    $CardInfo.classList.add("CenterColumn");
    $CardInfo.classList.add("Shadow2");

    const $Name = createCardText(card.name);
    const $Rarity = createCardText(card.rarity);

    $CardInfo.appendChild($Name);
    $CardInfo.appendChild($Rarity);

    $Card.appendChild($CardImage);
    $Card.appendChild($CardInfo);

    cardCounter++;
  } catch (error) {
    console.log(error);
  }
  return $Card;
};

/**
 * ? This function creates a view for a list of Pokémon cards.
 * * - It creates a grid container for the cards and appends each card element to it.
 * * - Returns the grid container with all the card elements.
 * @param {Array} -an array that contain the cards objects
 * @returns {HTMLElement} - The grid container with all the card elements.
 */

const createCardsView = (cards) => {
  const $CardsGrid = document.createElement("div");
  $CardsGrid.classList.add("GridCards");

  for (let card of cards) {
    const $CardElement = CreateCards(card);
    $CardsGrid.appendChild($CardElement);
  }

  return $CardsGrid;
};

/**
 * ? This function generates and displays Pokémon card views.
 * * - It creates a viewer for displaying card views.
 * * - Divides the card data into groups of 2 and creates card views for each group.
 * * - Appends card views to the viewer.
 * * - Sets a timeout to clear the screen and display the card viewer.
 */

export const CreateCardsViews = () => {
  createLoader();

  const $Viewer = CreatePokemonViewer();
  const cards = pkmnObject.cards;

  const CardsCreator = (CardsArray) => {
    const $View = CreateInfoView();
    $View.classList.add("WhiteBg");
    $View.classList.add("Shadow4");

    const $CardsView = createCardsView(CardsArray);

    $View.appendChild($CardsView);
    $Viewer.appendChild($View);
  };

  const CardDivisor = () => {
    const CardsArray = [];
    for (let card = 0; card < 2; card++) {
      const CardElement = cards.pop(card);
      CardsArray.push(CardElement);
    }
    CardsCreator(CardsArray);
  };

  while (cards.length > 0) {
    CardDivisor();
  }

  cardCounter = 1;

  setTimeout(() => {
    $screen.innerHTML = "";
    $screen.appendChild($Viewer);
    document.querySelectorAll(".View")[0].classList.add("Currently");
    isCharging = false;
  }, 5500);
};
