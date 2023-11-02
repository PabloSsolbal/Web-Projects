import unidecode
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import MONGO_URL
import random
import os
# ! import the necesary modules
# * FastAPI
# * PyMongo
# * random
# * unidecode

# ? Start the app with FastAPI
app = FastAPI()

#  ? Connect to the database with the mongoClient
client = MongoClient(MONGO_URL, server_api=ServerApi('1'))

# ? Configure the CORS
app_env = os.getenv("APP_ENV", "local")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/category/{category}")
async def get_category(category: str):
    """
    ? Retrieve data for a specific category.

    * This route allows you to fetch data associated with a specific category
    * from the database. It searches for the category in the database and
    * returns its name and associated data if found.

    * Args:
        * category (str): The name of the category to retrieve.

    * Returns:
        * dict: A dictionary containing the name and data of the category.
              * If the category is not found, an error message is returned.

    * Raises:
        ! Exception: If there's an issue with the database query or the server.

    ? Example:
        * To retrieve data for the "example_category" category, make a GET request to:
        * /category/example_category
    """

    try:

        for category in client.Categorys.Categories.find({"name": category}):

            if not category:
                return {"error": "Category not found"}
            else:
                return {"name": category["name"], "data": category["data"]}

    except Exception as e:
        return {"error": str(e)}


def word_selector(category):
    """
        ? Selects a random word from a category-specific text file and prepares a hidden version of it for a word guessing game.

        Args:
            * category (str): The category of words to choose from, corresponds to the name of the text file (without extension).

        Returns:
            * tuple: A tuple containing two elements:
                - The selected word in lowercase.
                - A list of underscores representing the hidden letters in the word.

        Example:
            >>> word, hidden = word_selector("animals")
            >>> word
            'elephant'
            >>> hidden
            ['_', '_', '_', '_', '_', '_', '_', '_']
    """
    with open(f'archives/{category}.txt', 'r', encoding='utf-8') as f:
        words = f.read().splitlines()
        word = random.choice(words)
        word = unidecode.unidecode(word)

        hidden = ['_']*len(word)

    return word.lower(), hidden


@app.get("/get_word/{category}")
async def get_word(category: str):
    """
        ? Retrieves a word from a specified category for a word guessing game.

        Args:
            * category (str): The category of words to choose from, used as a parameter in the route.

        Returns:
            * dict: A dictionary containing the following information:
                * - 'word' (list): The selected word, represented as a list of characters.
                * - 'hidden' (list): A list of underscores representing the hidden letters in the word.
                * - 'attempts' (int): The number of attempts allowed for guessing the word.

        Example:
            * Assuming the category "animals" contains the word "elephant":
            * GET request to "/get_word/animals" returns:
            {
                'word': ['e', 'l', 'e', 'p', 'h', 'a', 'n', 't'],
                'hidden': ['_', '_', '_', '_', '_', '_', '_', '_'],
                'attempts': 7
            }
    """
    word, hidden = word_selector(category)
    word = [x for x in word]
    attemps = int(3+round(len(word)/2))

    return {'word': word, 'hidden': hidden, 'attemps': 6 if attemps < 6 else attemps}


word, hidden = "", []
attemps = 0
game_finished = False


def start_game(category):
    """
        ? Initialize a new word guessing game with the specified category.

        Args:
            * category (str): The category of words to choose from.

        Returns:
            * tuple: A tuple containing four elements:
                * - The selected word in lowercase.
                * - A list of underscores representing the hidden letters in the word.
                * - The number of attempts allowed for guessing the word.
                * - A boolean indicating whether the game is finished (initially set to False).

        Example:
            >>> word, hidden, attempts, game_finished = start_game("animals")
            >>> word
            'elephant'
            >>> hidden
            ['_', '_', '_', '_', '_', '_', '_', '_']
            >>> attempts
            7
            >>> game_finished
            False
    """
    global word, hidden, attemps, game_finished
    word, hidden = word_selector(category)
    attemps = int(3+round(len(word)/2))
    game_finished = False
    return word, hidden, attemps, game_finished


@app.get("/hangman/category/{category}")
def get_hangman(category: str):
    """
        ? Start a new hangman game with words from the specified category.

        Args:
            * category (str): The category of words to choose from.

        Returns:
            * None

        Example:
            * Assuming the category "animals" contains the word "elephant":
            * GET request to "/hangman/category/animals" starts a new hangman game.
    """
    start_game(category)


@app.get("/hangman/{letter}")
async def check_letter(letter: str):
    """
        ? Check a guessed letter in the hangman game.

        Args:
            * letter (str): The letter to check in the hangman game.

        Returns:
            * dict: A dictionary with game status and information.
                *- If the game is finished with a loss, it returns {'game_finished': True, 'status': 'lose', 'word': word}.
                *- If the game is finished with a win, it returns {'game_finished': True, 'status': 'win', 'word': word}.
                *- If the game is still ongoing, it returns {'hidden_word': hidden}.

        Example:
            * Assuming the word is "elephant" and the letter "e" is guessed:
            * GET request to "/hangman/e" returns {'hidden_word': ['e', '_', '_', '_', '_', '_', 'e', '_']}.
    """
    global attemps, game_finished
    found = False

    for index, char in enumerate(word):
        if char == letter.lower():
            hidden[index] = letter.lower()
            found = True

    if not found:
        attemps -= 1

    if attemps == 0:
        game_finished = True
        return {'game_finished': game_finished, 'status': 'lose', 'word': word}

    if "_" not in hidden:
        game_finished = True
        return {'game_finished': game_finished, 'status': 'win', 'word': word}

    return {'hidden_word': hidden}
