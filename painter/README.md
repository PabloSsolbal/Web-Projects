# Simple Drawing Application

This code creates a simple drawing application using HTML canvas and JavaScript. Users can draw freehand shapes with different colors and sizes, as well as geometric shapes like squares, circles, and triangles. The application supports three drawing tools: pencil, pen, and brush, each with an adjustable size. Users can select colors from a color palette and switch between drawing tools with ease. The code includes functionality for clearing the canvas, downloading the drawn image, and resetting drawing tools to default settings.

## To-Do List

- Implement more advanced functions, such as curves, polygons, or other complex shapes.
- Add functionality to undo and redo drawing actions, allowing users to correct mistakes easily.
- Include a color picker tool to allow users to select custom colors beyond the predefined ones.
- Implement a text tool to add text overlays or annotations to the drawing.

## Demo

You can check the [video demo](https://youtu.be/sStrxFFyECs) of the to-do list application. Or you can try the [live demo](https://pablossolbal.github.io/Web-Projects/painter/) to use the application.

## Features

- Drawing tools: Pencil, Pen, and Brush with adjustable size.
- Color palette: Choose from a variety of predefined colors.
- Geometric shapes: Draw squares, circles, and triangles.
- Clear Canvas: Remove all drawings from the canvas.
- Download Image: Save the drawing as an image file.
- Reset Default Settings: Reset the drawing tools to their default values.
- User-friendly interface: Toggle button to show/hide the drawing tools menu for better user experience.

## Technologies Used

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,html,css" />
  </a>
</p>

## Usage

1. Choose a drawing tool (Pencil, Pen, or Brush) by clicking on the respective icon.
2. Select a color from the color palette by clicking on the desired color.
3. Adjust the size of the drawing tool using the range input slider.
4. Draw on the canvas by clicking and dragging the mouse. For freehand shapes, keep the mouse button pressed while moving.
5. To draw geometric shapes, select the desired shape from the tool icons and click and drag to draw the shape.
6. Use the "Clear" option to erase all drawings from the canvas and reset the drawing tools.
7. To save the drawing as an image, click on the "Download" option. The drawing will be downloaded as a PNG file.
8. For a better user experience on smaller screens, use the menu toggler button to show or hide the drawing tools menu.

## Code Structure

The code defines functions to draw squares, circles, and triangles based on user input. It also handles mouse events to allow users to draw on the canvas. The color palette and drawing tool selectors have event listeners to change the color and drawing tool when clicked. The code includes functions to set the size of the drawing tool, show the current size, and reset the default settings.

## Contributing

Contributions are welcome. Please fork the repository, make your changes, and submit a pull request.

## Author

- [Your Name](https://github.com/pablossolbal)

## License

This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md).
