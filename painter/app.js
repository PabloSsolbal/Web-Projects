/**
 * ? This code creates a simple drawing application using HTML canvas and JavaScript.
 * * Users can draw freehand shapes with different colors and sizes, as well as geometric shapes like squares, circles, and triangles.
 * * The application supports three drawing tools: pencil, pen, and brush, each with adjustable size.
 * * Users can select colors from a color palette and switch between drawing tools with ease.
 * * The code includes functionality for clearing the canvas, downloading the drawn image, and resetting drawing tools to default settings
 * * The user responsive interface is user-friendly, featuring a toggle button to show/hide the drawing tools menu.
 * TODO: Implement more advanced functions, such as curves, polygons, or other complex shapes
 * TODO: Add functionality to undo and redo drawing actions, allowing users to correct mistakes easily.
 * TODO: Include a color picker tool to allow users to select custom colors beyond the predefined ones
 * TODO: Implement a text tool to add text overlays or annotations to the drawing
 */

// ? get the canvas and the context
const mainCanvas = document.querySelector(".canvas");
const context = mainCanvas.getContext("2d");

// ? variables
const colorPicks = document.querySelectorAll(".color");
const toolPicks = document.querySelectorAll(".tool");

// ? colors array
const colors = {
  red: "#ff3333",
  green: "#3cff7d",
  blue: "#1f6dff",
  yellow: "#ffd000",
  purple: "#1e22ff",
  orange: "#ffae00",
  white: "#ffffff",
  black: "#000000",
  red2: "#ff0000",
  green2: "#dbff77",
  blue2: "#90c9ff",
  yellow2: "#fffb00",
  purple2: "#6200ff",
  orange2: "#ff1e00",
  cyan: "#00fff2",
  pink: "#ff00ff",
};

// ? tools default size values
const tools = {
  pencil: 5,
  pen: 10,
  brush: 35,
};

// ? tools default cap values
const toolCaps = {
  pencil: "but",
  pen: "round",
  brush: "square",
};

// ? variables for the app
/**
 * * mouse click position coordinates
 * * current color
 * * current tool size value
 * * current tool cap value
 * * current selected figure
 */
let initX = 0;
let initY = 0;

let color = colors.black;
let tool = tools.pencil;
let toolCap = toolCaps.pencil;

let selectedFigure = "pencil";

/**
 * ? Draws a square.
 *
 * @param {number} x The x-coordinate of the square's top-left corner.
 * @param {number} y The y-coordinate of the square's top-left corner.
 * @param {number} size The size of the square's side in pixels.
 * * Start a new path
 * * Draw a rectangle with the specified coordinates and size
 * * Set the fill color to the specified color
 * * Fill the rectangle
 */
const drawSquare = (x, y, size) => {
  context.beginPath();
  context.rect(x, y, size, size);
  context.fillStyle = color;
  context.fill();
};

/**
 * ? Draws a circle.
 *
 * @param {number} x The x-coordinate of the circle's center.
 * @param {number} y The y-coordinate of the circle's center.
 * @param {number} radius The radius of the circle in pixels.
 * * Start a new path
 * * Draw an arc with the specified coordinates, radius, and start and end angles
 * * Set the fill color to the specified color
 * * Fill the arc
 */
const drawCircle = (x, y, radius) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
};

/**
 * ? Draws an equilateral triangle.
 *
 * @param {number} x The x-coordinate of the triangle's top point.
 * @param {number} y The y-coordinate of the triangle's top point.
 * @param {number} size The size of the triangle's side in pixels.
 * * Start a new path
 * * Move to the top point of the triangle
 * * Draw a line to the right point of the triangle
 * * Draw a line to the bottom point of the triangle
 * * Close the path
 * * Set the fill color to the specified color
 * * Fill the path
 */
const drawTriangle = (x, y, size) => {
  context.beginPath();
  context.moveTo(x, y);

  context.lineTo(x + size, y);
  context.lineTo(x + size / 2, y - (Math.sqrt(3) * size) / 2);

  context.closePath();
  context.fillStyle = color;
  context.fill();
};

/**
 * ? Draws a shape based on the selected figure and the current cursor position.
 *
 * @param {number} cursorx The x-coordinate of the cursor.
 * @param {number} cursory The y-coordinate of the cursor.
 *
 * * Check if the selected figure is a freehand shape
 * * Start a new path
 * * Move to the previous cursor position
 * * Set the line width, stroke style, and line cap
 * * Draw a line to the current cursor position
 * * Stroke the path
 * * Update the current cursor position
 * * Calculate the size of the shape
 * * Check the selected figure and draw the appropriate shape
 */
const draw = (cursorx, cursory) => {
  if (
    selectedFigure === "pencil" ||
    selectedFigure === "pen" ||
    selectedFigure === "brush"
  ) {
    context.beginPath();
    context.moveTo(initX, initY);
    context.lineWidth = tool;
    context.strokeStyle = color;
    context.lineCap = toolCap;
    context.lineJoin = "round";
    context.lineTo(cursorx, cursory);
    context.stroke();

    initX = cursorx;
    initY = cursory;
  } else {
    const size = Math.abs(initX - cursorx);

    if (selectedFigure === "square") {
      drawSquare(Math.min(initX, cursorx), Math.min(initY, cursory), size);
    } else if (selectedFigure === "circle") {
      drawCircle((initX + cursorx) / 2, (initY + cursory) / 2, size / 2);
    } else if (selectedFigure === "triangle") {
      drawTriangle(Math.min(initX, cursorx), Math.min(initY, cursory), size);
    }
  }
};

/**
 * ? Adds an event listener to each color pick element that changes the current color when clicked.
 *
 * @param {HTMLElement} pick The color pick element.
 * * Prevent the default behavior of the click event
 * * Get the value of the color pick element's class list
 * * Get the new color from the color value
 * * Set the current color to the new color
 */
colorPicks.forEach((pick) => {
  pick.addEventListener("click", (e) => {
    e.preventDefault();
    colorValue = pick.classList;
    newColor = colorValue[1];

    color = colors[newColor];
  });
});

/**
 * ? Adds an event listener to each tool pick element that changes the current tool when clicked.
 *
 * @param {HTMLElement} pick The tool pick element.
 * * Check if the tool pick element is a figure
 * * Get the value of the tool pick element's attribute
 * * Set the new tool to the tool value
 * * Remove the "selected" class from all of the tool pick elements
 * * Add the "selected" class to the clicked tool pick element
 * * Add the "selected" class to the clicked tool pick element
 * * Set the selected figure to the new tool
 *
 * * if is a figure:
 * *  Set the selected figure to the value of the clicked tool pick element
 */
toolPicks.forEach((pick) => {
  if (!pick.classList.contains("figure")) {
    pick.addEventListener("click", (e) => {
      e.preventDefault();
      toolValue = pick.getAttribute("value");
      newTool = toolValue;
      tool = tools[newTool];
      toolCap = toolCaps[newTool];

      toolPicks.forEach((pick) => {
        pick.classList.remove("selected");
      });

      pick.classList.add("selected");
      selectedFigure = newTool;
    });
  } else {
    pick.addEventListener("click", (e) => {
      e.preventDefault();

      toolPicks.forEach((pick) => {
        pick.classList.remove("selected");
      });
      pick.classList.add("selected");
      selectedFigure = pick.getAttribute("value");
    });
  }
});

// ? size selector menu elements
/**
 * * size selector (range input)
 * * size viewer - show current size
 * * set size btn
 * * reset values btn
 */
const sizeSelector = document.querySelector(".size");
const sizeViewer = document.querySelector(".show-size");
const sizeBtn = document.querySelector(".set-size");
const resetBtn = document.querySelector(".reset");

// ? size selector default value
sizeSelector.value = 5;

/**
 * ? Sets the current tool to the value of the size selector.
 * * Get the value of the size selector
 */
const setSize = (e) => {
  e.preventDefault();
  tool = sizeSelector.value;
};

/**
 * ? Updates the size viewer with the current size.
 * * Get the value of the size selector
 * * Check if the value is less than 10 to format it
 * * Update the size viewer with the new value
 */
const showSize = () => {
  let valueSize = sizeSelector.value;
  let newValueSize = valueSize < 10 ? "0" + valueSize : valueSize;
  sizeViewer.textContent = newValueSize + " px";
};

/**
 * ? Resets the drawing tools to their default values.
 * * Set the tool to pencil
 * * Set the size to 5px in the viewer
 * * Set the tool cap to round
 * * Remove the "selected" class from all of the tool pick elements
 * * Add the "selected" class to the pencil tool pick element
 */
const reset = () => {
  tool = tools.pencil;
  sizeViewer.textContent = "05 px";
  sizeSelector.value = 5;
  toolCap = toolCaps.pencil;
  toolPicks.forEach((pick) => {
    pick.classList.remove("selected");
    toolValue = pick.getAttribute("value");
    if (toolValue == "pencil") {
      pick.classList.add("selected");
    }
  });
};

// ? event listeners for size selector menu elements
/**
 * * to update the viewer with the new size when the size selector changes
 * * to set the new size
 * * to reset the default values
 */
sizeSelector.addEventListener("change", showSize);

sizeBtn.addEventListener("click", setSize);

resetBtn.addEventListener("click", reset);

// ? get the options (download, delete and clear) for the canvas
const options = document.querySelectorAll(".option");

/**
 * ? Adds an event listener to each option element that executes the corresponding function when clicked
 * * Get the type of the option
 * * Switch on the type of the option
 *
 * * Clear:
 * * - Clear the canvas and reset the drawing tools
 * * - Reset all the default values
 *
 * * Whiteboard:
 * * - Clear the canvas
 *
 * * Download:
 * * - Download the canvas
 */
options.forEach((option) => {
  option.addEventListener("click", () => {
    type = option.classList[1];
    console.log(type);

    switch (type) {
      case "clear":
        reset();
        context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        setBg();
        color = colors.black;
        break;

      case "whiteboard":
        context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        setBg();
        break;

      case "download":
        downloadCanvas();
        break;
      default:
        break;
    }
  });
});

/**
 * ? Downloads the canvas as an image.
 * * Get the data URL of the canvas
 * * Create a new anchor element
 * * Set the href attribute of the anchor element to the data URL
 * * Set the download attribute of the anchor element to the name of the file
 * * Click the anchor element to download the image
 * * Delete the anchor element to prevent it from being displayed
 */
const downloadCanvas = () => {
  const dataURL = mainCanvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas.png";

  link.click();
  link.delete;
};

/**
 * ? Sets the background color of the canvas to white.
 */
const setBg = () => {
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
};

/**
 * ? Handles a mouse click event.
 *
 * @param {MouseEvent} e The mouse event object.
 * * Get the x and y coordinates of the mouse click
 * * Draw a line from the mouse click position to the previous mouse click position
 * * Add an event listener to the canvas for the mousemove event
 */
const mouseClick = (e) => {
  initX = e.offsetX;
  initY = e.offsetY;
  draw(initX, initY);
  mainCanvas.addEventListener("mousemove", mouseMove);
};

/**
 * ? Handles a mouse move event.
 *
 * @param {MouseEvent} e The mouse event object.
 * * Get the x and y coordinates of the mouse move
 * * Draw a line from the previous mouse click position to the current mouse move position
 */
const mouseMove = (e) => {
  draw(e.offsetX, e.offsetY);
};

// ? function to stop the drawing when the mouse is up
const mouseUp = () => {
  mainCanvas.removeEventListener("mousemove", mouseMove);
};

// ? event listeners for the canvas
mainCanvas.addEventListener("mousedown", mouseClick);

mainCanvas.addEventListener("mouseup", mouseUp);

// ? initialize the canvas with a white background
setBg();

// !responsive
// ? get the menu toggler btn and the menus for the responsive design
const menuToggler = document.querySelector(".menu-toggle");
const menus = document.querySelectorAll(".aside-menu");

/**
 * ? menu toggler btn event listener
 * * Loop through the menus
 * * Check if the menu is currently displayed
 * * if is displayed:
 * * - Hide the menu
 * * - Change the text of the menu toggler btn to "Menu"
 * * if not:
 * * - Show the menu
 * * - Change the text of the menu toggler btn to "Close"
 */
menuToggler.addEventListener("click", () => {
  menus.forEach((menu) => {
    if (menu.style.display === "flex") {
      menu.style.display = "none";
      menuToggler.textContent = "Menu";
    } else {
      menu.style.display = "flex";
      menuToggler.textContent = "Close";
    }
  });
});
