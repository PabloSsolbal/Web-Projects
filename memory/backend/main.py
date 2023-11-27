from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from file_manager import *
from db_manager import *
from config import get_allowed_origins, description

# * FastAPI
# * PyMongo
# * random
# * unidecode

# ? Start the app with FastAPI
app = FastAPI(title="MiniGameBox API", description=description,
              summary="API for MiniGameBox.", version="0.0.12")

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
    return get_all()


@app.get("/memory/{category}", tags=["Memory"])
def memory(category: str, number: int = 14):
    return get_category(category, number)


@app.get("/memory/data/{category}", tags=["Memory"])
def memory(category: str):
    return get_only_data(category)


@app.post("/memory", tags=["Memory"])
def memory(data: Category):
    return add_category(data)


@app.post("/memory/{category}", tags=["Memory"])
def memory(category: str, data: Data):
    return insert_data(category, data)


@app.put("/memory/{category}", tags=["Memory"])
def memory(category: str, data: Data):
    return modify_data(category, data)


@app.delete("/memory/one/{category}", tags=["Memory"])
def memory(category: str, name: str):
    print("si")
    return delete_from_category(category, name)


@app.delete("/memory/all/{category}", tags=["Memory"])
def memory(category: str):
    return delete_category(category)


@app.get("/hangman", tags=["Hangman"])
def hangman():
    return all()


@app.get("/hangman/categories", tags=["Hangman"])
def hangman():
    return get_category_names()


@app.get("/hangman/random", tags=["Hangman"])
def hangman():
    return get_words_random()


@app.get("/hangman/challenge", tags=["Hangman"])
def hangman():
    return get_words_challenge()


@app.get("/hangman/{category}", tags=["Hangman"])
def hangman(category: str):
    return word_selector(category)


@app.get("/hangman/all/{category}", tags=["Hangman"])
def hangman(category: str):
    return get_all_words(category)


@app.post("/hangman/create/{category}", tags=["Hangman"])
def hangman(category: str):
    return create_category(category)


@app.post("/hangman/add/{category}", tags=["Hangman"])
def hangman(category: str, words: dict):
    return add_words(category, words["words"])


@app.post("/hangman/{category}", tags=["Hangman"])
def hangman(category: str, word: str):
    return add_word(word, category)


@app.put("/hangman/{category}", tags=["Hangman"])
def hangman(category: str, old_word: str, new_word: str):
    return update_word(category, old_word, new_word)


@app.delete("/hangman/{category}", tags=["Hangman"])
def hangman(category: str):
    return delete_hangman_category(category)


@app.delete("/hangman/delete/{category}", tags=["Hangman"])
def hangman(category: str, word: str):
    return delete_hangman_word(category, word)


@app.get("/riddles", tags=["Riddles"])
def riddles():
    return get_all_riddles()


@app.get("/riddles/categories", tags=["Riddles"])
def riddles():
    return get_riddle_categories()


@app.get("/riddles/from/{category}", tags=["Riddles"])
def riddles(category: str):
    return get_all_riddles_from(category)


@app.get("/riddles/{category}", tags=["Riddles"])
def riddles(category: str, difficult: str):
    return get_riddle(category, difficult)


@app.get("/riddles/all/{category}", tags=["Riddles"])
def riddles(category: str, difficult: str):
    return get_riddles(category, difficult)


@app.post("/riddles", tags=["Riddles"])
def riddles(data: Riddle):
    return add_riddle(data)


@app.post("/riddles/all", tags=["Riddles"])
def riddles(data: dict):
    return add_riddles(data)


@app.get("/users/top", tags=["Users"])
def users():
    return get_top_users()


@app.post("/users/login", tags=["Users"])
def users(data: dict):
    return log_in_user(data)


@app.get("/users/{name}", tags=["Users"])
def users(name: str):
    return get_user(name)


@app.post("/users/add", tags=["Users"])
def users(user: User):
    return create_user(user)


@app.post("/users/record", tags=["Users"])
def users(name: str, game: str, record: dict):
    return add_record(name, game, record)


@app.put("/users/addpoints", tags=["Users"])
def users(name: str, points: int):
    return add_points(name, points)


@app.put("/users/addcoins", tags=["Users"])
def users(name: str, coins: int):
    return add_coins(name, coins)


@app.put("/users/unlocklevel", tags=["Users"])
def users(name: str, game: str, level: str):
    return unlock_level(name, game, level)


@app.delete("/users/delete", tags=["Users"])
def users(data: dict):
    return delete_user(data)
