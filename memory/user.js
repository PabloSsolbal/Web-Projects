import {
  username,
  UserLevels,
  UserObjects,
  showNotification,
  getUnlockedLevels,
  updateUserPointsAndCoins,
  greetUser,
  signUpEmail,
  signUpInput,
} from "./script.js";
import { urls } from "./config.js";
import { mainMenu } from "./memory.js";

const usernameRegex = /^[A-Za-z0-9]{4,12}$/;
const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;

const Validate = (validateUsername = true, validateEmail = true) => {
  if (signUpInput.value == "" && validateUsername) {
    showNotification("Datos no validos");
    return false;
  }
  if (validateUsername && !usernameRegex.test(signUpInput.value)) {
    showNotification("Username no valido");
    return false;
  }

  if (signUpEmail.value == "" && validateEmail) {
    showNotification("Datos no validos");
    return false;
  }
  if (validateEmail && !emailRegex.test(signUpEmail.value)) {
    showNotification("Email no valido");
    return false;
  }

  return true;
};

/**
 * ? Update user's points or coins remotely by sending a PUT request to the server.
 *
 * * This function takes the property to update, the user's name, and the new value as parameters.
 * * It sends a PUT request to the server's addCoins endpoint with the provided parameters.
 *
 * @param {string} objectToAdd - The property to update (e.g., "points" or "coins").
 * @param {string} name - The name of the user to update.
 * @param {number} coins - The new value for the specified property.
 *
 * @throws {Error} If the fetch request to update points or coins fails.
 *
 * @example
 * * Update user's points to 100 for the user with the name "exampleUser"
 * * addCoinsPointsRemote("points", "exampleUser", 100);
 */

export const addCoinsPointsRemote = async (objectToAdd, name, coins) => {
  let options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(
    `${urls.addCoins}?name=${name}&${objectToAdd}=${coins}`,
    options
  );

  await response.json();
};

/**
 * ? Send a POST request to add a new record for a specified game and user.
 *
 * * This function sends a POST request to the server to add a new record for a specified game
 * * and user. It uses the provided record data, game name, and the current username to construct
 * * the request. Upon successful addition of the record, it displays a notification.
 *
 * @param {Object} record - The record data to be added, formatted as an object.
 * @param {string} game - The name of the game for which the record is being added.
 *
 * @example
 * * Add a new record for the game "ExampleGame" with the provided record data
 * const newRecord = { score: 100, level: 5, time: "00:15:30" };
 * * addRecord(newRecord, "ExampleGame");
 */

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

/**
 * ? Fetch user data from the server and update the local variables and UI accordingly.
 *
 * @async
 * @function
 *
 * @example
 * * await getUserData();
 * ? This function fetches user data from the server, updates local variables, and modifies the UI to reflect the user's current state.
 */
export const getUserData = async () => {
  let response = await fetch(urls.User + username);
  let data = await response.json();

  UserObjects.userGatoCoins = data.coins;
  UserObjects.userPoints = data.points;

  UserLevels.hangmanLevels = data.levels.hangman;
  UserLevels.memoryLevels = data.levels.memory;
  UserLevels.riddlesLevels = data.levels.riddles;

  getUnlockedLevels(".option", UserLevels.hangmanLevels);
  getUnlockedLevels(".start", UserLevels.memoryLevels);
  getUnlockedLevels(".riddlerOption", UserLevels.riddlesLevels);

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

/**
 * ? Log in a user with the provided username and email.
 *
 * * This function attempts to log in a user by sending a POST request to the server with the provided username and email.
 * * It performs validation checks on the input fields and displays appropriate notifications for invalid or incorrect data.
 * * If the login is successful, the user's data is retrieved, and the page is reloaded.
 *
 * @throws {Error} If the username or email input is empty, an error notification is displayed.
 * @throws {Error} If the provided username is not valid, an error notification is displayed.
 * @throws {Error} If the provided email is not valid, an error notification is displayed.
 * @throws {Error} If there is an issue with the server or the login is unsuccessful,
 *                an error notification is displayed.
 * * If the login is successful, the user is logged in, the main menu is displayed, and the user's data is retrieved, followed by a page reload.
 *
 * @example
 * * Attempt to log in a user with the provided username and email
 * * loginUser();
 */

export const loginUser = async () => {
  if (!Validate) {
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
  await getUserData().then(() => window.location.reload());
};

/**
 * ? Delete user account based on the provided email confirmation.
 *
 * * This function performs the deletion of a user account. It validates the provided email
 * * and sends a DELETE request to the server to delete the user account associated with the email.
 * * It displays appropriate notifications based on the success or failure of the deletion process.
 *
 * @throws {Error} If the email input is empty, an error notification is displayed.
 * @throws {Error} If the provided email is not valid, an error notification is displayed.
 * @throws {Error} If there is an issue with the server or the user account doesn't exist, an error notification is displayed.
 * * If the deletion is successful, the user is logged out, and the page is reloaded.
 *
 * @example
 * * Attempt to delete the user account with the provided email confirmation
 * * deleteUserAccount();
 */

/**
 * ? Create a new user with the provided username and email, and initialize points and coins.
 *
 * * This function performs client-side validation on the username and email using regular expressions.
 * * If the input data is valid, it sends a POST request to the server to create a new user.
 * * Upon successful creation, it updates the local storage with the username and shows the main menu.
 * * If the user already exists, it shows a notification indicating that the user already exists.
 *
 * @throws {Error} If the fetch request to create a new user fails or if the response message is not "success".
 *
 * @example
 * * Attempt to create a new user with the provided input data
 * * createUser();
 */

export const createUser = async () => {
  if (!Validate) {
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

  localStorage.setItem("Username", JSON.stringify(signUpInput.value));

  mainMenu.classList.remove("hidden");
  signUpMenu.classList.add("hidden");
  getUserData();
  greetUser();
};

export const deleteUserAccount = async () => {
  if (!Validate((validateUsername = false))) {
    return;
  }

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
