// ! Import builder functions to build UI
import {
  $screen,
  CreatePokemonViewer,
  CreatePokemonView,
  CreatePokemonTypes,
  CreatePokemonInfo,
  createLoader,
  getPkmns,
} from "./builder.js";

// ? Pokemon Object to store the data of the currently Pokemon
export const pkmnObject = {
  id: "",
  name: "",
  height: "",
  weight: "",
  types: [],
  moves: [],
  stats: {},
  abilities: [],
  evolutionLines: {},
  sprites: [],
  cards: [],
};
/**
 * * Object to store the pokemon data by type
 * @property {array} TypeName - an array for each type
 */
const TypesObject = {};

// ? Function to log the pokemon info if necesary
export const LogPokemon = (Pokemon) => {
  console.log(Pokemon);
};

// ! Build the Pokemon Info Screen Functions

/**
 * ? This function creates and returns an info view container element.
 * * - It creates a div element '$View'.
 * * - It adds the "View" CSS class.
 * * - Finally, it returns the created '$View' element.
 */
export const CreateInfoView = () => {
  const $View = document.createElement("div");
  $View.classList.add("View");

  return $View;
};

/**
 * ? This function creates and returns a Pokémon info screen element based on provided data.
 * * - It creates a div element '$InfoView' to contain the info screen.
 * * - It creates a div element '$PokemonInfo' for general Pokémon info.
 * * - It creates a Pokémon sprite view using 'CreatePokemonView' and appends it to '$PokemonInfo'.
 * * - It creates a physical Pokémon info div element '$PhysPokemonInfo' with height and weight data.
 * * - It sets HTML content for height and weight inside '$PhysPokemonInfo'.
 * * - It creates a div element '$InfoTypes' for Pokémon types.
 * * - It creates a div element '$InfoInfo' for Pokémon ID and name.
 * * - It appends all the created elements to '$InfoView'.
 * * - Finally, it returns the created '$InfoView' element.
 * @param {string} height - Pokémon height data.
 * @param {string} weight - Pokémon weight data.
 * @param {array} types - Pokémon types data.
 * @param {string} id - Pokémon ID data.
 * @param {string} name - Pokémon name data.
 * @param {string} sprite - Pokémon sprite data.
 * @return {HTML element} -View Element
 */

const CreatePokemonInfoScreen = (height, weight, types, id, name, sprite) => {
  let $InfoView = CreateInfoView();

  const $PokemonInfo = document.createElement("div");
  $PokemonInfo.classList.add("Info");
  $PokemonInfo.classList.add("Center");

  let $PokemonSprite = CreatePokemonView(sprite, false);

  const $PhysPokemonInfo = document.createElement("div");
  $PhysPokemonInfo.classList.add("PhysInfo");
  $PhysPokemonInfo.classList.add("CenterColumn");
  $PhysPokemonInfo.classList.add("Shadow4");

  $PhysPokemonInfo.innerHTML = `
  <p class="Font14">Height:</p>
  <p class="Font12 InfoData">${height}</p>
  <p class="Font14">Weight:</p>
  <p class="Font12 InfoData">${weight}</p>`;

  $PokemonInfo.appendChild($PokemonSprite);
  $PokemonInfo.appendChild($PhysPokemonInfo);

  let $InfoTypes = CreatePokemonTypes(types, false);
  let $InfoInfo = CreatePokemonInfo([id, name]);

  $InfoView.appendChild($PokemonInfo);
  $InfoView.appendChild($InfoTypes);
  $InfoView.appendChild($InfoInfo);

  return $InfoView;
};

/**
 * ? This function creates and returns a Pokémon sprites screen element based on provided sprite data.
 * * - It creates a div element '$InfoView' to contain the sprites screen.
 * * - It adds CSS classes for styling.
 * * - It creates a div element '$SpritesGrid' to display Pokémon sprites.
 * * - It iterates through the 'sprites' array and creates image elements for each sprite.
 * * - It sets the 'src' attribute and adds CSS classes to each sprite image.
 * * - It appends all the sprite images to '$SpritesGrid'.
 * * - It appends '$SpritesGrid' to '$InfoView'.
 * * - Finally, it returns the created '$InfoView' element.
 * @param {array} sprites - Pokémon sprite data.
 * @return {HTML element} -View Element
 */

const CreatePokemonSpritesScreen = (sprites) => {
  let $InfoView = CreateInfoView();
  $InfoView.classList.add("WhiteBg");
  $InfoView.classList.add("Shadow4");

  const $SpritesGrid = document.createElement("div");
  $SpritesGrid.classList.add("SpritesGrid");

  sprites.forEach((sprite) => {
    const $Sprite = document.createElement("img");
    if (sprite == null) {
      $Sprite.src = `assets/Missingno.webp`;
    } else {
      $Sprite.src = sprite;
    }
    $Sprite.classList.add("PkmnSprite");
    $SpritesGrid.appendChild($Sprite);
  });

  $InfoView.appendChild($SpritesGrid);

  return $InfoView;
};

/**
 * ? This function creates and returns a Pokémon stats screen element based on provided stats, types, and name.
 * * - It creates a div element '$InfoView' to contain the stats screen.
 * * - It adds CSS classes for styling.
 * * - It creates a div element '$StatView' for displaying Pokémon stats.
 * * - It iterates through the 'stats' object and creates stat elements for each stat.
 * * - For each stat, it creates a 'StatName' and 'StatValue' element and sets their content.
 * * - It applies CSS classes based on 'types' for stat name and value elements.
 * * - It appends all the stat elements to '$StatView'.
 * * - It creates an additional info element using 'CreatePokemonInfo' for displaying "Stats" and the Pokémon name.
 * * - It appends '$StatView' and the additional info element to '$InfoView'.
 * * - Finally, it returns the created '$InfoView' element.
 * @param {object} stats - Pokémon stats data.
 * @param {array} types - Pokémon types data.
 * @param {string} name - Pokémon name.
 * @return {HTML element} -View Element
 */

const CreatePokemonStatsScreen = (stats, types, name) => {
  let $InfoView = CreateInfoView();
  $InfoView.classList.add("CenterBetweenColumn");

  const $StatView = document.createElement("div");
  $StatView.classList.add("StatView");
  $StatView.classList.add("CenterColumn");
  $StatView.classList.add("Shadow4");
  $StatView.classList.add("GrayBg");

  for (const [stat, value] of Object.entries(stats)) {
    let $Stat = document.createElement("div");
    $Stat.classList.add("Stat");
    $Stat.classList.add("CenterBetween");

    let $StatName = document.createElement("div");
    $StatName.classList.add("StatName");
    $StatName.classList.add("Shadow2");
    $StatName.classList.add("Font14");
    $StatName.classList.add("Center");
    $StatName.classList.add(types[0]);
    $StatName.textContent = stat;

    let $StatValue = document.createElement("div");
    $StatValue.classList.add("StatValue");
    $StatValue.classList.add("Shadow2");
    $StatValue.classList.add("Center");
    $StatValue.textContent = value;

    if (types[1]) {
      $StatValue.classList.add(types[1]);
    } else {
      $StatValue.classList.add("Default");
    }

    $Stat.appendChild($StatName);
    $Stat.appendChild($StatValue);

    $StatView.appendChild($Stat);
  }

  const $ViewInformation = CreatePokemonInfo(["Stats", name]);

  $InfoView.appendChild($StatView);
  $InfoView.appendChild($ViewInformation);

  return $InfoView;
};

/**
 * ? This function creates and returns a Pokémon abilities screen element based on provided abilities and type.
 * * - It creates a div element '$InfoView' to contain the abilities screen.
 * * - It adds CSS classes for styling.
 * * - It creates a div element '$AbilityView' for displaying Pokémon abilities.
 * * - It iterates through the 'abilities' array and creates ability elements for each ability.
 * * - For each ability, it creates an 'AbilityTitle' and 'AbilityText' element and sets their content.
 * * - It applies CSS classes based on 'type' for the ability title element.
 * * - If an ability is hidden, it adds a "Hidden" CSS class to the ability element.
 * * - It removes the second child of the additional info element created by 'CreatePokemonInfo'.
 * * - It appends all the ability elements and the modified additional info element to '$InfoView'.
 * * - Finally, it returns the created '$InfoView' element.
 * @param {array} abilities - Pokémon abilities data.
 * @param {string} type - Pokémon type data.
 * @return {HTML element} -View Element
 */

const CreatePokemonAbilitiesScreen = (abilities, type) => {
  let $InfoView = CreateInfoView();
  $InfoView.classList.add("CenterBetweenColumn");

  const $AbilityView = document.createElement("div");
  $AbilityView.classList.add("StatView");
  $AbilityView.classList.add("CenterEvenlyColumn");
  $AbilityView.classList.add("GrayBg");
  $AbilityView.classList.add("Shadow4");
  $AbilityView.classList.add("AbilityView");

  try {
    abilities.forEach((ability) => {
      let $Ability = document.createElement("div");
      $Ability.classList.add("Ability");
      $Ability.classList.add("Shadow2");
      $Ability.classList.add("CenterColumn");

      if (ability.isHidden == true) {
        $Ability.classList.add("Hidden");
      }

      let $AbilityTitle = document.createElement("div");
      $AbilityTitle.classList.add("AbilityTitle");
      $AbilityTitle.classList.add("Font12");
      $AbilityTitle.classList.add("Shadow4");
      $AbilityTitle.classList.add("Center");
      $AbilityTitle.classList.add(type);

      $AbilityTitle.textContent = ability.name;

      let $AbilityText = document.createElement("p");
      $AbilityText.classList.add("AbilityText");
      $AbilityText.classList.add("Font10");

      $AbilityText.textContent = ability.description;

      $Ability.appendChild($AbilityTitle);
      $Ability.appendChild($AbilityText);

      $AbilityView.appendChild($Ability);
    });
  } catch (error) {
    console.log(error);
  }

  let $ViewInformation = CreatePokemonInfo(["Abilities", type]);
  $ViewInformation.removeChild($ViewInformation.children[1]);

  $InfoView.appendChild($AbilityView);
  $InfoView.appendChild($ViewInformation);

  return $InfoView;
};

/**
 * ? This function creates and returns a Pokémon attacks screen element based on provided moves and name.
 * * - It creates a div element '$InfoView' to contain the attacks screen.
 * * - It adds CSS classes for styling.
 * * - It creates a div element '$PokemonAttacksCheck' for displaying Pokémon moves information.
 * * - It creates a div element '$PokemonAttacksQuestion' to ask the user if they want to see the moves.
 * * - It creates a helper function 'CreateInfoText' to create text elements with specified content and type.
 * * - It creates text elements for "A: Continue" and "B: Cancel" using 'CreateInfoText'.
 * * - It appends the question and the "Continue" and "Cancel" text elements to '$PokemonAttacksCheck'.
 * * - It appends '$PokemonAttacksCheck' to '$InfoView'.
 * * - Finally, it returns the created '$InfoView' element.
 * @param {array} moves - Pokémon moves data.
 * @param {string} name - Pokémon name.
 * @return {HTML element} -View Element
 */

export const CreatePokemonAttacksScreen = (
  moves,
  name,
  title = "Moves",
  checkerType = "Checker"
) => {
  let $InfoView = CreateInfoView();
  $InfoView.classList.add("CenterColumn");
  $InfoView.classList.add(checkerType);

  const $PokemonAttacksCheck = document.createElement("div");
  $PokemonAttacksCheck.classList.add("StatView");
  $PokemonAttacksCheck.classList.add("CenterColumn");
  $PokemonAttacksCheck.classList.add("Shadow4");
  $PokemonAttacksCheck.classList.add("GrayBg");

  const $PokemonAttacksQuestion = document.createElement("div");
  $PokemonAttacksQuestion.classList.add("CheckText");
  $PokemonAttacksQuestion.classList.add("Font14");
  $PokemonAttacksQuestion.classList.add("Center");

  $PokemonAttacksQuestion.textContent = `${name} has ${moves.length} ${title}. Do you want to see them?`;

  const CreateInfoText = (text, type) => {
    let $InfoText = document.createElement("div");
    $InfoText.classList.add("InfoText");
    $InfoText.classList.add("Center");
    $InfoText.classList.add("Shadow2");
    $InfoText.classList.add(type);

    $InfoText.textContent = text;

    return $InfoText;
  };

  const $ContinueText = CreateInfoText("A: Continue", "Continue");
  const $CancelText = CreateInfoText("B: Cancel", "Cancel");

  $PokemonAttacksCheck.appendChild($PokemonAttacksQuestion);
  $PokemonAttacksCheck.appendChild($ContinueText);
  $PokemonAttacksCheck.appendChild($CancelText);

  const $Info = CreatePokemonInfo([title, name]);
  $Info.removeChild($Info.children[1]);

  $InfoView.appendChild($PokemonAttacksCheck);
  $InfoView.appendChild($Info);

  return $InfoView;
};

/**
 * ? This function creates and displays the Pokémon info screen based on the provided 'PkmnObject'.
 * * - It creates a loader to indicate that the information is being loaded.
 * * - It extracts relevant data from 'PkmnObject'.
 * * - It creates various elements for displaying Pokémon information, such as info, sprites, stats, abilities, and moves screens.
 * * - It appends these elements to the viewer element and displays it on the screen.
 * * - Change the status of isCharging
 * @param {object} PkmnObject - Pokémon data object containing various information.
 */

export const createPokemonInfo = (PkmnObject) => {
  createLoader();

  const {
    id,
    name,
    height,
    weight,
    types,
    moves,
    stats,
    abilities,
    evolutionLines,
    sprites,
    cards,
  } = PkmnObject;

  let $Viewer = CreatePokemonViewer();
  let fragment = document.createDocumentFragment();

  let $PokemonInfo = CreatePokemonInfoScreen(
    height,
    weight,
    types,
    id,
    name,
    sprites[0]
  );

  let $PokemonSprites = CreatePokemonSpritesScreen(sprites);

  let $PokemonStats = CreatePokemonStatsScreen(stats, types, name);

  let $PokemonAbilities = CreatePokemonAbilitiesScreen(abilities, types[0]);

  let $PokemonAttacks = CreatePokemonAttacksScreen(moves, name);

  let $PokemonCards = CreatePokemonAttacksScreen(
    cards,
    name,
    "Cards",
    "CardsChecker"
  );

  fragment.appendChild($PokemonInfo);
  fragment.appendChild($PokemonSprites);
  fragment.appendChild($PokemonStats);
  fragment.appendChild($PokemonAbilities);
  fragment.appendChild($PokemonAttacks);
  fragment.appendChild($PokemonCards);

  $Viewer.appendChild(fragment);

  $screen.innerHTML = "";
  $screen.appendChild($Viewer);

  document.querySelectorAll(".View").forEach((view) => {
    view.classList.add("PkmnViewClass");
  });

  document.querySelectorAll(".View")[0].classList.add("Currently");
  isCharging = false;
};

// ! Attacks View Functions

/**
 * ? This function creates an individual attack element based on move data.
 * * - It creates a container element for the attack and applies styling classes.
 * * - It defines a function 'AttackTextCreator' to create and append text elements with specified values.
 * * - 'AttackTextCreator' is used to create and append text elements for the move's name, class, and type.
 * * - Finally, it returns the populated attack container element.
 * @param {Object} move - An object containing move data (name, class, type).
 * @returns {HTMLElement} - The created attack container element.
 */

const createAttack = (move) => {
  const $Attack = document.createElement("div");
  $Attack.classList.add("Attack");
  $Attack.classList.add("Shadow2");
  $Attack.classList.add("CenterEvenly");
  $Attack.classList.add(move.type);

  const AttackTextCreator = (value) => {
    const $AttackText = document.createElement("p");
    $AttackText.classList.add("Font10");
    $AttackText.textContent = value;
    $Attack.appendChild($AttackText);
  };

  AttackTextCreator(move.name);
  AttackTextCreator(move.class);
  AttackTextCreator(move.type);

  return $Attack;
};

/**
 * ? This function creates an attacks view based on an array of moves data (MovesArray).
 * * - It creates a container element for the attacks view and applies styling classes.
 * * - It iterates through each move in the MovesArray, creating an attack element for each.
 * * - If a move is undefined, it assigns default values to prevent errors.
 * * - It appends each attack element to the attacks view container.
 * * - Finally, it returns the populated attacks view container.
 * @param {Array} MovesArray - An array containing moves data.
 * @returns {HTMLElement} - The created attacks view container element.
 */

const createAttacksView = (MovesArray) => {
  const $AttacksView = document.createElement("div");
  $AttacksView.classList.add("AttackView");
  $AttacksView.classList.add("CenterEvenlyColumn");
  $AttacksView.classList.add("GrayBg");
  $AttacksView.classList.add("Shadow4");

  for (let move of MovesArray) {
    if (move == undefined) {
      move = { name: "", class: "", type: "Null" };
    }
    const $Attack = createAttack(move);
    $AttacksView.appendChild($Attack);
  }

  return $AttacksView;
};

/**
 * ? This function creates and displays the Pokémon attacks views based on the moves data in 'pkmnObject'.
 * * - It creates a loader to indicate that the information is being loaded.
 * * - It initializes the viewer element to contain the attacks views.
 * * - It extracts the moves data from 'pkmnObject'.
 * * - It defines a function 'AttacksCreator' to create an attacks view and append it to the viewer.
 * * - It defines a function 'AttackDivisor' to divide the moves into groups of 8 and create corresponding attacks views.
 * * - It repeatedly calls 'AttackDivisor' until all moves have been processed.
 * * - Finally, it sets a timeout to display the viewer and remove the loader after 2 seconds.
 */

export const CreateAttacksViews = () => {
  createLoader();

  const $Viewer = CreatePokemonViewer();
  const attacks = pkmnObject.moves;

  const AttacksCreator = (MovesArray) => {
    const $View = CreateInfoView();
    $View.classList.add("CenterColumn");

    const $AttacksView = createAttacksView(MovesArray);
    $View.appendChild($AttacksView);

    $Viewer.appendChild($View);
  };

  const AttackDivisor = () => {
    const MovesArray = [];
    for (let attack = 0; attack < 8; attack++) {
      const move = attacks.pop(attack);
      MovesArray.push(move);
    }
    AttacksCreator(MovesArray);
  };

  while (attacks.length > 0) {
    AttackDivisor();
  }

  setTimeout(() => {
    $screen.innerHTML = "";
    $screen.appendChild($Viewer);
    document.querySelectorAll(".View").forEach((view) => {
      view.classList.add("PkmnViewAttack");
    });
    document.querySelectorAll(".View")[0].classList.add("Currently");
    isCharging = false;
  }, 2000);
};

// ! Search functions

/**
 * ? This function searches for a Pokémon by name and displays the result.
 * * - Retrieves the Pokémon name from the input field.
 * * - Constructs the URL for the name-based search.
 * * - Calls 'getPkmns' to display the fetched Pokémon.
 */
export const SearchPokemonByName = async () => {
  // * Retrieve the Pokémon name from the input field
  let pkmnName = document.querySelectorAll(".SearchInput")[0].value;

  if (pkmnName == "") {
    return;
  }

  try {
    // * Construct the URL for the name-based search
    let url = "https://pokeapi.co/api/v2/pokemon/" + pkmnName.toLowerCase();

    // * Check if the URL is valid, and call 'getPkmns' to display the fetched Pokémon
    if (url) {
      getPkmns([{ url: url }]);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * ? Loads Pokémon types and their associated Pokémon data.
 * @description This function loads data for various Pokémon types and stores it in the TypesObject.
 * @async
 */

export const TypeLoader = async () => {
  const Types = [
    "grass",
    "fire",
    "water",
    "bug",
    "normal",
    "poison",
    "electric",
    "ground",
    "fairy",
    "fighting",
    "psychic",
    "rock",
    "ghost",
    "ice",
    "dragon",
    "dark",
  ];

  for (let Type of Types) {
    const response = await fetch("https://pokeapi.co/api/v2/type/" + Type);
    const data = await response.json();

    let pokemon = [];

    for (let pkmn of data.pokemon) {
      pokemon.push(pkmn.pokemon);
    }

    TypesObject[Type] = pokemon;
  }
};

/**
 * ? This function performs a search for Pokémon by type and displays the results.
 * * - If `typeN` is not provided, it retrieves the type from the input field.
 * * - Sets the global variable `Type` for type-based searches.
 * * - Constructs the URL for the type-based search.
 * * - Fetches data from the API based on the type.
 * * - Extracts the Pokémon from the response data.
 * * - Sets up a loader to indicate loading.
 * * - Calls `getPkmns` to display the fetched Pokémon.
 *
 * @param {string} typeN - Optional type name for the search.
 */

export const SearchPokemonByType = async (typeN = "") => {
  // * Check if typeN is provided, otherwise, get it from the input field
  if (typeN == "") {
    typeN = document.querySelectorAll(".SearchInput")[0].value;
    if (typeN == "") {
      return;
    }
  }

  // * Set the global variable 'Type' for type-based searches
  Type = typeN;

  // * Extract the Pokémon from the type array
  let data = TypesObject[typeN];

  // * Call 'getPkmns' to display the fetched Pokémon
  createLoader();
  getPkmns(data);
};

/**
 * ? This function creates a search checker view:
 * * - Sets up a loader and the main viewer.
 * * - Creates a search checker with appropriate text and buttons for searching by name or type.
 * * - Updates the text and buttons in the search checker.
 * * - Displays the search checker after a delay.
 */

export const SearchConstructor = () => {
  // * Create a loader and the main viewer
  createLoader();
  const $viewer = CreatePokemonViewer();

  // * Create the search checker
  let $SearchChecker = CreatePokemonAttacksScreen(
    [],
    "",
    "Search",
    "SearchChecker"
  );

  // * Get elements from the search checker
  let $SearchText = $SearchChecker
    .querySelector(".StatView")
    .querySelector(".CheckText");

  let $SearchBtns = $SearchChecker
    .querySelector(".StatView")
    .querySelectorAll(".InfoText");

  // * Update the search text and buttons
  $SearchText.textContent = "Search a Pokémon by name or type.";

  $SearchBtns[0].textContent = "A: By name";
  $SearchBtns[1].textContent = "S: By type";

  // * Update classes to distinguish between cancel and search
  $SearchBtns[1].classList.remove("Cancel");
  $SearchBtns[1].classList.add("Search");

  // * Set the search checker as 'Currently' to display it
  $SearchChecker.classList.add("Currently");

  // * Display the search checker after a delay
  setTimeout(() => {
    $screen.innerHTML = "";
    $viewer.appendChild($SearchChecker);
    $screen.appendChild($viewer);
    isCharging = false;
  }, 2000);
};

/**
 * ? This function creates an input search field.
 * * Add classes to it
 * * Add a placeholder to it
 * @returns {HTMLElement} $InputSearch - The created input search field.
 */

const CreateInputSearch = () => {
  const $InputSearch = document.createElement("input");
  $InputSearch.classList.add("SearchInput");
  $InputSearch.classList.add("Font12");
  $InputSearch.classList.add("Shadow2");

  $InputSearch.placeholder = "...Search";

  return $InputSearch;
};

/**
 * ? This function creates a search button element.
 * * Add classes to it
 * * Add a text to it
 * @returns {HTMLElement} $SearchBtn - The created search button element.
 */
const CreateSearchBtn = () => {
  const $SearchBtn = document.createElement("div");
  $SearchBtn.classList.add("InfoText");
  $SearchBtn.classList.add("Continue");
  $SearchBtn.classList.add("Shadow2");
  $SearchBtn.classList.add("Center");

  $SearchBtn.textContent = "A: Search";

  return $SearchBtn;
};

/**
 * ? This function creates a search view based on the given 'type'.
 * * - It sets up a loader and the main viewer.
 * * - Creates a search checker with an appropriate text based on the type.
 * * - Adds an input field and a search button to the search checker.
 * * - Sets appropriate classes on the search checker.
 */

export const CreateSearcher = (type) => {
  // * Create a loader and the main viewer
  createLoader();
  const $viewer = CreatePokemonViewer();

  // * Create the search checker
  let $SearchChecker = CreatePokemonAttacksScreen([], "", "Search", "Searcher");

  // * Get elements from the search checker
  let $SearchText = $SearchChecker
    .querySelector(".StatView")
    .querySelector(".CheckText");

  let $SearchBtns = $SearchChecker
    .querySelector(".StatView")
    .querySelectorAll(".InfoText");

  // * Remove any existing search buttons
  $SearchBtns.forEach(($SearchBtn) => {
    $SearchChecker.querySelector(".StatView").removeChild($SearchBtn);
  });

  // * Update the search text based on the type of search --name or type--
  $SearchText.textContent = `Search a Pokemon by ${type}`;

  // * Create input search field and search button
  let $InputSearch = CreateInputSearch();
  let $SearchBtn = CreateSearchBtn();
  $SearchBtn.classList.add("SearchBtn");

  $SearchChecker.querySelector(".StatView").appendChild($InputSearch);
  $SearchChecker.querySelector(".StatView").appendChild($SearchBtn);
  $SearchChecker.classList.add("Currently");

  // * If checked by type change the Type class to PkmnType class bcs the Type class alredy exist
  if (type == "Type") {
    type = "PkmnType";
  }
  $SearchChecker.classList.add(type);

  // * Display the search checker after a delay
  setTimeout(() => {
    $screen.innerHTML = "";
    $viewer.appendChild($SearchChecker);
    $screen.appendChild($viewer);
    isCharging = false;
  }, 2000);
};
