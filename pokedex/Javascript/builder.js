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
    if (pkmnData.sprites.front_default == null) {
      $pkmnimage.src = `assets/Missingno.webp`;
    } else {
      $pkmnimage.src = pkmnData.sprites.front_default;
    }
  } else {
    if (pkmnData == null) {
      $pkmnimage.src = `assets/Missingno.webp`;
    } else {
      $pkmnimage.src = pkmnData;
    }
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
  let fragment = document.createDocumentFragment();

  let $pkmnView = CreatePokemonView(pkmnData, true);
  fragment.appendChild($pkmnView);

  let $types = CreatePokemonTypes([...pkmnData.types], true);
  fragment.appendChild($types);

  let $info = CreatePokemonInfo([pkmnData.id, pkmnData.name]);
  fragment.appendChild($info);
  $view.dataset.id = pkmnData.id;

  $view.appendChild(fragment);

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
 * ? This function retrieves Pokémon data and generates Pokémon card views.
 * * - It creates a viewer for displaying Pokémon card views.
 * * - Iterates through a list of Pokémon data.
 * * - Fetches Pokémon data from the provided URLs or Pokémon URLs.
 * * - Creates a card view for each Pokémon data and appends it to the viewer.
 * * - Sets the 'Currently' class to the last viewed Pokémon.
 * * - Clears the screen and displays the viewer.
 *
 * @param {Array of objects} pkmns - An array of Pokémon urls
 */

export const getPkmns = async (pkmns) => {
  let $viewer = CreatePokemonViewer();
  let fragment = document.createDocumentFragment();

  for (let pkmn of pkmns) {
    let pkmnData = null;

    try {
      //
      if (pkmn.pokemon) {
        //
        let pkmnResponse = await fetch(pkmn.pokemon.url);
        pkmnData = await pkmnResponse.json();
        //
      } else {
        //
        let pkmnResponse = await fetch(pkmn.url);

        if (pkmnResponse.status == 404) {
          return;
        } else {
          pkmnData = await pkmnResponse.json();
        }
      }

      let $view = CreatePokemonCard(pkmnData);
      $view.classList.add("Pokemon");

      fragment.appendChild($view);
    } catch (err) {
      console.log(err);
    }
  }

  $viewer.appendChild(fragment);

  $screen.innerHTML = "";
  $screen.appendChild($viewer);

  document
    .querySelectorAll(".View")
    [lastPokemonView].classList.add("Currently");

  isCharging = false;
};
