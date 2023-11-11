from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import MONGO_URL
from file_manager import *
# ! import the necesary modules
# * FastAPI
# * PyMongo
# * random
# * unidecode

# ? Start the app with FastAPI
app = FastAPI()

#  ? Connect to the database with the mongoClient
client = MongoClient(MONGO_URL, server_api=ServerApi('1'))

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/memory/{category}")
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
            return {"name": category["name"], "data": category["data"]}

    except Exception as e:
        return {"error": str(e)}


@app.post("/memory")
def add_category(data: dict):
    client.Categorys.Categories.insert_one(data)
    return {"message": "Category added successfully."}


@app.get("/word/all/{category}")
def get_all(category: str):
    return get_all_words(category)


@app.get("/word/random")
def get_random_word():
    return get_words_random()


@app.get("/word/challenge")
def get_random_word_challenge():
    return get_words_challenge()


@app.get("/word/{category}")
def get_word(category: str):
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
    return word_selector(category)


@app.post("/word/{category}")
def new_word(category: str, word: str):
    return add_word(word, category)
