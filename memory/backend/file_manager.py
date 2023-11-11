import unidecode
import random
import os


def hangmand_data_creator(word):
    word = [x for x in word]

    hidden = ['_']*len(word)

    attemps = int(3+round(len(word)/2))

    return {'word': word, 'hidden': hidden, 'attemps': 6 if attemps < 6 else attemps}


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
        word = word.lower()

        return hangmand_data_creator(word)


def get_words_random():
    categories = os.listdir('archives')
    categories.pop(categories.index("challenge.txt"))
    category = random.choice(categories)
    return word_selector(category.replace(".txt", ""))


def get_words_challenge():
    game = word_selector("challenge")
    game["attemps"] = 6
    return game


def add_word(word, category):
    try:
        with open(f"archives/{category}.txt", "r+") as file:
            file_data = file.read()
            if word not in file_data:
                file.write(f"\n{word}")
                file.close()
                return {"message": "word added"}
            else:
                return {"message": "word already exists"}
    except:
        return {"message": "something went wrong"}


def get_all_words(category):
    with open(f'archives/{category}.txt', 'r', encoding='utf-8') as f:
        words = f.read().splitlines()
        words = sorted(set([unidecode.unidecode(word).lower()
                       for word in words]))
        return [hangmand_data_creator(word) for word in words]
