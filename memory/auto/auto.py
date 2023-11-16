import os
import sys
import json


def generate_element_JSON():
    """
        ? Generate Elements JSON File

        * This script generates an elements JSON file that contains file paths to various images and sound elements used in a web application. It scans directories for images, Hangman elements, and sound files, and then compiles these file paths into a JSON format.

        * The generated JSON file, "elements.json," is used to caché these assets in the web application for faster loading.

        Example:
            * - When executed, the script collects file paths from the "images," "imgs," and "sounds" directories and compiles them into a JSON structure.
            * - The resulting "elements.json" file is created, containing the data necessary for chache the assets.

        Note:
            * - Ensure that this script is executed in the auto directory, outsite the "images," "imgs," and "sounds" directories are located.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    carpetas = ["images", "imgs", "sounds"]

    elements = []

    for carpeta in carpetas:

        carpeta_path = os.path.join(script_dir, "..", carpeta)
        if os.path.exists(carpeta_path):
            elementos = os.listdir(carpeta_path)
            elementos = [f'{carpeta}/{elemento}' for elemento in elementos]
            elements.extend(elementos)

    with open("elements.json", "w") as f:
        json.dump({"data": elements}, f)
        f.close()


def generate_links_JSON():
    elements = []
    with open("links.txt", "r+", encoding="utf-8") as f:
        links = f.read().splitlines()
        elements = [link for link in links]
        f.close()
    with open("links.json", "w+", encoding="utf-8") as f:
        json.dump({"links": elements}, f, ensure_ascii=False)
        f.close()


def main():
    while True:
        print("elements - generate the elements JSON")
        print("links - generate the links JSON")
        print("exit - exit program")
        opc = input("Enter an option: ")
        match opc:
            case "elements":
                generate_element_JSON()
                continue
            case "links":
                generate_links_JSON()
                continue
            case "exit":
                sys.exit()
            case default:
                print("command not valid")
                continue


if __name__ == "__main__":
    main()
