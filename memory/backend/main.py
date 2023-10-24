from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import MONGO_URL
# ! import the necesary modules
# * FastAPI
# * PyMongo

# ? Start the app with FastAPI
app = FastAPI()

#  ? Connect to the database with the mongoClient
client = MongoClient(MONGO_URL, server_api=ServerApi('1'))

# ? Configure the CORS
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
