import unidecode
import random
import os


def hangmand_data_creator(word):
    """
    ? Create Hangman game data.

    * Args:
    - word (str): The word for the Hangman game.

    * Returns:
    dict: A dictionary containing Hangman game data.
          - 'word' (list): The characters of the word.
          - 'hidden' (list): The hidden representation of the word with underscores.
          - 'attempts' (int): The number of attempts allowed.
    """
    word = [x for x in word]
    hidden = ['_']*len(word)
    attemps = int(3+round(len(word)/2))
    return {'word': word, 'hidden': hidden, 'attemps': 6 if attemps < 6 else attemps}


def all():
    """
    ? Get all data from text files in the 'archives' directory.

    * Returns:
    dict: A dictionary containing data from text files in the 'archives' directory.
          - Keys: Category names.
          - Values: Lists of words in each category.
    """
    all_data = {}
    categories = os.listdir('archives')
    for category in categories:
        all_words = []
        with open(f"archives/{category}", "r", encoding="utf-8") as f:
            words = f.read().splitlines()
            words = [word.replace("\n", "") for word in words]
            all_words = [word.lower() for word in words]
        all_data[category.replace(".txt", "")] = all_words
    return all_data


def word_selector(category):
    """
    ? Select a word randomly from a specific category file.

    * Args:
    category (str): The name of the category.

    * Returns:
    dict: A dictionary containing information about the selected word.
          - Keys: 'word', 'hidden', 'attempts'.
    """
    with open(f'archives/{category}.txt', 'r', encoding='utf-8') as f:
        words = f.read().splitlines()
        word = random.choice(words)
        word = unidecode.unidecode(word)
        word = word.lower()

        return hangmand_data_creator(word)


def get_words_random():
    """
    ? Get a random word from a random category.

    * Returns:
    dict: A dictionary containing information about the selected word.
          - Keys: 'word', 'hidden', 'attempts'.
    """
    categories = os.listdir('archives')
    categories.pop(categories.index("challenge.txt"))
    category = random.choice(categories)
    return word_selector(category.replace(".txt", ""))


def get_words_challenge():
    """
    ? Get a word for the challenge mode.

    * Returns:
    dict: A dictionary containing information about the selected word.
          - Keys: 'word', 'hidden', 'attempts'.
    """
    game = word_selector("challenge")
    game["attemps"] = 6
    return game


def add_word(word, category):
    """
    ? Add a word to the specified category.

    * Args:
    word (str): The word to be added.
    category (str): The category to which the word should be added.

    * Returns:
    dict: A dictionary with a message indicating the success or failure of the operation.
          - Example: {"message": "word added"} or {"message": "word already exists"} or {"message": "something went wrong"}
    """
    try:
        with open(f"archives/{category}.txt", "r+", encoding="utf-8") as file:
            file_data = file.read()
            if word not in file_data:
                file.write(f"\n{word}") if file_data.splitlines(
                ) != [] else file.write(f"{word}")
                file.close()
                return {"message": "word added"}
            else:
                return {"message": "word already exists"}
    except:
        return {"message": "something went wrong"}


def get_all_words(category):
    """
    ? Get all words from the specified category.

    * Args:
    category (str): The category from which words should be retrieved.

    * Returns:
    list: A list of dictionaries containing information about each word.
          - Each dictionary has keys: 'word', 'hidden', 'attempts'.
    """
    with open(f'archives/{category}.txt', 'r', encoding='utf-8') as f:
        words = f.read().splitlines()
        words = sorted(set([unidecode.unidecode(word).lower()
                       for word in words]))
        words = [hangmand_data_creator(word) for word in words]
        if category == "challenge":
            for word in words:
                word["attemps"] = 6
        return words


def get_category_names():
    categories = os.listdir('archives')
    return [category.replace(".txt", "") for category in categories]


def delete_hangman_category(category: str):
    try:
        os.remove(f"archives/{category}.txt")
        return {"message": "category deleted"}
    except:
        return {"message": "something went wrong"}


def create_category(category: str):
    if category not in [category.replace(".txt", "") for category in os.listdir("archives")]:
        try:
            with open(os.path.join("archives/", f"{category}.txt"), "w", encoding="utf-8"):
                pass
            return {"message": "category created"}
        except:
            return {"message": "something went wrong"}


def add_words(category: str, words: list):
    """
    ? Get the names of all hangman categories.

    * Returns:
    list: A list of category names.
          - Example: ['category1', 'category2', ...]
    """
    for word in words:
        add_word(word, category)
    return {"message": "words added"}


def update_word(category: str, old_word: str, new_word: str):
    """
    ? Delete a hangman category.

    * Args:
    category (str): The name of the category to be deleted.

    * Returns:
    dict: A dictionary with a message indicating the success or failure of the operation.
          - Example: {"message": "category deleted"} or {"message": "something went wrong"}
    """
    with open(f"archives/{category}.txt", "r+", encoding="utf-8") as file:
        words = file.read().splitlines()
        for word in words:
            if word == old_word:
                words[words.index(word)] = new_word
        file.truncate(0)
        file.close()
    add_words(category, words)
    return {"message": "word updated"}


def delete_hangman_word(category: str, word: str):
    """
    ? Create a new hangman category.

    * Args:
    category (str): The name of the category to be created.

    * Returns:
    dict: A dictionary with a message indicating the success or failure of the operation.
          - Example: {"message": "category created"} or {"message": "something went wrong"}
    """
    with open(f"archives/{category}.txt", "r+", encoding="utf-8") as file:
        words = file.read().splitlines()
        for w in words:
            if w == word:
                del words[words.index(w)]
        file.truncate(0)
        file.close()
    add_words(category, words)
    return {"message": "word deleted"}
