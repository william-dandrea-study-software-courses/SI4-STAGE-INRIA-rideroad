from typing import List

from .models.Coord import Coord
from .models.DirectionModel import Direction
from .models.LonLat import LonLat
import requests
import logging


logger = logging.getLogger(__name__)

class DirectionInfosGenerator:


    def __init__(self, startLocation : Coord, endLocation: Coord):
        self.startLocation: Coord = startLocation
        self.endLocation: Coord = endLocation



    def getDirections(self, removeDepartAndDestination: bool = True) -> List[Direction]:

        result = self.__launchRequest()

        routes = result['routes']

        directions = []
        if len(routes) > 0:
            route = routes[0]
            if len(route["legs"]) > 0:
                leg = route["legs"][0]
                if (len(leg["steps"]) > 0):
                    steps = leg["steps"]

                    for step in steps:

                        location = step.get("maneuver").get("location")
                        modifier = step.get("maneuver").get("modifier")
                        exit = step.get("maneuver").get("exit")
                        type = step.get("maneuver").get("type")
                        name = step.get("name")
                        ref = step.get("ref")

                        # print(location, modifier, exit, type, name, ref)

                        if (removeDepartAndDestination):
                            if (type != "depart" and type != "arrive"):
                                direction = Direction(location = LonLat(location[0], location[1]), modifier = modifier, type = type, name = name, ref = ref, exit = exit)
                                directions.append(direction)
                        else:
                            direction = Direction(location=LonLat(location[0], location[1]), modifier=modifier, type=type, name=name, ref=ref, exit=exit)
                            directions.append(direction)



        return directions



    def __launchRequest(self):
        url: str = f"https://routing.openstreetmap.de/routed-bike/route/v1/driving/{self.startLocation.lon},{self.startLocation.lat};{self.endLocation.lon},{self.endLocation.lat}?overview=false&alternatives=false&steps=true"

        request_manager = requests.get(url, timeout=2)

        if request_manager.status_code == 200:
            logger.info("Request worked")
            return request_manager.json()

        logger.error(f"Request {url} failed")
        raise Exception("Cannot Load routing")