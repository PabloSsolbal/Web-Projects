import random
from config import get_client
from pydantic import BaseModel
from pymongo import DESCENDING

client = get_client()


class User(BaseModel):
    """
    Represents a user.

    Attributes:
    - name (str): The name of the user.
    - email (str): The email address of the user.
    - points (int): The points accumulated by the user.
    - coins (int): The coins owned by the user.
    """
    name: str
    email: str
    points: int
    coins: int


class Data(BaseModel):
    """
    Represents data.

    Attributes:
    - name (str): The name of the data.
    - data (dict): The data in dictionary format.
    """
    name: str
    data: dict


class Category(BaseModel):
    """
    Represents a category.

    Attributes:
    - name (str): The name of the category.
    - data (dict): The data associated with the category.
    """
    name: str
    data: dict


class Riddle(BaseModel):
    """
    Represents a riddle.

    Attributes:
    - riddle (str): The riddle text.
    - category (str): The category to which the riddle belongs.
    - difficult (str): The difficulty level of the riddle.
    - answer (str): The answer to the riddle.
    - attempts (int): The number of attempts allowed for the riddle.
    """
    riddle: str
    category: str
    difficult: str
    answer: str
    attempts: int


def delete_user(data: dict):
    """
    ? Delete a user.

    Parameters:
    * - data (dict): A dictionary containing "name" and "email" keys.

    Returns:
    * dict: {"message": "success"} if the user is successfully deleted.
          * {"message": "user don't exist"} if the user is not found.

    Raises:
    Exception: If an unexpected error occurs during the deletion process.
    """
    try:
        user = client.Users.Users.find_one_and_delete(
            {"$and": [{"name": data["name"]}, {"email": data["email"]}]})
        if user is None:
            return {"message": "user don't exist"}
        return {"message": "success"}
    except:
        return {"message": "user don't exist"}


def get_user(name: str):
    """
    ? Get user information by name.

    * Parameters:
    - name (str): The name of the user.

    Returns:
    * dict or None: A dictionary containing user information if found, otherwise returns None.
                  * The user information includes "name", "points", "coins", "levels", and "records".

    * Note:
    * - If the user is not found, the function returns None.
    """
    user = client.Users.Users.find_one({"name": name}, {"_id": False})
    return {"name": user["name"], "points": user["points"], "coins": user["coins"], "levels": user["levels"], "records": user["records"]} if user is not None else None


def log_in_user(data: dict):
    """
    ? Log in a user by verifying the provided name and email.

    * Parameters:
    - data (dict): A dictionary containing user login information with keys "name" and "email".

    * Returns:
    dict: A dictionary with a "message" key indicating the success or failure of the login attempt.
           - If the user is found, returns {"message": "success"}.
           - If the user is not found, returns {"message": "User don't exist"}.
    """
    user = client.Users.Users.find_one(
        {"$and": [{"name": data["name"]}, {"email": data["email"]}]}, {"_id": False})
    return {"message": "success"} if user is not None else {"message": "User don't exist"}


def search_user(name: str, email: str):
    """
    ? Search for a user using either the name or email.

    * Parameters:
    - name (str): The name of the user to search for.
    - email (str): The email of the user to search for.

    * Returns:
    dict or None: A dictionary containing user information if the user is found, or None if the user is not found.
                  - If found, returns {"name": user_name, "points": user_points, "coins": user_coins, "levels": user_levels}.
                  - If not found, returns None.
    """
    user = client.Users.Users.find_one(
        {"$or": [{"name": name}, {"email": email}]}, {"_id": False})
    return {"name": user["name"], "points": user["points"], "coins": user["coins"], "levels": user["levels"]} if user is not None else None


def create_user(user: User):
    """
    ? Create a new user.

    * Parameters:
    - user (User): An instance of the User class containing user information.

    * Returns:
    dict: A dictionary with a success message if the user is created successfully, or a message indicating that the user already exists.
          - If successful, returns {"message": "success"}.
          - If the user already exists, returns {"message": "user already exists"}.
    """
    user = user.model_dump()
    if search_user(user["name"], user["email"]) is not None:
        return {"message": "user already exists"}
    user["levels"] = dict()
    user["levels"]["memory"] = ["Emociones", "Comidas", "Colores", "Animales"]
    user["levels"]["hangman"] = ["Animales", "Ciencia", "Comics", "Comidas"]
    user["levels"]["riddles"] = [
        "Animales", "Comidas", "Objetos", "Transportes"]
    user["records"] = dict()
    user["records"]["hangman"] = {"strike": 0}
    user["records"]["riddles"] = {"record": 0}
    user["records"]["memory"] = None
    client.Users.Users.insert_one(user)
    return {"message": "success"}


def add_points(name: str, points: int):
    """
    ? Add points to a user.

    * Parameters:
    - name (str): The name of the user.
    - points (int): The number of points to add.

    * Returns:
    dict: A dictionary with a success message if points are added successfully.
          - If successful, returns {"message": "success"}.
    """
    client.Users.Users.find_one_and_update(
        {"name": name}, {"$inc": {"points": points}})
    return {"message": "success"}


def add_coins(name: str, coins: str):
    """
    ? Add coins to a user.

    * Parameters:
    - name (str): The name of the user.
    - coins (int): The number of coins to add.

    * Returns:
    dict: A dictionary with a success message if coins are added successfully.
          - If successful, returns {"message": "success"}.
    """
    client.Users.Users.find_one_and_update(
        {"name": name}, {"$inc": {"coins": coins}}
    )
    return {"message": "success"}


def unlock_level(name: str, game: str, level: str):
    """
    ? Unlock a level for a user in a specific game.

    * Parameters:
    - name (str): The name of the user.
    - game (str): The game for which the level is unlocked.
    - level (str): The level to unlock.

    * Returns:
    dict: A dictionary with a success message if the level is unlocked successfully.
          - If successful, returns {"message": "success"}.
    """
    client.Users.Users.find_one_and_update(
        {"name": name}, {"$push": {f"levels.{game}": level}})
    return {"message": "success"}


def add_record(name: str, game: str, record: dict):
    """
    ? Unlock a level for a user in a specific game.

    * Parameters:
    - name (str): The name of the user.
    - game (str): The game for which the level is unlocked.
    - level (str): The level to unlock.

    * Returns:
    dict: A dictionary with a success message if the level is unlocked successfully.
          - If successful, returns {"message": "success"}.
    """
    client.Users.Users.find_one_and_update(
        {"name": name}, {"$set": {f"records.{game}": record}})
    return {"message": "success"}


def get_top_users():
    """
    ? Get the top 10 users based on points.

    * Returns:
    list: A list of dictionaries containing the names and points of the top 10 users.
          - Example: [{"name": "User1", "points": 100}, {"name": "User2", "points": 90}, ...]
    """
    users = client.Users.Users.find().sort("points", DESCENDING).limit(10)
    users = [{"name": user["name"], "points": user["points"]}
             for user in users]
    return users


def get_random(data, number):
    """
    ? Get a random selection of items from the memory data provided.

    * Args:
    data (dict): The data to select items from.
    number (int): The number of items to select.

    * Returns:
    dict: A dictionary containing a random selection of items.
          - Example: {"name": "Category", "data": {"item1": "description1", "item2": "description2", ...}}
    """
    items = list(data["data"].items())
    for _ in range(number):
        random.shuffle(items)
    items = items[:number]
    dicts = {item[0]: item[1] for item in items}
    return {"name": data["name"], "data": dicts}


def get_category(category: str, number: int):
    """
    ? Get a random selection of items from the specified category.

    * Args:
    category (str): The name of the category to retrieve.
    number (int): The number of items to select.

    * Returns:
    dict: A dictionary containing a random selection of items from the specified category.
          - Example: {"name": "Category", "data": {"item1": "description1", "item2": "description2", ...}}
    """
    data = client.Categorys.Categories.find_one(
        {"name": category}, {"_id": False, "name": True, "data": True})
    return get_random(data, number)


def get_all():
    """
   ?  Get all categories and their data.

    * Returns:  
    list: A list containing dictionaries for each category with their respective data.
          - Example: [{"name": "Category1", "data": {"item1": "description1", "item2": "description2", ...}},
                      {"name": "Category2", "data": {"item1": "description1", "item2": "description2", ...}}, ...]
    """
    return [doc for doc in client.Categorys.Categories.find({}, {"_id": False})]


def get_only_data(category: str):
    """
    ? Get the data for a specific category.

    * Args:
    category (str): The name of the category.

    * Returns:
    dict: A dictionary containing the data for the specified category.
          - Example: {"name": "Category", "data": {"item1": "description1", "item2": "description2", ...}}
    """
    data = client.Categorys.Categories.find_one(
        {"name": category}, {"_id": False, "data": True})
    return data


def add_category(data: Category):
    """
    ? Add a new category with its data.

    * Args:
    data (Category): The Category object containing the category name and data.

    * Returns:
    dict: A dictionary with a success message.
          - Example: {"message": "success"}
    """
    data = data.model_dump()
    client.Categorys.Categories.insert_one(data)
    return {"message": "success"}


def get_data(category: str):
    """
    ? Get the data for a specific category.

    * Args:
    category (str): The name of the category.

    * Returns:
    dict: A dictionary containing the data for the specified category.
          - Example: {"name": "Category", "data": {"item1": "description1", "item2": "description2", ...}}
    """
    new_data = client.Categorys.Categories.find_one(
        {"name": category}, {"_id": False, "data": True})
    return new_data


def insert_new_data(category: str, new_data: dict):
    """
    ? Update the data for a specific category.

    * Args:
    category (str): The name of the category.
    new_data (dict): The updated data for the category.

    * Returns:
    None
    """
    client.Categorys.Categories.update_one(
        {"name": category}, {"$set": {"data": new_data["data"]}})


def insert_data(category: str, data: Data):
    """
    ? Insert new data into a specific category.

    * Args:
    category (str): The name of the category.
    data (Data): The Data object containing the name and data.

    * Returns:
    dict: A dictionary with a success message.
          - Example: {"message": "success"}
    """
    data = data.model_dump()
    new_data = get_data(category)
    new_data["data"][data["name"]] = data["data"]
    insert_new_data(category, new_data)
    return {"message": "success"}


def delete_category(category: str):
    """
    ? Delete a category.

    * Args:
    category (str): The name of the category.

    * Returns:
    dict: A dictionary with a success message.
          - Example: {"message": "success"}
    """
    client.Categorys.Categories.delete_one({"name": category})
    return {"message": "success"}


def delete_from_category(category: str, name: str):
    """
    ? Delete data from a specific category.

    * Args:
    category (str): The name of the category.
    name (str): The name of the data to be deleted.

    * Returns:
    dict: A dictionary with a success message.
          - Example: {"message": "success"}
    """
    new_data = get_data(category)
    del new_data["data"][name]
    insert_new_data(category, new_data)
    return {"message": "success"}


def modify_data(category: str, data: Data):
    """
    ? Delete data from a specific category.

    * Args:
    category (str): The name of the category.
    name (str): The name of the data to be deleted.

    * Returns:
    dict: A dictionary with a success message.
          - Example: {"message": "success"}
    """
    data = data.model_dump()
    new_data = get_data(category)
    new_data["data"][data["name"]] = data["data"]
    insert_new_data(category, new_data)
    return {"message": "success"}


def add_riddle(data: Riddle):
    """
    ? Add a single riddle to the database.

    * Args:
    data (Riddle): The Riddle object containing riddle details.

    * Returns:
    dict: A dictionary with a success message.
          - Example: {"message": "success"}
    """
    riddle = data.model_dump()
    if check_riddle(riddle["riddle"]) is not None:
        return {"message": "riddle already exists"}
    client.Categorys.Riddles.insert_one(riddle)
    return {"message": "success"}


def add_riddles(data: dict):
    """
    ? Add multiple riddles to the database.

    * Args:
    data (dict): A dictionary containing a list of riddles.

    * Returns:
    dict: A dictionary with a success message.
          - Example: {"message": "success"}
    """
    data = data["list"]
    for riddle in data:
        add_riddle(Riddle.model_validate(riddle))
    return {"message": "success"}


def get_all_riddles():
    """
    ? Retrieve all riddles from the database.

    * Returns:
    list: A list of dictionaries containing riddle details.
    """
    return [riddle for riddle in client.Categorys.Riddles.find({}, {"_id": False})]


def get_all_riddles_from(category: str):
    """
    ? Retrieve all riddles from a specific category.

    * Args:
    category (str): The name of the category.

    * Returns:
    list: A list of dictionaries containing riddle details.
    """
    return [riddle for riddle in client.Categorys.Riddles.find({"category": category}, {"_id": False})]


def get_riddles(category: str, difficult: str):
    """
    ? Retrieve all riddles from a specific category.

    * Args:
    category (str): The name of the category.

    * Returns:
    list: A list of dictionaries containing riddle details.
    """
    return [riddle for riddle in client.Categorys.Riddles.find({"$and": [{"category": category}, {"difficult": difficult}]}, {"_id": False})]


def get_riddle(category: str, difficult: str):
    """
    ? Retrieve a random riddle from a specific category and difficulty level.

    * Args:
    category (str): The name of the category.
    difficult (str): The difficulty level of the riddles.

    * Returns:
    dict: A dictionary containing details of a random riddle.
    """
    return random.choice(get_riddles(category, difficult))


def check_riddle(riddle: str):
    """
    ? Check if a riddle already exists in the database.

    * Args:
    riddle (str): The riddle to be checked.

    * Returns:
    dict: A dictionary containing riddle details if it exists, or None if not.
    """
    return client.Categorys.Riddles.find_one({"riddle": riddle}, {"_id": False})


def get_riddle_categories():
    """
    ? Check if a riddle already exists in the database.

    * Args:
    riddle (str): The riddle to be checked.

    * Returns:
    dict: A dictionary containing riddle details if it exists, or None if not.
    """
    categories = client.Categorys.Riddles.find(
        {}, {"_id": False, "category": True})
    return sorted(set([category["category"] for category in categories]))
