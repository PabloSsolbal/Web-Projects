# Pokedex App - K-usaDex

This code creates a Pokedex app with a Gameboy Color-inspired interface. It allows users to navigate between Pokémon, view their characteristics such as stats, sprites, abilities, moves, and TCG cards.

## About

I am a huge Pokémon fan, and I wanted to put my web development skills into practice. I decided to build a Pokedex from scratch in the browser, drawing inspiration from the Gameboy for the interface design and interaction within the application using various buttons. I also added personalization features for users. I encountered various challenges during development, but I managed to solve them one way or another. If you're a Pokémon fan, I hope you enjoy this project and can support it. I plan to add more features in the future, so if you have any suggestions, please don't hesitate to let me know.

## Technologies Used

**Technologies Used**
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,html,css,py,fastapi" />
  </a>
</p>

## To-Do List

- Fix minor bugs in search functions.
- Improve the use of names for card searches.
- Enhance loading times.
- Add visualization of Pokémon evolutions.
- Add Pokémon description display.
- Begin working on the team builder feature.
- And more...

## Demo

See the demo [here](https://youtu.be/XScrNhKfrgA).

## Project Elements

1. **Front-End Interface**
    - **Description:** Gameboy-style interface built with core web technologies. It's a simple, interactive, and reactive interface that requests data and builds elements based on user interaction.
    - **Technologies Used:** HTML, CSS, JavaScript
    - **Folders:** The CSS and JS are separated into their respective folders:
        - **CSS:** The CSS files include `init.css`, which contains the styles (colors, shadows, borders, etc.), and `layout.css`, which contains the layout of the components (displays, width, height, margins, etc.).
        - **JS:** The JavaScript files are as follows:
            - `index.js` contains the main app management, including event listeners, DOM content loading, and data extraction.
            - `builder.js` contains constructor functions for the main components of the Pokedex visualizations.
            - `app.js` manages the creation of the Pokémon details interface, creating different components based on Pokémon data.
            - `tcg.js` contains functions related to TCG data and interface creation.

2. **Back-End API**
    - **Description:** The simplest API for requesting TCG Cards data, built with FastAPI.
    - **Technologies Used:** FastAPI

## Features

- Clickable buttons to navigate through the Pokedex.
- Allows users to view Pokémon details and information.
- Lets users see Pokémon cards associated with a Pokémon.
- Enables users to search for Pokémon by type or name.
- Allows users to configure sound and color settings for the Pokedex.

## Usage

This project is deployed using GitHub Pages. Visit the [Pokedex](https://pablossolbal.github.io/Web-Projects/pokedex/) to use it.

## Contributing

Contributions are welcome. Please fork the repository, make your changes, and submit a pull request. Feel free to suggest any changes or features for the project. If you want to work on the project, contact me.

## Author

- [Pablo Solbal](https://github.com/pablossolbal)

## License

This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md). See the [LICENSE](LICENSE) file for details.

## Credits

Powered by:  
- [PokeAPI](https://pokeapi.co)  
- [PokemonTCG-API](https://pokemontcg.io)
