from typing import List

from .models.Coord import Coord
from .models.DirectionModel import OSMRResponse, OSMRDeserializer
from .models.LonLat import LonLat
import requests
import logging


logger = logging.getLogger(__name__)

class DirectionInfosGenerator:


    def __init__(self, startLocation : Coord, endLocation: Coord, checkpoints: List[Coord]):
        self.startLocation: Coord = startLocation
        self.endLocation: Coord = endLocation
        self.checkpoints: List[Coord] = checkpoints



    def getDirections(self, removeDepartAndDestination: bool = True) -> OSMRResponse:
        result = self.__launchRequest()
        return OSMRDeserializer.deserialize(result)




    """
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
    
    """




    def __launchRequest(self):

        checkpointsStr = ""
        for ch in self.checkpoints:
            checkpointsStr += f"{ch.lon},{ch.lat};"
        checkpointsStr = checkpointsStr[:-1]


        url: str = f"https://routing.openstreetmap.de/routed-bike/route/v1/driving/{self.startLocation.lon},{self.startLocation.lat};{checkpointsStr};{self.endLocation.lon},{self.endLocation.lat}?overview=false&alternatives=false&steps=true"


        print(url)
        request_manager = requests.get(url, timeout=2)

        if request_manager.status_code == 200:
            logger.info("Request worked")
            return request_manager.json()
        else:
            logger.error(f"Request {url} failed")
            raise Exception("Cannot Load routing")