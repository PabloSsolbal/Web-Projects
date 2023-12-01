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
import { UpdateStrike } from "./hangman.js";
import { app, mainMenu, hangmanMenu } from "./memory.js";
import { urls } from "./config.js";
import { riddlerMenu, updateRiddlerRecord } from "./riddles.js";
import {
  getUserData,
  addCoinsPointsRemote,
  createUser,
  deleteUserAccount,
  loginUser,
} from "./user.js";

const configMenu = document.querySelector(".Config");
const colorsMenu = document.querySelector(".colorsOptionContainer");
export const body = document.querySelector("body");
export const signUpMenu = document.querySelector(".Signup");
export const signUpInput = document.getElementById("Username");
export const signUpEmail = document.getElementById("Email");
const notification = document.querySelector(".Notification");
const questionModal = document.querySelector(".QuestionModal");
const gameConfigMenu = document.querySelector(".gameConfigContainer");
const themeConfigMenu = document.querySelector(".themesConfigContainer");
const userDataTemplate = document.querySelector(".userDataTemplate");
const creditsContainer = document.querySelector(".credits");
const linksContainer = document.querySelector(".links");
const topUsersContainer = document.querySelector(".Users");

export let username = null;
export const UserObjects = {
  userGatoCoins: null,
  userPoints: null,
};
export const UserLevels = {
  hangmanLevels: [],
  memoryLevels: [],
  riddlesLevels: [],
};
let elementToBuy = null;

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

/**
 * ? Audios Array
 * * Contains All the audios from the application
 */
const audios = [bubble, failure, incorrect, correct, success, popUp, flip];

/**
 * ? Toggle the disabled state of buttons within a specified HTML element.
 *
 * * This function disables or enables all buttons on the page and selectively enables
 * * buttons within a specific HTML element based on the provided boolean value.
 *
 * @param {HTMLElement} element - The HTML element containing buttons to be selectively enabled.
 * @param {boolean} bool - A boolean value indicating whether to disable (true) or enable (false) the buttons.
 *
 * @example
 * * Disable all buttons on the page and enable buttons within the specified element
 * * toggleBtns(document.getElementById("exampleElement"), false);
 */

const toggleBtns = (element, bool) => {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = bool));

  element.querySelectorAll(`button`).forEach((btn) => (btn.disabled = false));
};

/**
 * ?Display a confirmation modal for a purchase operation.
 *
 * * This function prepares and displays a confirmation modal for a purchase operation.
 * * It sets the modal content to confirm the user's intention to buy a certain level,
 * * including the specified price. The "Comprar" button is labeled to indicate the purchase action.
 * * The modal also includes information about the price of the level.
 *
 * @param {string} price - The price of the level being considered for purchase.
 *
 * @example
 * * Display a confirmation modal for a level with a price of $10
 * * confirmBuy("$10");
 */

const confirmBuy = (price) => {
  questionModal.querySelector("p").textContent =
    "Estas seguro que quieres comprar este nivel?";

  questionModal.querySelector(".Accept").textContent = "Comprar";
  questionModal.classList.add("Buying");

  let priceDiv = document.createElement("div");
  priceDiv.classList.add("price");
  priceDiv.innerHTML = `<span>Precio:</span> ${price}`;

  questionModal.querySelector(".modal-img").before(priceDiv);

  questionModal.classList.remove("hidden");
  toggleBtns(questionModal, true);
};

/**
 * ? Display a confirmation modal for deleting a user account.
 *
 * * This function prepares and displays a confirmation modal for deleting a user account.
 * * It sets the modal content to confirm the user's intention to delete their account.
 * * The modal includes a confirmation input for the user's email to prevent accidental deletions.
 *
 * @example
 * * Display a confirmation modal for deleting a user account
 * * deleteUserAccountConfirm();
 */

const deleteUserAccountConfirm = () => {
  questionModal.querySelector("p").textContent =
    "Estas seguro que quieres borrar tu cuenta?";

  questionModal.querySelector(".Accept").textContent = "Confirmar";

  let deleteEmailInput = document.createElement("input");
  deleteEmailInput.setAttribute("type", "email");
  deleteEmailInput.setAttribute("placeholder", "Your Email");
  deleteEmailInput.setAttribute("id", "DeleteEmail");
  deleteEmailInput.required = true;

  questionModal.querySelector(".modal-img").after(deleteEmailInput);

  let emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "DeleteEmail");
  emailLabel.innerHTML = "<p>confirm your Email</p>";

  questionModal.querySelector("#DeleteEmail").before(emailLabel);

  questionModal.classList.remove("hidden");
  toggleBtns(questionModal, true);
};

/**
 * ? Create user elements and populate the top users container with the provided user data.
 *
 * * This function takes an array of user data, clears the top users container's current content, and creates user elements for each user in the array.
 * * Each user element includes the user's name, a cat points image, and the user's points. The top five users additionally have top position images.
 * * The created user elements are appended to the top users container.
 *
 * @param {Array} users - An array of user data objects, each containing at least "name" and "points" properties.
 *
 * * If the provided array of users is empty or undefined, no user elements are created.
 *
 * @example
 * * Display the top users by populating the top users container with user data
 * const usersData = [
 *   { name: "User1", points: 100 },
 *   { name: "User2", points: 90 },
 *   { name: "User3", points: 80 },
 * ];
 * * createUsers(usersData);
 */

const createUsers = (users) => {
  topUsersContainer.innerHTML = "";

  let userFragment = document.createDocumentFragment();

  for (let user of users) {
    const userdiv = document.createElement("div");
    userdiv.classList.add("user");

    userdiv.innerHTML = `<img src="" alt="" class="topImage"><div>${user.name} <img src="./images/gatopoints.png" alt="" class="gatoPointImg">
    <p class="points"><span>Pts:</span> ${user.points}</p></div>`;

    userFragment.appendChild(userdiv);
  }

  topUsersContainer.appendChild(userFragment);

  document.querySelectorAll(".user").forEach((user, index) => {
    index >= 5
      ? (user.querySelector(".topImage").src = `./imgs/top.png`)
      : (user.querySelector(".topImage").src = `./imgs/top${index + 1}.png`);
  });
};

/**
 * ? Fetch top user data from the specified URL and populate the top users container.
 *
 * * This function sends a GET request to the specified URL to retrieve top user data.
 * * The retrieved user data is then used to create user elements and populate the top users container using the createUsers function.
 *
 * @throws {Error} If the fetch request to retrieve user data fails or if the user data is invalid.
 *
 * @example
 * * Fetch and display the top users
 * * getUsers();
 */

const getUsers = async () => {
  let response = await fetch(urls.usersTop);
  let users = await response.json();
  createUsers(await users);
};

/**
 * ? Create HTML links based on the provided array of links and append them to the links container.
 *
 * * This function iterates through the array of links and appends each link to the links container in the document.
 *
 * @param {Object} links - An object containing an array of links (e.g., { links: ["<a href='#'>Link 1</a>", "<a href='#'>Link 2</a>"] }).
 *
 * @example
 * * Create links based on the provided array and append them to the links container
 * * createLinks({ links: ["<a href='#'>Link 1</a>", "<a href='#'>Link 2</a>"] });
 */

const createLinks = (links) => {
  for (let link of links.links) {
    linksContainer.innerHTML += link;
  }
};

/**
 * ? Asynchronously fetch links data from the specified JSON file and use it to create HTML links.
 *
 * * This function uses the Fetch API to asynchronously retrieve links data from the specified JSON file.
 * * Upon receiving the data, it invokes the createLinks function to generate HTML links and append them to the links container.
 *
 * @async
 * @function
 */

(async function getLinks() {
  let response = await fetch("./auto/links.json");
  let links = await response.json();
  createLinks(await links);
})();

/**
 * ? Display a notification with the specified message.
 *
 * * This function updates the text content of the notification element with the provided message, adds the "Display" class to show the notification, and sets a timeout to remove the "Display" class after 1500 milliseconds, hiding the notification.
 *
 * @param {string} message - The message to be displayed in the notification.
 *
 * @example
 * * Show a notification with the message "Operation successful!"
 * * showNotification("Operation successful!");
 */
export const showNotification = (message, time = 1500) => {
  notification.querySelector(".notificationMessage").textContent = message;
  notification.classList.add("Display");

  setTimeout(() => {
    notification.classList.remove("Display");
  }, time);
};

/**
 * ? Unlock a specific level in a game for the current user.
 *
 * * This function sends a PUT request to the server to unlock the specified level in the given game for the user with the current username.
 *
 * @param {string} level - The level to be unlocked.
 * @param {string} game - The name or identifier of the game.
 *
 * @example
 * * Unlock level 5 in the game "AdventureQuest"
 * * UnlockLevel(5, "AdventureQuest");
 */
const UnlockLevel = async (level, game) => {
  let options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(
    `${urls.unlockLevel}?name=${username}&game=${game}&level=${level}`,
    options
  );

  await response.json();
};

/**
 * ? Confirm and unlock a level after verifying the user has sufficient GatoCoins.
 *
 * * This function confirms the user's intention to unlock a level by deducting the specified price in GatoCoins.
 * * It then displays a notification and updates the user's points and coins. Finally, it unlocks the specified level in the corresponding game and updates the HTML element accordingly.
 *
 * @param {number} price - The cost in GatoCoins to unlock the level.
 *
 * @example
 * * Confirm and unlock the level with a price of 50 GatoCoins
 * * unlockLevelconfirmate(50);
 */
const unlockLevelconfirmate = (price) => {
  let game = "";
  let element = elementToBuy;
  price = parseInt(price);

  if (UserObjects.userGatoCoins >= price) {
    modifyUserData("GatoCoins", -price);
    showNotification(`Has desbloqueado el nivel ${element.textContent}`);

    if (element.classList.contains("option")) {
      hangmanMenu.prepend(updateUserPointsAndCoins());
      game = "hangman";
      //
    } else if (element.classList.contains("start")) {
      app.prepend(updateUserPointsAndCoins());
      game = "memory";
      //
    } else if (element.classList.contains("riddlerOption")) {
      riddlerMenu.prepend(updateUserPointsAndCoins());
      game = "riddles";
    }
    UnlockLevel(element.textContent, game);

    element.classList.remove("locked");
    element.setAttribute("data-cost", "0");
    //
  } else {
    showNotification("GatoCoins insuficientes");
  }
};

/**
 * ? Initiate the process to unlock a level by confirming the purchase.
 *
 * * This function is called when a user attempts to unlock a level. It extracts the price of the level from the HTML element's data attribute and then calls the `confirmBuy` function to confirm the purchase.
 *
 * @param {HTMLElement} element - The HTML element representing the level to unlock.
 *
 * @example
 * * Initiate the process to unlock a level by confirming the purchase
 * * unlockLevel(document.getElementById("level1"));
 */
const unlockLevel = (element) => {
  let price = parseInt(element.getAttribute("data-cost"));
  elementToBuy = element;
  confirmBuy(price);
};

/**
 * ? Update the display of user points and GatoCoins in the user interface.
 *
 * * This function creates a new container using a template and updates the content to reflect the current user points and GatoCoins. It then removes any existing items containers from the document.
 *
 * @returns {HTMLElement} - The updated container displaying user points and GatoCoins.
 *
 * @example
 * * Update and get the container displaying user points and GatoCoins
 * * const updatedContainer = updateUserPointsAndCoins();
 * * document.body.appendChild(updatedContainer);
 */
export const updateUserPointsAndCoins = () => {
  let UserPointsAndCoinsContainer = userDataTemplate.content.cloneNode(true);

  UserPointsAndCoinsContainer.querySelector(
    ".points"
  ).innerHTML = `<span>Pts:</span> ${UserObjects.userPoints}`;

  UserPointsAndCoinsContainer.querySelector(
    ".gatoCoins"
  ).innerHTML = `<span>GatoCoins:</span> ${UserObjects.userGatoCoins}`;

  document.querySelectorAll(".itemsContainer").forEach((element) => {
    element.parentElement.removeChild(element);
  });

  return UserPointsAndCoinsContainer;
};

/**
 * ? Modify user data, updating either user points or GatoCoins based on the specified element and amount.
 *
 * @param {string} element - The element to modify ("Points" for user points, "GatoCoins" for GatoCoins).
 * @param {number} amount - The amount to add or subtract from the specified element.
 * @returns {boolean} - Returns false if the modification would result in a negative value for the specified element.
 *
 * @example
 * * Increase user points by 10
 * * const success = modifyUserData("Points", 10);
 * @example
 * * Decrease GatoCoins by 5
 * * const success = modifyUserData("GatoCoins", -5);
 */
export const modifyUserData = (element, ammount) => {
  if (element === "Points") {
    UserObjects.userPoints += ammount;
    //
    if (UserObjects.userPoints < 0) {
      UserObjects.userPoints -= ammount;
      return;
    }

    addCoinsPointsRemote("points", username, ammount);
  } else if (element === "GatoCoins") {
    UserObjects.userGatoCoins += ammount;
    //
    if (UserObjects.userGatoCoins < 0) {
      UserObjects.userGatoCoins -= ammount;
      return;
    }

    addCoinsPointsRemote("coins", username, ammount);
  }
};

/**
 * ? Update the display of unlocked levels based on the provided options and levels.
 *
 * @param {string} options - The CSS selector for the options that represent levels.
 * @param {Array} levels - An array of levels that have been unlocked.
 *
 * @example
 * * Assuming options are elements with class "option" and levels is an array of unlocked levels
 * * const optionsSelector = ".option";
 * * const unlockedLevels = ["Level 1", "Level 2"];
 * * getUnlockedLevels(optionsSelector, unlockedLevels);
 * ? This would remove the "locked" class and set the "data-cost" attribute to "0" for any option element with text content matching an unlocked level.
 */
export const getUnlockedLevels = (options, levels) => {
  document.querySelectorAll(options).forEach((option) => {
    for (let level of levels) {
      if (option.textContent == level) {
        option.classList.remove("locked");
        option.setAttribute("data-cost", "0");
      }
    }
  });
};

/**
 * ? Display a greeting message to the user based on whether they are logged in or not.
 * * If logged in, hide the sign-up menu and show the main menu with a personalized greeting.
 * * If not logged in, hide the main menu and show the sign-up menu.
 *
 * @function
 *
 * @example
 * * greetUser();
 * ? This function checks if the user is logged in, displays a personalized greeting, and adjusts the UI accordingly.
 */
export const greetUser = () => {
  if (localStorage.getItem("Username")) {
    signUpMenu.classList.add("hidden");
    username = JSON.parse(localStorage.getItem("Username"));

    let greet = document.querySelector(".greet");

    greet.textContent = `Hola ${username} a que quieres jugar hoy?`;

    getUserData();
  } else {
    mainMenu.classList.add("hidden");
    signUpMenu.classList.remove("hidden");
  }
};

/**
 * ? Change the theme of the cards in the game and store the selected theme in local storage.
 *
 * @param {string} theme - The theme name to be set for the cards.
 *
 * @function
 *
 * @example
 * * changeCardsTheme('dark');
 * * This function sets the card theme to 'dark' and displays a notification.
 *
 * @example
 * * changeCardsTheme('light');
 * * This function sets the card theme to 'light' and displays a notification.
 */
const changeCardsTheme = (theme) => {
  localStorage.setItem("CardsTheme", theme);
  showNotification(`Color ${theme} establecido`);
};

/**
 * ? Toggle animations for specific items and store the state in local storage.
 *
 * @param {string} value - The value to determine whether to activate or deactivate animations.
 * @param {HTMLButtonElement} button - The button element associated with the toggle function.
 *
 * @function
 *
 * @example
 * * toggleAnimations('Desactivar', buttonElement);
 * * This function deactivates animations for specific items and updates the button text.
 *
 * @example
 * * toggleAnimations('Activar', buttonElement);
 * * This function activates animations for specific items and updates the button text.
 */
const toggleAnimations = (value, button) => {
  let items = document.querySelectorAll(".glow");
  let itemsToJSON = [];
  for (let item of items) {
    itemsToJSON.push(item.classList[0]);
  }

  if (value === "Desactivar") {
    localStorage.setItem("Animations", false);
    localStorage.setItem("items", JSON.stringify(itemsToJSON));

    for (let item of items) {
      item.classList.remove("glow");
    }

    button.textContent = "Activar";
  } else if (value === "Activar") {
    localStorage.setItem("Animations", true);
    items = JSON.parse(localStorage.getItem("items"));

    for (let item of items) {
      item = document.querySelectorAll(`.${item}`);
      item.forEach((i) => i.classList.add("glow"));
    }
    button.textContent = "Desactivar";
  }
};

/**
 * ? Change the audio volume and update the button text accordingly.
 *
 * @param {number} value - The new audio volume, an integer between 0 and 100.
 * @param {HTMLButtonElement} button - The button element associated with the volume change function.
 *
 * @function
 *
 * @example
 * * changeAudioVolume(50, buttonElement);
 * * This function sets the audio volume to 50% and updates the button text accordingly.
 *
 * @example
 * * changeAudioVolume(0, buttonElement);
 * * This function mutes the audio and updates the button text accordingly.
 */
const changeAudioVolume = (value, button) => {
  value = parseInt(value);
  localStorage.setItem("AudioVolume", JSON.stringify(value));
  value === 0
    ? (button.textContent = "Activar")
    : (button.textContent = "Desactivar");
  value === 0
    ? audios.forEach((audio) => (audio.muted = true))
    : audios.forEach((audio) => (audio.muted = false));
};

/**
 * ? Set the theme for the MiniGameBox and update the background color accordingly.
 *
 * @param {string} theme - The new theme for the MiniGameBox.
 *
 * @function
 *
 * @example
 * * SetTheme("dark");
 * * This function sets the theme to "dark" and updates the background color accordingly.
 *
 * @example
 * * SetTheme("light");
 * * This function sets the theme to "light" and updates the background color accordingly.
 */
const SetTheme = (theme) => {
  localStorage.setItem("MiniGameBoxTheme", JSON.stringify(theme));
  body.setAttribute("data-bg", theme);
};

/**
 * *Initialize the MiniGameBox application by updating user points and coins,
 * * greeting the user, configuring keyboard options, updating the hangman strike counter,
 * * updating the riddler record, and setting the audio volume.
 *
 * @function
 *
 * @example
 * * initializeMiniGameBox();
 * ? This function initializes the specified components of the MiniGameBox application.
 */
const initializeMiniGameBox = () => {
  mainMenu.prepend(updateUserPointsAndCoins());
  greetUser();

  document.querySelector(".keyboardOption").textContent =
    JSON.parse(localStorage.getItem("keyboard")) === true
      ? "Desactivar"
      : "Activar";

  UpdateStrike();
  updateRiddlerRecord();

  changeAudioVolume(
    JSON.parse(localStorage.getItem("AudioVolume")),
    document.querySelector(".soundOption")
  );
};

/**
 * ? Initialize the MiniGameBox application upon the DOM content being loaded.
 *
 * @event
 *
 * @example
 * document.addEventListener("DOMContentLoaded", () => {
 *   initializeMiniGameBox();
 * });
 */
document.addEventListener("DOMContentLoaded", () => {
  username = JSON.parse(localStorage.getItem("Username"));

  localStorage.getItem("MiniGameBoxTheme")
    ? SetTheme(JSON.parse(localStorage.getItem("MiniGameBoxTheme")))
    : null;

  !localStorage.getItem("keyboard")
    ? localStorage.setItem("keyboard", JSON.stringify(true))
    : null;

  !localStorage.getItem("HangmanStrike")
    ? localStorage.setItem("HangmanStrike", JSON.stringify(0))
    : null;

  localStorage.getItem("Animations") === "true"
    ? toggleAnimations("Activar", document.querySelector(".animationOption"))
    : toggleAnimations(
        "Desactivar",
        document.querySelector(".animationOption")
      );

  initializeMiniGameBox();
});

/**
 * ? Click Event Listener
 *
 * *This event listener handles click events on various elements in the application.
 *
 * @param {MouseEvent} e - The mouse click event object.
 */
document.addEventListener("click", (e) => {
  // ? Confirm level unlock or account deletation
  if (e.target.matches(".Accept")) {
    if (questionModal.classList.contains("Buying")) {
      unlockLevelconfirmate(
        document.querySelector(".price").textContent.split(" ")[1]
      );

      questionModal.classList.add("hidden");
      questionModal.removeChild(document.querySelector(".price"));
    } else {
      questionModal.classList.add("hidden");

      deleteUserAccount();

      questionModal.removeChild(questionModal.querySelector("label"));
      questionModal.removeChild(questionModal.querySelector("#DeleteEmail"));
    }

    toggleBtns(questionModal, false);
  }

  // ? Cancel level unlock or account deletation
  if (e.target.matches(".Cancel")) {
    questionModal.classList.contains("Buying")
      ? questionModal.removeChild(document.querySelector(".price"))
      : (questionModal.removeChild(questionModal.querySelector("label")),
        questionModal.removeChild(questionModal.querySelector("#DeleteEmail")));

    questionModal.classList.remove("Buying");
    questionModal.classList.add("hidden");

    toggleBtns(questionModal, false);
  }

  // ? Start the account deletation process
  if (e.target.matches(".Delete")) {
    deleteUserAccountConfirm();
  }
  // ? Log out the user
  if (e.target.matches(".Logout")) {
    localStorage.removeItem("Username");
    window.location.reload();
    showNotification("Sesion cerrada");
  }
  // ? Log the user
  if (e.target.matches(".Login")) {
    loginUser();
  }
  // ? Create user
  if (e.target.matches(".Create")) {
    createUser();
  }

  // ? Show the top users
  if (e.target.matches(".Top")) {
    getUsers();
    mainMenu.classList.add("hidden");
    document.querySelector(".TopUsers").classList.remove("hidden");
  }

  // ? Redirect to my portfolio or github profile
  if (e.target.matches(".github") || e.target.matches(".portfolio")) {
    let url = e.target.getAttribute("href");
    window.open(url, "_blank");
  }

  // ? Start the unlock level process
  if (e.target.matches(".locked")) {
    unlockLevel(e.target);
    e.preventDefault();
  }

  // ? Show the credits
  if (e.target.matches(".Credits")) {
    creditsContainer.classList.remove("hidden");
    mainMenu.classList.add("hidden");
  }

  // ? Toggle the integrate keyboard configuration
  if (e.target.matches(".keyboardOption")) {
    localStorage.setItem(
      "keyboard",
      JSON.stringify(e.target.textContent == "Desactivar" ? false : true)
    );

    e.target.textContent == "Desactivar"
      ? ((e.target.textContent = "Activar"),
        showNotification("Teclado desactivado"))
      : ((e.target.textContent = "Desactivar"),
        showNotification("Teclado activado"));
  }

  // ? Toggle the neon effect
  if (e.target.matches(".neonOption")) {
    body.classList.toggle("NoGlow");

    e.target.textContent == "Desactivar"
      ? ((e.target.textContent = "Activar"),
        showNotification("Neon desactivado"))
      : ((e.target.textContent = "Desactivar"),
        showNotification("Neon activado"));
  }

  // ? Set the theme
  if (e.target.matches(".themeOption")) {
    SetTheme(e.target.textContent);
  }
  // ? Show the theme configuration menu
  if (e.target.matches(".showThemesMenu")) {
    showNotification("Opcion no disponible ahora");
    return;
    themeConfigMenu.classList.toggle("hidden");
    configMenu.classList.add("hidden");
  }
  // ? Close the theme configuration menu
  if (e.target.matches(".closeThemesMenu")) {
    themeConfigMenu.classList.toggle("hidden");
    configMenu.classList.remove("hidden");
  }

  // ? Show the game configurations menu
  if (e.target.matches(".gameConfig")) {
    gameConfigMenu.classList.toggle("hidden");
    configMenu.classList.add("hidden");
  }
  // ? Close the game configurations menu
  if (e.target.matches(".closeConfigMenu")) {
    gameConfigMenu.classList.toggle("hidden");
    configMenu.classList.remove("hidden");
  }

  // ? Show the card color menu
  if (e.target.matches(".showColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.add("hidden");
  }
  // ? Close the card color menu
  if (e.target.matches(".closeColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.remove("hidden");
  }
  // ? Change the memory cards color
  if (e.target.matches(".configOption")) {
    changeCardsTheme(e.target.textContent);
  }

  // ? Toggle animations
  if (e.target.matches(".animationOption")) {
    e.target.textContent == "Desactivar"
      ? (toggleAnimations("Desactivar", e.target),
        showNotification("Animaciones desactivadas"))
      : (toggleAnimations("Activar", e.target),
        showNotification("Animaciones activadas"));
  }

  // ? Toggle Sound
  if (e.target.matches(".soundOption")) {
    e.target.textContent == "Activar"
      ? (showNotification("Sonido activado"), changeAudioVolume(1, e.target))
      : (showNotification("Sonido desactivado"),
        changeAudioVolume(0, e.target));
  }

  // ? Open the config menu
  if (e.target.matches(".config")) {
    mainMenu.classList.add("hidden");
    configMenu.classList.remove("hidden");
  }

  // ? Return to the main menu
  if (e.target.matches(".home")) {
    app.classList.add("hidden");
    configMenu.classList.add("hidden");
    creditsContainer.classList.add("hidden");
    document.querySelector(".TopUsers").classList.add("hidden");
    riddlerMenu.classList.add("hidden");

    mainMenu.prepend(updateUserPointsAndCoins());
    mainMenu.classList.remove("hidden");
  }

  // ? Start the Memory game
  if (e.target.matches(".Memory")) {
    mainMenu.classList.add("hidden");
    app.classList.remove("hidden");
    app.prepend(updateUserPointsAndCoins());
  }

  // ? Start the Hangman game
  if (e.target.matches(".Hangman")) {
    mainMenu.classList.add("hidden");
    hangmanMenu.classList.remove("hidden");
    hangmanMenu.prepend(updateUserPointsAndCoins());
  }

  // ? Start the riddles games
  if (e.target.matches(".Riddler")) {
    showNotification(
      "Este juego esta en fase beta, puede tener errores ligeros",
      3200
    );
    mainMenu.classList.add("hidden");
    riddlerMenu.classList.remove("hidden");
    riddlerMenu.prepend(updateUserPointsAndCoins());
  }

  // ? Start the TicTacToe game
  if (e.target.matches(".TicTacToe")) {
    showNotification("Proximamente");
  }
});

/**
 * ? Add click event listeners to all buttons on the page. When a button is clicked,
 * * prevent its default behavior and play a bubble sound if the audio volume is set to 1.
 *
 * @function
 *
 * @example
 * * addClickListenersToButtons();
 * * This function adds click event listeners to all buttons on the page.
 */
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (localStorage.getItem("AudioVolume") == 1) {
      bubble.play();
    }
  });
});
