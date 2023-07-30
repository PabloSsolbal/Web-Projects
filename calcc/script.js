/**
 * ? This code implements a basic calculator functionality.
 * * It allows users to perform arithmetic operations such as addition, subtraction, multiplication, and division.
 * * The code maintains a running total and updates it based on the selected operator and operands.
 * * The calculator interface includes number buttons, operator buttons, a result button, a clear button, and a backspace button.
 * * Users can input numbers, select operators, calculate results, clear the screen, and delete the last digit.
 * TODO: Implement decimal number support
 * TODO: Improve error handling for invalid calculations
 * TODO: Implement complex functions
 * TODO: Create a last operations tab
 */

// ? the running total is the value that is currently being calculated
let runningTotal = 0;

// ? a is the first number, b is the second number, and operator is the operator that is being used
let a = null;
let b = null;
let operator = null;

// ? get the elements for the calculator
/**
 * * result: the button that will display the result
 * * clear: the button that will clear the screen
 * * backspace: the button that will delete the last number
 * * screen: the screen that displays the running total
 * * numberButtons: the buttons that will display the numbers
 * * opButtons: the buttons that will display the operators
 */
const result = document.getElementById("result");
const clear = document.getElementById("clear");
const backspace = document.getElementById("backspace");
const screen = document.querySelector(".viewer");
const numberButtons = document.querySelectorAll(".n-button");
const opButtons = document.querySelectorAll(".op-button");

// ? Event listener for the result button
/**
 * * Perform the arithmetic operation based on the selected operator and update the running total
 * * - Determine the operator using a switch statement
 * * - Perform the corresponding arithmetic operation on operands a and b
 * * - Update the screen with the running total
 * * - Update the value of a, operator, and b
 */

result.addEventListener("click", () => {
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

  screen.textContent = runningTotal;

  a = runningTotal;
  operator = null;
  b = null;
});

// ? Event listener for the clear button
/**
 * * Reset the calculator by setting the running total, operands (a and b), and operator to null
 * * - Set the running total and operands to 0 and null respectively
 * * - Update the screen with the running total
 */

clear.addEventListener("click", () => {
  runningTotal = 0;
  a = null;
  b = null;
  operator = null;
  screen.textContent = runningTotal;
});

// ? Event listener for the backspace button
/**
 * * Handle the backspace functionality based on the current operand (a or b)
 * * - If the operator is null, update operand a by removing the last digit
 * * - If the operator is not null, update operand b by removing the last digit
 * * - Update the screen with the modified operand value
 */

backspace.addEventListener("click", () => {
  if (operator === null) {
    a = Math.floor(a / 10);
    screen.textContent = a;
  } else {
    b = Math.floor(b / 10);
    screen.textContent = b;
  }
});

// ? Event listeners for the number buttons
/**
 * * Handle the click event on each number button
 * * - Extract the clicked number from the button's text content
 * * - Convert the number to an integer
 * * - Determine the target operand (a or b) based on the current operator
 * * - Update the operand value by appending the clicked number
 * *- Update the screen with the modified operand value
 */

numberButtons.forEach((nButton) => {
  nButton.addEventListener("click", () => {
    const numberText = nButton.textContent;
    const number = parseInt(numberText, 10);

    if (operator === null) {
      a = a !== null ? a * 10 + number : number;
      screen.textContent = a;
    } else {
      b = b !== null ? b * 10 + number : number;
      screen.textContent = b;
    }
  });
});

// ? Event listeners for the operator buttons
/**
 * * Handle the click event on each operator button
 * * - Update the screen with 0 to clear the display
 * * - Assign the selected operator to the operator variable
 */

opButtons.forEach((opButton) => {
  opButton.addEventListener("click", () => {
    screen.textContent = 0;
    operator = opButton.textContent;
  });
});
