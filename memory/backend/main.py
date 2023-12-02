"""
    ? This module defines a FastAPI application for managing the MiniGameBox operations.

    Modules:
        * - `FastAPI`: A modern, fast web framework for building APIs with Python.
        * - `CORSMiddleware`: Middleware for enabling Cross-Origin Resource Sharing (CORS) in the application.
        * - `db_manager`: A module for managing database operations with MongoDB.
        * - `BaseModel`: Pydantic's base model class for creating data models.
        * - `file_manager`: A module for managing file operations.
        * - `Unidecode`: A module for transliterating Unicode characters.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from file_manager import *
from db_manager import *
from config import get_allowed_origins, description

# * FastAPI
# * PyMongo
# * random
# * unidecode

""" 
    ? Configure the app and the CORS
"""
app = FastAPI(title="MiniGameBox API", description=description,
              summary="API for MiniGameBox.", version="1.1.0")

origins = get_allowed_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/memory", tags=["Memory"])
def memory():
    """Get all memory data."""
    return get_all()


@app.get("/memory/{category}", tags=["Memory"])
def memory(category: str, number: int = 14):
    """Get memory data for a specific category."""
    return get_category(category, number)


@app.get("/memory/data/{category}", tags=["Memory"])
def memory(category: str):
    """Get only data for a specific category."""
    return get_only_data(category)


@app.post("/memory", tags=["Memory"])
def memory(data: Category):
    """Add a new memory category."""
    return add_category(data)


@app.post("/memory/{category}", tags=["Memory"])
def memory(category: str, data: Data):
    """Insert data into a specific memory category."""
    return insert_data(category, data)


@app.put("/memory/{category}", tags=["Memory"])
def memory(category: str, data: Data):
    """Modify data in a specific memory category."""
    return modify_data(category, data)


@app.delete("/memory/one/{category}", tags=["Memory"])
def memory(category: str, name: str):
    """Delete specific data from a memory category."""
    return delete_from_category(category, name)


@app.delete("/memory/all/{category}", tags=["Memory"])
def memory(category: str):
    """Delete an entire memory category."""
    return delete_category(category)


@app.get("/hangman", tags=["Hangman"])
def hangman():
    """Get all hangman words."""
    return all()


@app.get("/hangman/categories", tags=["Hangman"])
def hangman():
    """Get the names of all hangman categories."""
    return get_category_names()


@app.get("/hangman/random", tags=["Hangman"])
def hangman():
    """Get a random hangman word."""
    return get_words_random()


@app.get("/hangman/challenge", tags=["Hangman"])
def hangman():
    """Get challenge words for hangman."""
    return get_words_challenge()


@app.get("/hangman/{category}", tags=["Hangman"])
def hangman(category: str):
    """Get a hangman word from a specific category."""
    return word_selector(category)


@app.get("/hangman/all/{category}", tags=["Hangman"])
def hangman(category: str):
    """Get all hangman words from a specific category."""
    return get_all_words(category)


@app.post("/hangman/create/{category}", tags=["Hangman"])
def hangman(category: str):
    """Create a new hangman category."""
    return create_category(category)


@app.post("/hangman/add/{category}", tags=["Hangman"])
def hangman(category: str, words: dict):
    """Add multiple hangman words to a specific category."""
    return add_words(category, words["words"])


@app.post("/hangman/{category}", tags=["Hangman"])
def hangman(category: str, word: str):
    """Add a hangman word to a specific category."""
    return add_word(word, category)


@app.put("/hangman/{category}", tags=["Hangman"])
def hangman(category: str, old_word: str, new_word: str):
    """Update a hangman word in a specific category."""
    return update_word(category, old_word, new_word)


@app.delete("/hangman/{category}", tags=["Hangman"])
def hangman(category: str):
    """Delete an entire hangman category."""
    return delete_hangman_category(category)


@app.delete("/hangman/delete/{category}", tags=["Hangman"])
def hangman(category: str, word: str):
    """Delete a hangman word from a specific category."""
    return delete_hangman_word(category, word)


@app.get("/riddles", tags=["Riddles"])
def riddles():
    """Get all riddles."""
    return get_all_riddles()


@app.get("/riddles/categories", tags=["Riddles"])
def riddles():
    """Get all riddle categories."""
    return get_riddle_categories()


@app.get("/riddles/from/{category}", tags=["Riddles"])
def riddles(category: str):
    """Get all riddles from a specific category."""
    return get_all_riddles_from(category)


@app.get("/riddles/{category}", tags=["Riddles"])
def riddles(category: str, difficult: str):
    """Get a riddle from a specific category and difficulty."""
    return get_riddle(category, difficult)


@app.get("/riddles/all/{category}", tags=["Riddles"])
def riddles(category: str, difficult: str):
    """Get all riddles from a specific category and difficulty."""
    return get_riddles(category, difficult)


@app.post("/riddles", tags=["Riddles"])
def riddles(data: Riddle):
    """Add a single riddle."""
    return add_riddle(data)


@app.post("/riddles/all", tags=["Riddles"])
def riddles(data: dict):
    """Add multiple riddles."""
    return add_riddles(data)


@app.get("/users/top", tags=["Users"])
def users():
    """Get top users."""
    return get_top_users()


@app.post("/users/login", tags=["Users"])
def users(data: dict):
    """Log in a user."""
    return log_in_user(data)


@app.get("/users/{name}", tags=["Users"])
def users(name: str):
    """Get user by name."""
    return get_user(name)


@app.post("/users/add", tags=["Users"])
def users(user: User):
    """Create a new user."""
    return create_user(user)


@app.post("/users/record", tags=["Users"])
def users(name: str, game: str, record: dict):
    """Add a record for a user."""
    return add_record(name, game, record)


@app.put("/users/addpoints", tags=["Users"])
def users(name: str, points: int):
    """Add points to a user."""
    return add_points(name, points)


@app.put("/users/addcoins", tags=["Users"])
def users(name: str, coins: int):
    """Add coins to a user."""
    return add_coins(name, coins)


@app.put("/users/unlocklevel", tags=["Users"])
def users(name: str, game: str, level: str):
    """Unlock a level for a user."""
    return unlock_level(name, game, level)


@app.delete("/users/delete", tags=["Users"])
def users(data: dict):
    """Delete a user."""
    return delete_user(data)
