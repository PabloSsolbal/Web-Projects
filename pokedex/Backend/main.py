# This code creates the most simple API to get the cards of a pokemon
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import API_Key
from pokemontcgsdk import Card
from pokemontcgsdk import RestClient
# ! Import the FastAPI Library and configure the API Key
# ! Import the PokemonTCG SDK Card class and the Client

# ? Start the App with FastAPI
app = FastAPI()

# ? Configure the REST Client
RestClient.configure(API_Key)

# ! Allows CORS only from the frontend origin
origins = ["*"]

# ? Set the CORS Deatils
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ? This function returns the cards of a pokemon
# * Initialize an empty list to store the cards
# * Search for the cards with the specific Pokemon name
# * Iterate through the cards and create a dictionary for each card
# * - Add the name, image URL, image URL HiRes, and rarity to the dictionary
# * Add the dictionary to the first list
# @param {String} PokemonName - The name of the pokemon
# @returns {List} Cards_JSON - A list of dictionaries containing the cards of the pokemon


@app.get("/TcgData/{PokemonName}")
async def PokemonData(PokemonName):
    Cards_JSON = []

    Cards = Card.where(q=f'name:{PokemonName}')

    for card in Cards:

        Card_Object = {
            "name": card.name,
            "imageUrl": card.images.small,
            "imageUrlHiRes": card.images.large,
            "rarity": card.rarity, }

        Cards_JSON.append(Card_Object)

    return Cards_JSON
