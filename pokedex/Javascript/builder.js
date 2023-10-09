// ! UI Builder Module

import { lastPokemonView } from "./index.js";

// ? Export the $screen of the gameboy DOM element
export const $screen = document.querySelector(".Screen");

// ! Formatter Functions

// ? This function capitalizes the first letter of a given string and returns the capitalized string.

export const Capitalizer = (string) => {
  const capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
  return capitalizedString;
};

// ? This function formats a number as a string with a '#' prefix and leading zeros, if needed.

const NumberFormater = (number) => {
  if (typeof number != "number") {
    return number;
  }

  if (number < 10) {
    return "#00" + number;
  } else if (number < 100) {
    return "#0" + number;
  } else {
    return "#" + number;
  }
};

// ! Build UI Components Functions

// ? This function creates a loader element and appends it to the '$screen' element.
/**
 * * - It creates a loader div element.
 * * - It creates a loader content div element.
 * * - It creates an image element for the Pokeball loader.
 * * - It adds the image to the loader div.
 * * - It appends the loader content div to the loader div.
 * * - Finally, it appends the loader div to the '$screen' element.
 */

export const createLoader = () => {
  isCharging = true;
  $screen.innerHTML = "";
  const $loader = document.createElement("div");
  $loader.classList.add("Loader");
  $loader.classList.add("Center");

  const $loaderContent = document.createElement("div");
  $loaderContent.classList.add("LoaderContent");
  $loaderContent.classList.add("Center");

  $loader.innerHTML = `<img src="assets/pokeball.png" class="PokeballLoader" alt="pokeball loader">`;

  $loader.appendChild($loaderContent);
  $screen.appendChild($loader);
};

// ? This function creates a Pokémon view element based on the provided Pokémon data.
/**
 * * - It creates a div element for the Pokémon view.
 * * - It adds classes for styling and centering.
 * * - It creates an image element for the Pokémon sprite and sets its source from the provided data.
 * * - It appends the image to the Pokémon view.
 * * - Finally, it returns the created Pokémon view element.
 */

export const CreatePokemonView = (pkmnData, isJSON) => {
  const $pkmnview = document.createElement("div");
  $pkmnview.classList.add("PkmnView");
  $pkmnview.classList.add("PkmnViewStyle");
  $pkmnview.classList.add("Center");
  $pkmnview.classList.add("Shadow4");

  const $pkmnimage = document.createElement("img");
  $pkmnimage.classList.add("PkmnSprite");

  if (isJSON == true) {
    $pkmnimage.src = pkmnData.sprites.front_default;
  } else {
    $pkmnimage.src = pkmnData;
  }

  $pkmnview.appendChild($pkmnimage);

  return $pkmnview;
};

/**
 * ? This function creates a Pokémon types element based on the provided Pokémon data.
 * * - It creates a div element for the Pokémon types.
 * * - It adds classes for styling and centering.
 * * - It iterates through the data types and creates a div for each type.
 * * - For each type div, it sets the appropriate class and text content based on the type name.
 * * - If there's only one type, it creates a "Null" type div for consistency.
 * * - Finally, it returns the created Pokémon types element.
 */

export const CreatePokemonTypes = (types, isJSON) => {
  let dataTypes = [];

  if (isJSON == true) {
    types.forEach((type) => {
      dataTypes.push(type.type.name);
    });
  } else {
    dataTypes = types;
  }

  const $types = document.createElement("div");
  $types.classList.add("PkmnTypes");
  $types.classList.add("CenterBetween");

  dataTypes.forEach((type) => {
    const $type = document.createElement("div");
    $type.classList.add("Type");
    $type.classList.add("Center");
    $type.classList.add("Shadow2");
    $type.classList.add(Capitalizer(type));
    const $typeP = document.createElement("p");
    if (type.length > 5) {
      $typeP.classList.add("Font12");
    } else if (type.length >= 8) {
      $typeP.classList.add("Font10");
    } else {
      $typeP.classList.add("Font14");
    }
    $typeP.textContent = Capitalizer(type);
    $type.appendChild($typeP);
    $types.appendChild($type);
  });

  if (dataTypes.length == 1) {
    const $type = document.createElement("div");
    $type.classList.add("Type");
    $type.classList.add("Center");
    $type.classList.add("Shadow2");
    $type.classList.add("Null");
    const $typeP = document.createElement("p");
    $typeP.classList.add("Font14");
    $typeP.textContent = "Null";
    $type.appendChild($typeP);
    $types.appendChild($type);
  }

  return $types;
};

/**
 * ? This function creates a Pokémon info --Number and Name-- element based on the provided Pokémon data.
 * * - It creates a div element for the Pokémon info.
 * * - It adds classes for styling and centering.
 * * - It creates div elements for Pokémon number and name.
 * * - It sets the appropriate classes and text content for the number and name.
 * * - It appends the number and name div elements to the info element.
 * * - Finally, it returns the created Pokémon info element.
 */

export const CreatePokemonInfo = (pkmnData) => {
  let id = pkmnData[0];
  let name = pkmnData[1];

  const $info = document.createElement("div");
  $info.classList.add("PkmnInfo");
  $info.classList.add("CenterEvenly");
  $info.classList.add("Shadow2");

  const $pkmnNumber = document.createElement("div");
  const $pkmnName = document.createElement("div");

  $pkmnNumber.classList.add("PkmnNumber");
  $pkmnNumber.textContent = NumberFormater(id);

  $pkmnName.classList.add("PkmnName");
  $pkmnName.textContent = Capitalizer(name);

  $info.appendChild($pkmnNumber);
  $info.appendChild($pkmnName);

  return $info;
};

/**
 * ? This function creates a Pokémon card element based on the provided Pokémon data.
 * * - It creates a div element for the card.
 * * - It creates a Pokémon view element using 'CreatePokemonView' and appends it to the card.
 * * - It creates Pokémon types element using 'CreatePokemonTypes' and appends it to the card.
 * * - It creates Pokémon info element using 'CreatePokemonInfo' and appends it to the card.
 * * - It sets the dataset id attribute of the card to the Pokémon's ID.
 * * - Finally, it returns the created Pokémon card element.
 */

const CreatePokemonCard = (pkmnData) => {
  const $view = document.createElement("div");
  $view.classList.add("View");

  let $pkmnView = CreatePokemonView(pkmnData, true);
  $view.appendChild($pkmnView);

  let $types = CreatePokemonTypes([...pkmnData.types], true);
  $view.appendChild($types);

  let $info = CreatePokemonInfo([pkmnData.id, pkmnData.name]);
  $view.appendChild($info);
  $view.dataset.id = pkmnData.id;

  return $view;
};

/**
 * ? This function creates and returns a Pokémon viewer container element.
 * * - It creates a div element '$viewer'.
 * * - It adds CSS classes for centering and styling.
 * * - Finally, it returns the created '$viewer' element.
 */

export const CreatePokemonViewer = () => {
  let $viewer = document.createElement("div");
  $viewer.classList.add("CenterColumn");
  $viewer.classList.add("Viewer");

  return $viewer;
};

/**
 * ? This function fetches and displays Pokémon data for a list of Pokémon.
 * * - It creates a div element '$viewer' to contain Pokémon cards.
 * * - It iterates through the list of Pokémon ('pkmns') and fetches data for each Pokémon.
 * * - For each Pokémon, it creates a card using 'CreatePokemonCard' and appends it to '$viewer'.
 * * - It applies CSS classes to '$viewer' for styling.
 * * - It clears the '$screen' element and appends '$viewer' to it.
 * * - It sets the 'Currently' class to the first Pokémon card for initial display.
 *
 * @param {Array} pkmns - An array of Pokémon objects.
 */

export const getPkmns = async (pkmns) => {
  let $viewer = CreatePokemonViewer();

  for (let pkmn of pkmns) {
    try {
      let pkmnResponse = await fetch(pkmn.url);
      const pkmnData = await pkmnResponse.json();

      let $view = CreatePokemonCard(pkmnData);

      $viewer.appendChild($view);
    } catch (err) {
      console.log(err);
    }
  }
  $screen.innerHTML = "";
  $screen.appendChild($viewer);
  document
    .querySelectorAll(".View")
    [lastPokemonView].classList.add("Currently");
  isCharging = false;
};
