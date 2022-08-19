


import json


def load_js(path) :
    with open(path, "r") as f:
        return json.load(f)

class Config:
    IS_DEV = True
    BROUTER_ROOT="http://brouter.de/brouter"
    DEFAULT_PROFILES = load_js("res/default_profiles.json")
