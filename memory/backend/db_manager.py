import random
from config import get_client
from pydantic import BaseModel
from pymongo import DESCENDING

client = get_client()


class User(BaseModel):
    name: str
    email: str
    points: int
    coins: int


class Data(BaseModel):
    name: str
    data: dict


class Category(BaseModel):
    name: str
    data: dict


def delete_user(data: dict):
    try:
        client.Users.Users.find_one_and_delete(
            {"$and": [{"name": data["name"]}, {"email": data["email"]}]})
        return {"message": "success"}
    except:
        return {"message": "user don't exist"}


def get_user(name: str):
    user = client.Users.Users.find_one({"name": name}, {"_id": False})
    return {"name": user["name"], "points": user["points"], "coins": user["coins"], "levels": user["levels"]} if user is not None else None


def log_in_user(data: dict):
    user = client.Users.Users.find_one(
        {"$and": [{"name": data["name"]}, {"email": data["email"]}]}, {"_id": False})
    return {"message": "success"} if user is not None else {"message": "User don't exist"}


def search_user(name: str, email: str):
    user = client.Users.Users.find_one(
        {"$or": [{"name": name}, {"email": email}]}, {"_id": False})
    return {"name": user["name"], "points": user["points"], "coins": user["coins"], "levels": user["levels"]} if user is not None else None
    return user


def create_user(user: User):
    user = user.model_dump()
    if search_user(user["name"], user["email"]) is not None:
        return {"message": "user already exists"}
    user["levels"] = dict()
    user["levels"]["memory"] = ["Emociones", "Comidas", "Colores", "Animales"]
    user["levels"]["hangman"] = ["Animales", "Ciencia", "Comics", "Comidas"]
    client.Users.Users.insert_one(user)
    return {"message": "success"}


def add_points(name: str, points: int):
    client.Users.Users.find_one_and_update(
        {"name": name}, {"$inc": {"points": points}})
    return {"message": "success"}


def add_coins(name: str, coins: str):
    client.Users.Users.find_one_and_update(
        {"name": name}, {"$inc": {"coins": coins}}
    )
    return {"message": "success"}


def unlock_level(name: str, game: str, level: str):
    client.Users.Users.find_one_and_update(
        {"name": name}, {"$push": {f"levels.{game}": level}})
    return {"message": "success"}


def get_top_users():
    users = client.Users.Users.find().sort("points", DESCENDING).limit(10)
    users = [{"name": user["name"], "points": user["points"]}
             for user in users]
    return users


def get_random(data, number):
    items = list(data["data"].items())
    for _ in range(number):
        random.shuffle(items)
    items = items[:number]
    dicts = {item[0]: item[1] for item in items}
    return {"name": data["name"], "data": dicts}


def get_category(category: str, number: int):
    data = client.Categorys.Categories.find_one(
        {"name": category}, {"_id": False, "name": True, "data": True})
    return get_random(data, number)


def get_all():
    return [doc for doc in client.Categorys.Categories.find({}, {"_id": False})]


def get_only_data(category: str):
    data = client.Categorys.Categories.find_one(
        {"name": category}, {"_id": False, "data": True})
    return data


def add_category(data: Category):
    data = data.model_dump()
    client.Categorys.Categories.insert_one(data)
    return {"message": "success"}


def get_data(category: str):
    new_data = client.Categorys.Categories.find_one(
        {"name": category}, {"_id": False, "data": True})
    return new_data


def insert_new_data(category: str, new_data: dict):
    client.Categorys.Categories.update_one(
        {"name": category}, {"$set": {"data": new_data["data"]}})


def insert_data(category: str, data: Data):
    data = data.model_dump()
    new_data = get_data(category)
    new_data["data"][data["name"]] = data["data"]
    insert_new_data(category, new_data)
    return {"message": "success"}


def delete_category(category: str):
    client.Categorys.Categories.delete_one({"name": category})
    return {"message": "success"}


def delete_from_category(category: str, name: str):
    new_data = get_data(category)
    del new_data["data"][name]
    insert_new_data(category, new_data)
    return {"message": "success"}


def modify_data(category: str, data: Data):
    data = data.model_dump()
    new_data = get_data(category)
    new_data["data"][data["name"]] = data["data"]
    insert_new_data(category, new_data)
    return {"message": "success"}
