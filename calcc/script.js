//definimos la variable que contendra el valor que actualmente maneja la calculadora en pantalla y la iniciamos en 0
let runningTotal = 0;
//definimos las variables de los numeros a operar y la del operador que definira la operacion matematica a realizar
//los declaramos nulos
let a = null;
let b = null;
let operator = null;
//construimos todos los elementos de la calculadora; botones numericos, botones de operadores, boton igual, boton C, boton borrar y la pantalla
const result = document.getElementById("result");
const clear = document.getElementById("clear");
const backspace = document.getElementById("backspace");
const screen = document.querySelector(".viewer");
const numberButtons = document.querySelectorAll(".n-button");
const opButtons = document.querySelectorAll(".op-button");
//construimos un escucha para el boton igual al hacer click
result.addEventListener("click", () => {
  //dependiendo del operador que se escogiera realizaremos alguna de las siguientes operaciones que se encuentran en el switch como casos, almacenaremos el resultado en nuestro runningTotal para mostrarlo en pantalla
  switch (operator) {
    case "+":
      runningTotal = a + b;
      break;
    case "−":
      runningTotal = a - b;
      break;
    case "×":
      runningTotal = a * b;
      break;
    case "÷":
      if (b == 0) {
        runningTotal = 0;
      } else {
        runningTotal = a / b;
      }
      break;
    default:
      "syntax error";
      break;
  }
  //mostramos el resultado en pantalla
  screen.textContent = runningTotal;
  //guardamos el resultado en 'a' para poder seguir trabajando con el, ademas colocamos el operador y b en nulo para evitar bugs
  a = runningTotal;
  operator = null;
  b = null;
});
//creamos un escucha para el boton C
clear.addEventListener("click", () => {
  //al hacer click en C reseteamos todos los valores y limpiamos la pantalla de la calculadora para trabajar desde 0
  runningTotal = 0;
  a = null;
  b = null;
  operator = null;
  screen.textContent = runningTotal;
});
//creamos un escucha para el backspace y poder borrar valores de la pantalla
backspace.addEventListener("click", () => {
  //abrimos un if para verificar con que numero se trabaja
  //si el operador es nulo significa que trabajamos con 'a'
  if (operator === null) {
    //divimos a entre 10 y lo redondeamos hacia abajo, de esta manera 'borramos' el ultimo valor ej:(112/10=11.2=11) y luego mostramos el nuevo valor en pantalla
    a = Math.floor(a / 10);
    screen.textContent = a;
  } else {
    //en caso de que le operador no se anulo significa qu estamos trbajando con 'b' y repetimos la operacion para borrar el ultimo digito
    b = Math.floor(b / 10);
    screen.textContent = b;
  }
});
//creamos un boton por cada elemento de los botones numericos
numberButtons.forEach((nButton) => {
  //para cada boton se agrega una escucha al hacer click
  nButton.addEventListener("click", () => {
    //almacenamos el contenido de ese boton y lo convertimos a entero para poder operarlo matematicamente almacenandolo en una variable
    const numberText = nButton.textContent;
    const number = parseInt(numberText, 10);
    //si el operador es nulo trabajaremos con 'a'
    if (operator === null) {
      //usamos un operador ternario, si a es nulo sera igual al numero almacenado del boton, si ya tiene un numero almacenado o sea no es nulo entonces lo multiplicamos por 10 y le sumamos el numero, actualizamos el valor y lo mostramos en pantalla
      a = a !== null ? a * 10 + number : number;
      screen.textContent = a;
    } else {
      //si el operador no es nulo significa que estamos trabajando con 'b' y repetimos la operacion para agregar mas digitos al numero
      b = b !== null ? b * 10 + number : number;
      screen.textContent = b;
    }
  });
});
//creamos la escucha para obtener el operador de cada boton al hacer click en el
opButtons.forEach((opButton) => {
  opButton.addEventListener("click", () => {
    screen.textContent = 0;
    operator = opButton.textContent;
  });
});
