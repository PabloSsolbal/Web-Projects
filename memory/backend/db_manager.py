import random
from config import get_client
from pydantic import BaseModel

client = get_client()


class Data(BaseModel):
    name: str
    data: dict


class Category(BaseModel):
    name: str
    data: dict


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
