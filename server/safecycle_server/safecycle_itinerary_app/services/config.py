

import json


def load_js(path) :
    with open(path, "r") as f:
        return json.load(f)

class Config:
    DEBUG = True
    DEFAULT_PROFILES = load_js("res/default_profiles.json")

    URL_ADD_NEW_AMENITIES: str = "https://master.apis.dev.openstreetmap.org"

    BASE_ROUTING_INFOS_OSM_URL: str = "https://routing.openstreetmap.de/routed-bike/route/v1/driving/"
    DETAILS_ROUTING_INFOS_OSM_URL: str = "?overview=false&alternatives=false&steps=true"

    BROUTER_BASE_URL: str = "http://brouter.de/brouter?"