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
import { getWord, usedLetter, hangmanHigscore } from "./hangman.js";
import { app, mainMenu, hangmanMenu } from "./memory.js";
import { urls } from "./config.js";

const configMenu = document.querySelector(".Config");
const colorsMenu = document.querySelector(".colorsOptionContainer");
export const body = document.querySelector("body");
const signUpMenu = document.querySelector(".Signup");
const signUpInput = document.getElementById("Username");
const notification = document.querySelector(".Notification");

export let username = null;
export let userPoints = null;
export let userGatoCoins = null;

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

const audios = [bubble, failure, incorrect, correct, success, popUp, flip];

const userDataTemplate = document.querySelector(".userDataTemplate");

const creditsContainer = document.querySelector(".credits");
const linksContainer = document.querySelector(".links");

const topUsersContainer = document.querySelector(".Users");

const createUsers = (users) => {
  topUsersContainer.innerHTML = "";
  let userFragment = document.createDocumentFragment();
  let i = 1;
  for (let user of users) {
    const userdiv = document.createElement("div");
    userdiv.classList.add("user");
    userdiv.textContent = `${i} - ${user.name} - pts: ${user.points}`;
    userFragment.appendChild(userdiv);
    i++;
  }
  topUsersContainer.appendChild(userFragment);
};

const getUsers = async () => {
  let response = await fetch(urls.usersTop);
  let users = await response.json();
  createUsers(await users);
};

const createUser = async () => {
  const data = {
    name: signUpInput.value,
    points: 0,
  };
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  let response = await fetch(`${urls.createUser}`, options);
  let message = await response.json();
  if (message.message !== "success") {
    showNotification("Este usuario ya existe");
    return;
  }
  console.log(message);
  localStorage.setItem("Username", JSON.stringify(signUpInput.value));
  mainMenu.classList.remove("hidden");
  signUpMenu.classList.add("hidden");
  greetUser();
};

const addPointsRemote = async (name, points) => {
  let options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let response = await fetch(
    `${urls.addPoints}?name=${name}&points=${points}`,
    options
  );
  let data = await response.json();
  console.log(data);
};

const createLinks = (links) => {
  for (let link of links) {
    linksContainer.innerHTML += link;
  }
};

const getLinks = async () => {
  let response = await fetch("./auto/links.json");
  let links = await response.json();
  links = links.links;
  console.log(links);
  createLinks(await links);
};
getLinks();

export const showNotification = (message) => {
  notification.querySelector(".notificationMessage").textContent = message;
  notification.classList.add("Display");
  setTimeout(() => {
    notification.classList.remove("Display");
  }, 3000);
};

const addToHangmanUnlockedLEvels = (level) => {
  let levels = JSON.parse(localStorage.getItem("hangmanUnlockedLevels"));
  levels.push(level);
  localStorage.setItem("hangmanUnlockedLevels", JSON.stringify(levels));
};

const addToMemoryUnlockedLevels = (level) => {
  let levels = JSON.parse(localStorage.getItem("memoryUnlockedLevels"));
  levels.push(level);
  localStorage.setItem("memoryUnlockedLevels", JSON.stringify(levels));
};

const unlockLevel = (element) => {
  let price = parseInt(element.getAttribute("data-cost"));
  if (userGatoCoins >= price) {
    modifyUserData("GatoCoins", -price);
    element.classList.contains("option")
      ? hangmanMenu.prepend(updateUserPointsAndCoins())
      : app.prepend(updateUserPointsAndCoins());
    element.classList.remove("locked");
    element.setAttribute("data-cost", "0");
    element.classList.contains("option")
      ? addToHangmanUnlockedLEvels(element.textContent)
      : addToMemoryUnlockedLevels(element.textContent);
    showNotification(`Has desbloqueado el nivel ${element.textContent}`);
  }
};

export const updateUserPointsAndCoins = () => {
  let UserPointsAndCoinsContainer = userDataTemplate.content.cloneNode(true);
  UserPointsAndCoinsContainer.querySelector(
    ".points"
  ).innerHTML = `<span>Pts:</span> ${userPoints}`;
  UserPointsAndCoinsContainer.querySelector(
    ".gatoCoins"
  ).innerHTML = `<span>GatoCoins:</span> ${userGatoCoins}`;
  document.querySelectorAll(".itemsContainer").forEach((element) => {
    element.parentElement.removeChild(element);
  });
  return UserPointsAndCoinsContainer;
};

export const modifyUserData = (element, ammount) => {
  if (element === "Points") {
    userPoints += ammount;
    if (userPoints < 0) {
      userPoints -= ammount;
      return false;
    }
    addPointsRemote(username, ammount);
  } else if (element === "GatoCoins") {
    userGatoCoins += ammount;
    if (userGatoCoins < 0) {
      userGatoCoins -= ammount;
      return false;
    }
  }

  localStorage.setItem(
    "UserData",
    JSON.stringify({
      userPoints: userPoints,
      userGatoCoins: userGatoCoins,
    })
  );
};

export const getUserData = () => {
  let data = {};
  if (!localStorage.getItem("UserData")) {
    localStorage.setItem(
      "UserData",
      JSON.stringify({
        userPoints: 0,
        userGatoCoins: 0,
      })
    );
  }

  data = JSON.parse(localStorage.getItem("UserData"));

  userPoints = data.userPoints;
  userGatoCoins = data.userGatoCoins;
};

const greetUser = () => {
  if (localStorage.getItem("Username")) {
    signUpMenu.classList.add("hidden");
    username = JSON.parse(localStorage.getItem("Username"));
    let greet = document.querySelector(".greet");
    greet.textContent = `Hola ${username} a que quieres jugar hoy?`;
  } else {
    mainMenu.classList.add("hidden");
    signUpMenu.classList.remove("hidden");
  }
};

export const UpdateStrike = () => {
  let strikeCounter = JSON.parse(localStorage.getItem("HangmanStrike"));
  let formatedStrikeCounter =
    strikeCounter < 10 ? `0${strikeCounter}` : strikeCounter;
  hangmanHigscore.innerHTML = `<span>Racha Maxima: </span>${formatedStrikeCounter}`;
};

const changeCardsTheme = (theme) => {
  localStorage.setItem("CardsTheme", theme);
};

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

const changeAudioVolume = (value, button) => {
  value = parseInt(value);
  localStorage.setItem("AudioVolume", value);
  if (value === 0) {
    button.textContent = "Activar";
  } else {
    button.textContent = "Desactivar";
  }
  for (let audio of audios) {
    audio.volume = value;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("hangmanUnlockedLevels")) {
    let levels = [];
    document.querySelectorAll(".option").forEach((option) => {
      if (!option.classList.contains("locked")) {
        levels.push(option.textContent);
      }
    });
    localStorage.setItem("hangmanUnlockedLevels", JSON.stringify(levels));
  }

  if (!localStorage.getItem("memoryUnlockedLevels")) {
    let levels = [];
    document.querySelectorAll(".start").forEach((option) => {
      if (!option.classList.contains("locked")) {
        levels.push(option.textContent);
      }
    });
    localStorage.setItem("memoryUnlockedLevels", JSON.stringify(levels));
  }

  if (localStorage.getItem("hangmanUnlockedLevels")) {
    let levels = JSON.parse(localStorage.getItem("hangmanUnlockedLevels"));
    document.querySelectorAll(".option").forEach((option) => {
      for (let level of levels) {
        if (option.textContent === level) {
          option.classList.remove("locked");
        }
      }
    });
  }

  if (localStorage.getItem("memoryUnlockedLevels")) {
    let levels = JSON.parse(localStorage.getItem("memoryUnlockedLevels"));
    document.querySelectorAll(".start").forEach((option) => {
      for (let level of levels) {
        if (option.textContent === level) {
          option.classList.remove("locked");
        }
      }
    });
  }
  getUserData();
  greetUser();
  mainMenu.prepend(updateUserPointsAndCoins());
  if (!localStorage.getItem("keyboard")) {
    localStorage.setItem(JSON.stringify(true));
  }
  document.querySelector(".keyboardOption").textContent =
    JSON.parse(localStorage.getItem("keyboard")) === true
      ? "Desactivar"
      : "Activar";
  if (!localStorage.getItem("HangmanStrike")) {
    localStorage.setItem("HangmanStrike", JSON.stringify(0));
  }
  UpdateStrike();
  changeAudioVolume(
    localStorage.getItem("AudioVolume"),
    document.querySelector(".soundOption")
  );
  let animationButton = document.querySelector(".animationOption");
  if (localStorage.getItem("Animations") === "true") {
    toggleAnimations("Activar", animationButton);
  } else {
    toggleAnimations("Desactivar", animationButton);
  }
});

/**
 * ? Click Event Listener
 *
 * *This event listener handles click events on various elements in the application.
 *
 * @param {MouseEvent} e - The mouse click event object.
 */
document.addEventListener("click", (e) => {
  if (e.target.matches(".Top")) {
    getUsers();
    mainMenu.classList.add("hidden");
    document.querySelector(".TopUsers").classList.remove("hidden");
  }
  if (e.target.matches(".github") || e.target.matches(".portfolio")) {
    let url = e.target.getAttribute("href");
    window.open(url, "_blank");
  }
  if (e.target.matches(".Credits")) {
    creditsContainer.classList.remove("hidden");
    mainMenu.classList.add("hidden");
  }
  if (e.target.matches(".locked")) {
    e.preventDefault();
    unlockLevel(e.target);
  }
  if (e.target.matches(".Create")) {
    createUser();
  }

  if (e.target.matches(".keyboardOption")) {
    localStorage.setItem(
      "keyboard",
      JSON.stringify(e.target.textContent == "Desactivar" ? false : true)
    );

    e.target.textContent =
      e.target.textContent == "Desactivar" ? "Activar" : "Desactivar";
  }

  if (e.target.matches(".neonOption")) {
    body.classList.toggle("NoGlow");
    e.target.textContent =
      e.target.textContent == "Desactivar" ? "Activar" : "Desactivar";
  }
  if (e.target.matches(".showColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.add("hidden");
  }
  if (e.target.matches(".closeColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.remove("hidden");
  }
  // ? Options in the Hangman menu
  if (e.target.matches(".option")) {
    if (!e.target.classList.contains("locked")) {
      let category = e.target.textContent;
      getWord(category.toLowerCase());
      usedLetter();
    }
  }
  // ? Return to the main menu
  if (e.target.matches(".home")) {
    app.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    configMenu.classList.add("hidden");
    creditsContainer.classList.add("hidden");
    mainMenu.prepend(updateUserPointsAndCoins());
    document.querySelector(".TopUsers").classList.add("hidden");
  }
  if (e.target.matches(".config")) {
    mainMenu.classList.add("hidden");
    configMenu.classList.remove("hidden");
  }
  if (e.target.matches(".configOption")) {
    changeCardsTheme(e.target.textContent);
  }
  if (e.target.matches(".animationOption")) {
    let value = "Activar";
    if (e.target.textContent == "Desactivar") {
      value = "Desactivar";
    }
    toggleAnimations(value, e.target);
  }
  if (e.target.matches(".soundOption")) {
    let value = 1;
    if (e.target.textContent == "Desactivar") {
      value = 0;
    }
    changeAudioVolume(value, e.target);
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
  // ? Play the bubble sound
  if (e.target.matches("button")) {
    bubble.play();
  }
});
