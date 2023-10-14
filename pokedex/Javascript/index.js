/**
* @file Index file for the pokedex project.
* @author Pablo Solbal <pablossolbal@gmail.com>
* @copyright Pablo Solbal 2023
* @license MIT
/** @version 1.1*/
/**
 * @todo
 * * - Fix minor bugs in search functions.
 * * - Improve the use of names for card searches.
 * * - Enhance loading times.
 * * - Add visualization of Pokémon evolutions.
 * * - Add Pokémon description display.
 * * - Begin working on the team builder feature.
 */

// ! Import the required modules
import {
  LogPokemon,
  pkmnObject,
  createPokemonInfo,
  CreateAttacksViews,
  SearchPokemonByName,
  SearchPokemonByType,
  SearchConstructor,
  CreateSearcher,
} from "./app.js";

import { Capitalizer, createLoader, getPkmns, $screen } from "./builder.js";

import { SetPokemonCards, CreateCardsViews } from "./tcg.js";

// ? select the DOM elements
/**
 * * Select button -Previous btn-
 * * Start button -Next btn-
 * * Got It button -Close and remember btn for the instructions modal-
 * * Instructions modal
 * * Configuration modal
 * * All buttons -To apply interactive effects-
 * * Button to change the audio configuration
 */
const $select = document.querySelector(".Select");
const $start = document.querySelector(".Start");
const $gotItBtn = document.querySelector(".CloseAndRemember");
const $instructions = document.querySelector(".Instructions");
const $configuration = document.querySelector(".Config");
const $btns = document.querySelectorAll(".Btn");
const $soundConfig = document.querySelector(".BlockSound p");

// ? Create the audio for the clicks
const PressSound = new Audio();
PressSound.src = "assets/press.mp3";

// ? Create the URL const
let url = "https://pokeapi.co/api/v2/pokemon/";

let PokemonDataId = null;

// ? Variable to save the last pokemon page
let lastUrl = "";

// ? set the currently counter in 0
// * --to check the currently displayed view--
export let currentlyCounter = 0;

// ? varialbe to save the index of the last Pokemon View
export let lastPokemonView = 0;

// ? Boolean to check if the content is loading
window.isCharging = false;

// ? Boolean to check if the app is in home view
window.areInHome = true;

// ? Variable to save the las type searched --
window.Type = null;

// ! Pokemon DataSet Functions

// ? This function takes a 'data' object as an argument and extracts Pokémon types from it.
// ? Then, it converts the type names to capitalize and stores them in an array 'pkmnObject.types'.
/**
 * * - Initialize a variable 'types' with the Pokémon types from the 'data' object.
 * * - Initialize an empty array 'pkmnObject.types'.
 * * - Use a 'forEach' loop to convert the type names to Capitalize and add them to the 'pkmnObject.types' array.
 */

const SetPokemonTypes = (data) => {
  let types = data.types;

  pkmnObject.types = [];

  types.forEach((type) => {
    pkmnObject.types.push(Capitalizer(type.type.name));
  });
};

// ? This function takes a 'data' object as an argument and extracts Pokémon abilities from it.
// ? It fetches additional data for each ability, such as name and description, and stores them in 'pkmnObject.abilities'.
/**
 * * - Initialize a variable 'abilities' with the Pokémon abilities from the 'data' object.
 * * - Initialize an empty array 'Abilities'.
 * * - Iterate through 'abilities' to create an array of ability objects with 'url' and 'isHiden' properties.
 * * - Initialize a variable 'AbilityObject' to null.
 * * - Initialize an empty array 'pkmnObject.abilities'.
 * * - For each ability in 'Abilities', fetch additional data, including name and description, and store it in 'pkmnObject.abilities'.
 */

const SetPokemonAbilities = async (data) => {
  let abilities = data.abilities;

  let Abilities = [];
  abilities.forEach((ability) =>
    Abilities.push({ url: ability.ability.url, isHiden: ability.is_hidden })
  );

  let AbilityArray = [];

  for (const ability of Abilities) {
    try {
      const data = await fetch(ability.url);
      const abilityData = await data.json();
      const entries = abilityData.effect_entries;

      let AbilityDescription = null;
      let AbilityName = null;
      let isHidden = ability.isHiden;

      for (const entry of entries) {
        if (entry.language.name === "en") {
          AbilityDescription = entry.short_effect;
          AbilityName = Capitalizer(abilityData.name);

          let AbilityObject = {
            name: AbilityName,
            description: AbilityDescription,
            isHidden: isHidden,
          };

          AbilityArray.push(AbilityObject);
        }
      }
    } catch (error) {
      console.log("here");
      console.log(error);
    }
    pkmnObject.abilities = AbilityArray;
  }
};

// ? This function takes a 'data' object as an argument and extracts Pokémon moves from it.
// ? It fetches additional data for each move, such as name, accuracy, power, class, and type, and stores them in 'pkmnObject.moves'.
/**
 * * - Initialize an empty array 'movesSet'.
 * * - Initialize a variable 'moves' with the Pokémon moves from the 'data' object.
 * * - Iterate through 'moves' to create an array 'movesSet' containing move URLs.
 * * - Initialize an empty array 'pkmnObject.moves'.
 * * - For each move URL in 'movesSet', fetch additional data, including name, accuracy, power, class, and type,
 * *   and store it in 'pkmnObject.moves'.
 */

const SetPokemonMoves = async (data) => {
  try {
    const movesSet = data.moves.map((mov) => mov.move.url);
    pkmnObject.moves = [];

    for (const move of movesSet) {
      const data = await fetch(move);
      const moveData = await data.json();

      const MoveName = Capitalizer(moveData.name);
      const Accuracy = moveData.accuracy;
      const Power = moveData.power;
      const Class = Capitalizer(moveData.damage_class.name);
      const Type = Capitalizer(moveData.type.name);

      const Move = {
        name: MoveName,
        accuracy: Accuracy,
        power: Power,
        class: Class,
        type: Type,
      };

      pkmnObject.moves.push(Move);
    }
  } catch (error) {
    console.log("Error fetching moves:", error);
  }
};

// ? This function takes a 'data' object as an argument and extracts Pokémon stats from it.
// ? It creates a JavaScript object 'pkmnStats' with the stat names as keys and their base values as values,
// ? and then stores 'pkmnStats' in 'pkmnObject.stats'.
/**
 * * - Initialize a variable 'stats' with the Pokémon stats from the 'data' object.
 * * - Initialize an empty object 'pkmnStats'.
 * * - Iterate through 'stats' to create an object 'pkmnStats' with stat names capitalized as keys and their base values as values.
 * * - Store 'pkmnStats' in 'pkmnObject.stats'.
 */

const SetPokemonStats = (data) => {
  let stats = data.stats;
  let pkmnStats = {};

  stats.forEach((stat) => {
    let StatName = Capitalizer(stat.stat.name);
    if (StatName == "Special-attack") {
      StatName = "Sp.Attack";
    }
    if (StatName == "Special-defense") {
      StatName = "Sp.Defense";
    }
    let StatValue = stat.base_stat;

    pkmnStats[StatName] = StatValue;
  });

  pkmnObject.stats = pkmnStats;
};

// ? This function takes a 'data' object as an argument and extracts Pokémon physical information from it.

const SetPokemonPhysInfo = (data) => {
  pkmnObject.weight = (data.weight / 10).toFixed(1) + " kg";
  pkmnObject.height = (data.height / 10).toFixed(1) + " m";
};

// ? Function to get the sprites of the pokemon
// * -front and back- for normal and shiny version

const SetPokemonSprites = (data) => {
  const spritesData = data.sprites;

  let sprites = [
    spritesData.front_default,
    spritesData.back_default,
    spritesData.front_shiny,
    spritesData.back_shiny,
  ];

  pkmnObject.sprites = sprites;
};

// ? function that split the name -if is necesary-

const PokeName = (name) => {
  if (name.includes("-")) {
    name = name.split("-")[0];
  }
  return name;
};

// ? This asynchronous function 'getPkmnData' retrieves Pokémon data based on an 'id'.
// ? It makes API requests, processes the data, and updates 'pkmnObject' with the retrieved information.
/**
 * * - Asynchronously fetches Pokémon data using the provided 'id'.
 * * - Calls various functions to set Pokémon types, abilities, moves, stats, and physical information in 'pkmnObject'.
 * * - Capitalizes the Pokémon name and stores it in 'pkmnObject.name'.
 * * - Logs the 'pkmnObject' to provide information about the Pokémon.
 */

export const getPkmnData = async (id) => {
  createLoader();
  try {
    let pkmnResponse = await fetch(url + id);
    let data = await pkmnResponse.json();

    await SetPokemonTypes(data);
    await SetPokemonAbilities(data);
    await SetPokemonMoves(data);
    await SetPokemonStats(data);
    await SetPokemonPhysInfo(data);
    await SetPokemonSprites(data);

    let pokeName = await Capitalizer(data.name);
    pkmnObject.name = await PokeName(pokeName);

    await SetPokemonCards();

    pkmnObject.id = parseInt(id);

    LogPokemon(pkmnObject);
    createPokemonInfo(pkmnObject);
    currentlyCounter = 0;

    $select.removeAttribute("href");
    $start.removeAttribute("href");
  } catch (error) {
    console.log("Error fetching Pokémon data:", error);
  }
};

// ! Interactive Functions

// ? The 'Slider' function handles the logic for a slider based on the provided button 'btn'.
// ? It updates the currently displayed view in a set of views with a "Currently" class.
/**
 * * - Selects all elements with the class "View" and stores them in '$views'.
 * * - If the 'btn' matches the class "Left", it removes the "Currently" class from the current view,
 * *   decrements 'currentlyCounter', and adds the "Currently" class to the previous view.
 * * - If 'currentlyCounter' becomes negative, it wraps around to the last view.
 * * - If the 'btn' matches the class "Right", it removes the "Currently" class from the current view,
 * *   increments 'currentlyCounter', and adds the "Currently" class to the next view.
 * * - If 'currentlyCounter' exceeds the number of views, it wraps around to the first view.
 */

const Slider = (btn) => {
  const $views = document.querySelectorAll(".View");

  if (btn.matches(".Left")) {
    $views[currentlyCounter].classList.remove("Currently");
    currentlyCounter--;

    if (currentlyCounter < 0) {
      currentlyCounter = $views.length - 1;
    }
    $views[currentlyCounter].classList.add("Currently");
  }

  if (btn.matches(".Right")) {
    $views[currentlyCounter].classList.remove("Currently");
    currentlyCounter++;

    if (currentlyCounter >= $views.length) {
      currentlyCounter = 0;
    }
    $views[currentlyCounter].classList.add("Currently");
  }
};

// ? The 'ThemeChanger' function is responsible for changing the theme color.
// ? It updates the background color of an element with the class "Background" and stores the selected color in local storage.
/**
 * * - Selects the element with the class "Background" and stores it in '$background'.
 * * - Removes the current theme class from '$background'.
 * * - Adds the specified 'color' class to '$background' to change the theme color.
 * * - Stores the selected 'color' in local storage with the key "Theme".
 */

const ThemeChanger = (color) => {
  const $background = document.querySelector(".Background");
  $background.classList.remove($background.classList[2]);
  $background.classList.add(color);
  localStorage.setItem("Theme", color);
};

// ? The 'PressedBtn' function is responsible for playing a button press sound if the sound is enabled in local storage.
// ? It resets the audio playback to the beginning (currentTime) and plays the sound.
/**
 * * - Resets the current time of the 'PressSound' to the beginning (0).
 * * - Checks if sound is enabled in local storage using the key "sound".
 * * - If sound is enabled (value is "true"), it plays the 'PressSound'.
 */

const PressedBtn = () => {
  PressSound.currentTime = 0;
  if (localStorage.getItem("sound") === "true") {
    PressSound.play();
  }
};

// ! Initial App Functions

// ? This asynchronous function 'loadPkmns' is responsible for loading Pokémon data from a given 'url'.
// ? It fetches the data, handles errors, and updates the user interface accordingly.
/**
 * * - Asynchronously fetches Pokémon data from the provided 'url'.
 * * - Checks for any response errors and throws an error with status and statusText if one occurs.
 * * - Clears the content of the '$screen' element and displays a loader.
 * * - Updates links in the user interface for pagination based on 'data.previous' and 'data.next'.
 * * - Calls 'getPkmns' function to process and display the Pokémon data.
 */

async function loadPkmns(Url) {
  lastUrl = Url;
  try {
    const response = await fetch(Url);
    let data = await response.json();

    if (!response.ok)
      throw { status: response.status, statusText: response.statusText };

    $screen.innerHTML = "";
    createLoader();

    $select.removeAttribute("href");
    $start.removeAttribute("href");

    if (data.previous) {
      $select.setAttribute("href", `${data.previous}`);
    }
    if (data.next) {
      $start.setAttribute("href", `${data.next}`);
    }

    try {
      getPkmns(data.results);
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.log(error);
  }
}

// ? Initialization App Configurations for the user
// ? This code initializes app configurations for the user when the DOM content is loaded.
// ? It sets up various aspects of the app based on the user's previous settings stored in local storage.
/**
 * * - Listens for the "DOMContentLoaded" event to ensure the DOM is fully loaded.
 * * - Calls 'loadPkmns(url)' to load Pokémon data from the given 'url'.
 * * - Checks if a theme color is stored in local storage and sets the theme using 'ThemeChanger'.
 * * - Checks if the "ShowInstructions" flag is set in local storage and hides or displays instructions accordingly.
 * * - Checks if the "sound" flag is set in local storage and updates the sound configuration text accordingly.
 * * - If the "sound" flag is not present in local storage, it sets it to "true" as a default value.
 */

document.addEventListener("DOMContentLoaded", () => {
  loadPkmns(url);

  if (localStorage.getItem("Theme")) {
    ThemeChanger(localStorage.getItem("Theme"));
  }

  if (localStorage.getItem("ShowInstructions")) {
    $instructions.classList.add("Hide");
  } else {
    $instructions.classList.remove("Hide");
  }

  if (
    localStorage.getItem("sound") === "true" ||
    localStorage.getItem("sound") == "false"
  ) {
    if (localStorage.getItem("sound") === "true") {
      $soundConfig.textContent = "Sound: ON";
    } else {
      $soundConfig.textContent = "Sound: OFF";
    }
  } else if (localStorage.getItem("sound") == null) {
    localStorage.setItem("sound", "true");
  }
});

// ! Event Listeners

document.addEventListener("click", (e) => {
  // ? If the gameboy is loading the data prevent the use of the buttons in the UI
  if (isCharging == false) {
    // ? Checks if the clicked element or its parent matches the class "Start" or "Start p".
    //  * If a match is found, it extracts the 'href' attribute from the clicked element or its parent and uses it to load Pokémon data.
    // * It also resets the 'currentlyCounter' to 0.

    if (e.target.matches(".Start") || e.target.matches(".Start p")) {
      if (areInHome == true) {
        let $Currently = document.querySelector(".Currently");
        let url = e.target.getAttribute("href");

        if (e.target.matches(".Start p")) {
          url = e.target.parentElement.getAttribute("href");
        }

        if ($Currently.classList.contains("Pokemon")) {
          if (url) {
            loadPkmns(url);
            currentlyCounter = 0;
            lastPokemonView = 0;
          }
        }
      }
    }

    // ? Checks if the clicked element or its parent matches the class "Select" or "Select p".
    // * If a match is found, extracts the 'href' attribute from the clicked element or its parent, and uses it to load Pokémon data.
    // * It also resets the 'currentlyCounter' to 0.

    if (e.target.matches(".Select") || e.target.matches(".Select p")) {
      if (areInHome == true) {
        let $Currently = document.querySelector(".Currently");
        let url = e.target.getAttribute("href");

        if (e.target.matches(".Select p")) {
          url = e.target.parentElement.getAttribute("href");
        }

        if ($Currently.classList.contains("Pokemon")) {
          if (url) {
            loadPkmns(url);
            currentlyCounter = 0;
            lastPokemonView = 0;
          }
        }
      }
    }

    // ? Checks if the clicked element matches the class "Left" or "Right".
    // * If a match is found, calls the 'Slider' function with the clicked element as an argument.
    // * It also checks if the clicked element matches the class "Left p" or "Right p", and if so, retrieves the parent element, and calls the 'Slider' function with the parent element as an argument.

    if (e.target.matches(".Left") || e.target.matches(".Right")) {
      Slider(e.target);
    }

    if (e.target.matches(".Left p") || e.target.matches(".Right p")) {
      let btn = e.target.parentElement;
      Slider(btn);
    }

    // ? Checks if the clicked element or its parent matches the class "CloseAndRemember" or "CloseAndRemember p".
    //  * If a match is found, it sets a timeout to hide the instructions after 1000 milliseconds and stores a "true" value in local storage to remember that the user has closed the instructions.

    // ? It also checks if the clicked element or its parent matches the class "DontRememberClose" or "DontRememberClose p".
    // * If a match is found, it sets a timeout to hide the instructions after 1000 milliseconds without storing any value in local storage.

    if (
      e.target.matches(".CloseAndRemember") ||
      e.target.matches(".CloseAndRemember p")
    ) {
      setTimeout(() => {
        $instructions.classList.add("Hide");
      }, 1000);
      localStorage.setItem("ShowInstructions", "true");
    }

    if (
      e.target.matches(".DontRememberClose") ||
      e.target.matches(".DontRememberClose p")
    ) {
      setTimeout(() => {
        $instructions.classList.add("Hide");
      }, 1000);
    }

    // ? Checks if the clicked element or its parent matches the class "Btn" or "Btn p".
    // * If a match is found, it determines the actual button element (either the clicked element or its parent).
    // * It removes the "Active" class from all buttons in '$btns'.
    // * If the "sound" flag in local storage is set to "true", it plays a button press sound using the 'PressedBtn' function.
    // * It then adds the "Active" class to the clicked button element and sets a timeout to remove the "Active" class after 500 milliseconds.

    if (e.target.matches(".Btn") || e.target.matches(".Btn p")) {
      let btn = e.target;

      if (e.target.matches(".Btn p")) btn = e.target.parentElement;
      $btns.forEach((btn) => {
        btn.classList.remove("Active");
      });

      if (localStorage.getItem("sound") == "true") {
        PressedBtn();
      }

      btn.classList.add("Active");
      setTimeout(() => {
        btn.classList.remove("Active");
      }, 500);
    }

    // ? Checks if the clicked element or its parent matches the class "Close" or "Close p".
    // * If a match is found, it sets a timeout to hide the '$configuration' element after 1000 milliseconds.

    if (e.target.matches(".Close") || e.target.matches(".Close p")) {
      setTimeout(() => {
        $configuration.classList.add("Hide");
      }, 1000);
    }

    // ? Checks if the clicked element or its parent matches the class "Option" or "Option p".
    // * If a match is found, it removes the "Hide" class from the '$configuration' element to display it.

    if (e.target.matches(".Option") || e.target.matches(".Option p")) {
      $configuration.classList.remove("Hide");
    }

    // ? Checks if the clicked element or its parent matches the class "ShowInstructions" or "ShowInstructions p".
    // * If a match is found, it performs the following actions:
    // * - Removes the "Hide" class from the '$instructions' element to display it.
    // * - Checks if the "ShowInstructions" flag is set in local storage; if it is, hides the '$gotItBtn' element.
    // * - Adds the "Hide" class to the '$configuration' element to hide it.

    if (
      e.target.matches(".ShowInstructions") ||
      e.target.matches(".ShowInstructions p")
    ) {
      $instructions.classList.remove("Hide");
      if (localStorage.getItem("ShowInstructions")) {
        $gotItBtn.classList.add("Hide");
      }
      $configuration.classList.add("Hide");
    }

    // ? Checks if the clicked element or its parent matches the class "Social" or "Social p".
    // * If a match is found:
    // * - It determines the actual social element (either the clicked element or its parent).
    // * - It retrieves the 'url' attribute from the social element.
    // * - It opens the URL in a new browser tab or window using '_blank' target.

    if (e.target.matches(".Social") || e.target.matches(".Social p")) {
      let social = e.target;
      if (e.target.matches(".Social p")) social = e.target.parentElement;

      let url = social.getAttribute("url");
      window.open(url, "_blank");
    }

    // ? Checks if the clicked element or its parent matches the class "Color" or "Color p".
    // * If a match is found:
    // * - It determines the color from the class list of the clicked element or its parent.
    // * - It calls the 'ThemeChanger' function with the determined color.

    if (e.target.matches(".Color") || e.target.matches(".Color p")) {
      let color = e.target.classList[1];
      if (e.target.matches(".Color p")) {
        color = e.target.parentElement.classList[1];
      }
      ThemeChanger(color);
    }

    // ? Checks if the clicked element or its parent matches the class "BlockSound" or "BlockSound p".
    // * If a match is found:
    // * - It checks the current value of the "sound" flag in local storage.
    // * - If the "sound" flag is currently set to "true", it changes it to "false" and updates the '$soundConfig' text to indicate "Sound: OFF".
    // * - If the "sound" flag is currently set to "false" or does not exist, it changes it to "true" and updates the '$soundConfig' text to indicate "Sound: ON".

    if (e.target.matches(".BlockSound") || e.target.matches(".BlockSound p")) {
      if (localStorage.getItem("sound") === "true") {
        localStorage.setItem("sound", "false");
        $soundConfig.innerHTML = "Sound: OFF";
      } else {
        localStorage.setItem("sound", "true");
        $soundConfig.innerHTML = "Sound: ON";
      }
    }

    /**
     *  ?This code block listens for a click event on elements with class "A" or "A p".
     */
    /**
     * * - It checks the currently displayed view.
     * * - If a Pokémon view is displayed, it loads the detailed information of that Pokémon.
     * * - If a Checker view is displayed and there are moves available, it switches to the Attacks view.
     * * - If a CardsChecker view is displayed and there are cards available, it switches to the Cards view.
     * * - If a SearchChecker view is displayed, it goes to the previous view (either home screen or search screen).
     * * - If a Name view is displayed, it initiates a search by name.
     * * - If a PkmnType view is displayed, it initiates a search by type.
     */

    if (e.target.matches(".A") || e.target.matches(".A p")) {
      let $Currently = document.querySelector(".Currently");

      // ? Check if currently viewing a specific Pokémon
      if ($Currently.classList.contains("Pokemon")) {
        // * Get the Pokémon data and set last viewed view
        PokemonDataId = document
          .querySelector(".Currently")
          .getAttribute("data-id");

        lastPokemonView = currentlyCounter;

        getPkmnData(PokemonDataId);
        //
      }
      // ? Check if currently viewing Pokémon attacks and there are available attacks
      else if (
        $Currently.classList.contains("Checker") &&
        pkmnObject.moves.length >= 1
      ) {
        // * Create Pokémon attacks view and reset the counter
        CreateAttacksViews();
        currentlyCounter = 0;
        //
      }
      // ? Check if currently viewing Pokémon cards and there are available cards
      else if (
        $Currently.classList.contains("CardsChecker") &&
        pkmnObject.cards.length >= 1
      ) {
        // * Create Pokémon cards view and reset the counter
        CreateCardsViews();
        currentlyCounter = 0;
        //
      }
      // ? Check if currently viewing the search results screen
      else if ($Currently.classList.contains("SearchChecker")) {
        // * Set last viewed view and create a searcher view for filtering by name
        lastPokemonView = currentlyCounter;
        CreateSearcher("Name");
        //
      }
      // ? Check if currently viewing the Pokémon name search results
      else if ($Currently.classList.contains("Name")) {
        // * Set last viewed view and initiate the Pokémon search by name
        lastPokemonView = 0;
        SearchPokemonByName();
        areInHome = false;
        //
      }
      // ? Check if currently viewing the Pokémon type filter screen
      else if ($Currently.classList.contains("PkmnType")) {
        // * Switch to the type filter and reset counters
        areInHome = false;
        currentlyCounter = 0;
        lastPokemonView = 0;
        SearchPokemonByType();
        //
      }
    }

    /**
     * ? This code block listens for a click event on elements with class "B" or "B p".
     */
    /**
     * * - It checks the currently displayed view.
     * * - If a Pokémon view is currently displayed in the home screen, it loads the previous list of Pokémon.
     * * - If an attack view or card view is displayed, it goes back to the Pokémon view.
     * * - If a search view is displayed, it goes back to the previous list of Pokémon or the home screen.
     * * - If a Pokémon view is displayed in a non-home screen, it goes back to the previous list of Pokémon or the home screen.
     */

    if (e.target.matches(".B") || e.target.matches(".B p")) {
      let $Currently = document.querySelector(".Currently");

      // ? Check if currently viewing the home screen with Pokémon views
      if ($Currently.classList.contains("PkmnViewClass") && areInHome == true) {
        /**
         * * Load the previous set of Pokémon views
         *
         * * - If the last URL is the default url set the offset and the limit to 0 and 20 respectively to prevent errors
         */
        if (lastUrl == url) {
          lastUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
        }

        loadPkmns(lastUrl);
        currentlyCounter = lastPokemonView;
        //
      }
      // ?  Check if currently viewing Pokémon attack details
      else if ($Currently.classList.contains("PkmnViewAttack")) {
        // * Go back to the Pokémon data view
        getPkmnData(PokemonDataId);
        currentlyCounter = 0;
        //
      }
      // ? Check if currently viewing Pokémon card details
      else if ($Currently.classList.contains("PkmnViewCard")) {
        // * Go back to the Pokémon data view
        getPkmnData(PokemonDataId);
        currentlyCounter = 0;
        //
      }
      // ? Check if currently in the search results screen
      else if (
        $Currently.classList.contains("SearchChecker") ||
        $Currently.classList.contains("Searcher")
      ) {
        // * Load the previous set of Pokémon views
        if (lastUrl == url) {
          lastUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
        }

        loadPkmns(lastUrl);

        // * - If not are in home restart the currently counter and lastpokemon values to 0
        if (areInHome == true) {
          currentlyCounter = lastPokemonView;
        } else {
          currentlyCounter = 0;
          lastPokemonView = 0;
        }
        //
      }
      // ? Check if currently viewing Pokémon of a specific type --not in home--
      else if (
        $Currently.classList.contains("PkmnViewClass") &&
        areInHome == false
      ) {
        // * Check if a type was searched
        if (Type != null) {
          /**
           * * If a type was searched, load the previous set of Pokémon views by the type searched previous
           */
          currentlyCounter = lastPokemonView;
          SearchPokemonByType(Type);
        } else {
          // * If not load the previous set of Pokémon views (all types)
          if (lastUrl == url) {
            lastUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
          }

          // * Restart all values
          loadPkmns(lastUrl);
          currentlyCounter = 0;
          lastPokemonView = 0;
          Type = null;
          areInHome = true;
        }
      }
      // ? Check if currently viewing a specific Pokémon --searched by name--
      else if ($Currently.classList.contains("Pokemon") && areInHome == false) {
        // * Delete the las type searched to prevent errors
        Type = null;

        // * Load the previous set of Pokémon views
        if (lastUrl == url) {
          lastUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
        }

        // * Restart all values
        loadPkmns(lastUrl);
        currentlyCounter = 0;
        lastPokemonView = 0;
        areInHome = true;
      }
    }

    /**
     * ? This scope handles the behavior when the 'S' button is pressed.
     * * - It checks the currently displayed view and performs different actions based on the view.
     */

    if (e.target.matches(".S") || e.target.matches(".S p")) {
      let $Currently = document.querySelector(".Currently");
      lastPokemonView = currentlyCounter;

      if ($Currently.classList.contains("SearchChecker")) {
        // * Display the type search view
        CreateSearcher("Type");
        areInHome = false;
        //
      } else if ($Currently.classList.contains("Searcher")) {
        //
      } else {
        // * Return to the default search view
        Type = null;
        SearchConstructor();
      }
    }
  }
});
