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
import { riddlerMenu, updateRiddlerRecord } from "./riddles.js";

const configMenu = document.querySelector(".Config");
const colorsMenu = document.querySelector(".colorsOptionContainer");
export const body = document.querySelector("body");
const signUpMenu = document.querySelector(".Signup");
const signUpInput = document.getElementById("Username");
const signUpEmail = document.getElementById("Email");
const notification = document.querySelector(".Notification");
const questionModal = document.querySelector(".QuestionModal");

export let username = null;
export let userPoints = null;
export let userGatoCoins = null;
let hangmanLevels = [];
let memoryLevels = [];
let riddlesLevels = [];
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

const audios = [bubble, failure, incorrect, correct, success, popUp, flip];

const userDataTemplate = document.querySelector(".userDataTemplate");

const creditsContainer = document.querySelector(".credits");
const linksContainer = document.querySelector(".links");

const topUsersContainer = document.querySelector(".Users");

const toggleBtns = (bool) => {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = bool));
  document.querySelector(".Cancel").disabled = false;
  document.querySelector(".Accept").disabled = false;
};

export const addRecord = async (record, game) => {
  let options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  };

  let thisUrl = `${urls.record}?name=${username}&game=${game}`;
  let response = await fetch(thisUrl, options);
  let message = await response.json();
  if (message.message === "success") {
    showNotification("Nuevo Record!");
  }
};

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
  toggleBtns(true);
};

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
  toggleBtns(true);
};

const deleteUserAccount = async () => {
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
  if (document.getElementById("DeleteEmail").value == "") {
    showNotification("Debes ingresar tu email");
    return;
  }
  if (!emailRegex.test(document.getElementById("DeleteEmail").value)) {
    showNotification("Email no valido");
    return;
  }
  let data = {
    name: JSON.parse(localStorage.getItem("Username")),
    email: document.getElementById("DeleteEmail").value,
  };
  let options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  let response = await fetch(`${urls.deleteUser}`, options);
  let message = await response.json();
  if (message.message !== "success") {
    if (message.message === "user don't exist") {
      showNotification("El usuario no existe");
      return;
    }
    showNotification("Ocurrio un error");
    return;
  }
  localStorage.removeItem("Username");
  window.location.reload();
  showNotification("Cuenta eliminada");
};

const loginUser = async () => {
  const usernameRegex = /^[A-Za-z0-9]{4,12}$/;
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
  if (signUpInput.value == "" || signUpEmail.value == "") {
    showNotification("Datos no validos");
    return;
  }
  if (!usernameRegex.test(signUpInput.value)) {
    showNotification("Username no valido");
    return;
  }
  if (!emailRegex.test(signUpEmail.value)) {
    showNotification("Email no valido");
    return;
  }
  let data = {
    name: signUpInput.value,
    email: signUpEmail.value,
  };
  let options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  let response = await fetch(`${urls.loginUser}`, options);
  let message = await response.json();
  if (message.message !== "success") {
    showNotification("Datos incorrectos");
    return;
  }
  localStorage.setItem("Username", JSON.stringify(signUpInput.value));
  mainMenu.classList.remove("hidden");
  signUpMenu.classList.add("hidden");
  greetUser();
  getUserData();
};

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

const getUsers = async () => {
  let response = await fetch(urls.usersTop);
  let users = await response.json();
  createUsers(await users);
};

const createUser = async () => {
  const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
  if (signUpInput.value == "" || signUpEmail.value == "") {
    showNotification("Datos no validos");
    return;
  }
  if (!usernameRegex.test(signUpInput.value)) {
    showNotification("Username no valido");
    return;
  }
  if (!emailRegex.test(signUpEmail.value)) {
    showNotification("Email no valido");
    return;
  }
  const data = {
    name: signUpInput.value,
    email: signUpEmail.value,
    points: 0,
    coins: 0,
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
  getUserData();
  greetUser();
};

const addCoinsRemote = async (name, coins) => {
  let options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let response = await fetch(
    `${urls.addCoins}?name=${name}&coins=${coins}`,
    options
  );
  let data = await response.json();
  console.log(data);
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
  }, 1500);
};

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
  let message = await response.json();
  console.log(message);
};

const addToHangmanUnlockedLEvels = (level) => {
  UnlockLevel(level, "hangman");
};

const addToMemoryUnlockedLevels = (level) => {
  UnlockLevel(level, "memory");
};

const addToRiddlesUnlockLevels = (level) => {
  UnlockLevel(level, "riddles");
};

const unlockLevelconfirmate = (price) => {
  let element = elementToBuy;
  price = parseInt(price);
  if (userGatoCoins >= price) {
    modifyUserData("GatoCoins", -price);
    showNotification(`Has desbloqueado el nivel ${element.textContent}`);
    if (element.classList.contains("option")) {
      hangmanMenu.prepend(updateUserPointsAndCoins());
      addToHangmanUnlockedLEvels(element.textContent);
    } else if (element.classList.contains("start")) {
      app.prepend(updateUserPointsAndCoins());
      addToMemoryUnlockedLevels(element.textContent);
    } else if (element.classList.contains("riddlerOption")) {
      riddlerMenu.prepend(updateUserPointsAndCoins());
      addToRiddlesUnlockLevels(element.textContent);
    }
    element.classList.remove("locked");
    element.setAttribute("data-cost", "0");
  } else {
    showNotification("GatoCoins insuficientes");
  }
};

const unlockLevel = (element) => {
  let price = parseInt(element.getAttribute("data-cost"));
  elementToBuy = element;
  confirmBuy(price);
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
    addCoinsRemote(username, ammount);
  }
};

const getUnlockedLevels = (options, levels) => {
  document.querySelectorAll(options).forEach((option) => {
    for (let level of levels) {
      if (option.textContent == level) {
        option.classList.remove("locked");
        option.setAttribute("data-cost", "0");
      }
    }
  });
};

export const getUserData = async () => {
  username = JSON.parse(localStorage.getItem("Username"));
  let response = await fetch(urls.User + username);
  let data = await response.json();
  userGatoCoins = data.coins;
  userPoints = data.points;
  hangmanLevels = data.levels.hangman;
  memoryLevels = data.levels.memory;
  riddlesLevels = data.levels.riddles;
  getUnlockedLevels(".option", hangmanLevels);
  getUnlockedLevels(".start", memoryLevels);
  getUnlockedLevels(".riddlerOption", riddlesLevels);
  localStorage.setItem(
    "HangmanStrike",
    JSON.stringify(data.records.hangman.strike)
  );
  localStorage.setItem("highscore", JSON.stringify(data.records.memory));
  localStorage.setItem(
    "RiddlerStrike",
    JSON.stringify(data.records.riddles.record)
  );
  mainMenu.prepend(updateUserPointsAndCoins());
};

const greetUser = () => {
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

export const UpdateStrike = () => {
  let strikeCounter = JSON.parse(localStorage.getItem("HangmanStrike"));
  let formatedStrikeCounter =
    strikeCounter < 10 ? `0${strikeCounter}` : strikeCounter;
  hangmanHigscore.innerHTML = `<span>Racha Maxima: </span>${formatedStrikeCounter}`;
};

const changeCardsTheme = (theme) => {
  localStorage.setItem("CardsTheme", theme);
  showNotification(`Color ${theme} establecido`);
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
    showNotification("Sonido desactivado");
  } else {
    button.textContent = "Desactivar";
    showNotification("Sonido activado");
  }
  value == 0
    ? audios.forEach((audio) => (audio.muted = true))
    : audios.forEach((audio) => (audio.muted = false));
};

document.addEventListener("DOMContentLoaded", () => {
  mainMenu.prepend(updateUserPointsAndCoins());
  greetUser();
  if (!localStorage.getItem("keyboard")) {
    localStorage.setItem("keyboard", JSON.stringify(true));
  }
  document.querySelector(".keyboardOption").textContent =
    JSON.parse(localStorage.getItem("keyboard")) === true
      ? "Desactivar"
      : "Activar";
  if (!localStorage.getItem("HangmanStrike")) {
    localStorage.setItem("HangmanStrike", JSON.stringify(0));
  }
  UpdateStrike();
  updateRiddlerRecord();
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
  if (e.target.matches(".Delete")) {
    deleteUserAccountConfirm();
  }
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
    toggleBtns(false);
  }
  if (e.target.matches(".Cancel")) {
    questionModal.classList.contains("Buying")
      ? questionModal.removeChild(document.querySelector(".price"))
      : (questionModal.removeChild(questionModal.querySelector("label")),
        questionModal.removeChild(questionModal.querySelector("#DeleteEmail")));
    questionModal.classList.remove("Buying");
    questionModal.classList.add("hidden");
    toggleBtns(false);
  }
  if (e.target.matches(".Logout")) {
    localStorage.removeItem("Username");
    window.location.reload();
    showNotification("Sesion cerrada");
  }
  if (e.target.matches(".Login")) {
    loginUser();
  }
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
    unlockLevel(e.target);
    e.preventDefault();
  }
  if (e.target.matches(".Create")) {
    createUser();
  }

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

  if (e.target.matches(".neonOption")) {
    body.classList.toggle("NoGlow");
    e.target.textContent == "Desactivar"
      ? ((e.target.textContent = "Activar"),
        showNotification("Neon desactivado"))
      : ((e.target.textContent = "Desactivar"),
        showNotification("Neon activado"));
  }
  if (e.target.matches(".showColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.add("hidden");
  }
  if (e.target.matches(".closeColorsMenu")) {
    colorsMenu.classList.toggle("hidden");
    configMenu.classList.remove("hidden");
  }
  // ? Return to the main menu
  if (e.target.matches(".home")) {
    app.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    configMenu.classList.add("hidden");
    creditsContainer.classList.add("hidden");
    mainMenu.prepend(updateUserPointsAndCoins());
    document.querySelector(".TopUsers").classList.add("hidden");
    riddlerMenu.classList.add("hidden");
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
    e.target.textContent == "Desactivar"
      ? showNotification("Animaciones desactivadas")
      : showNotification("Animaciones activadas");
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
  if (e.target.matches(".Riddler")) {
    mainMenu.classList.add("hidden");
    riddlerMenu.classList.remove("hidden");
    riddlerMenu.prepend(updateUserPointsAndCoins());
  }
});

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (localStorage.getItem("AudioVolume") == 1) {
      bubble.play();
    }
  });
});
