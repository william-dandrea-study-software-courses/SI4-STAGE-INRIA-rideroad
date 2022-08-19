from typing import List

from .models.Coord import Coord
from .models.DirectionModel import OSMRResponse, OSMRDeserializer
import requests
import logging

from .variables import BASE_ROUTING_INFOS_OSM_URL, DETAILS_ROUTING_INFOS_OSM_URL

logger = logging.getLogger(__name__)

class DirectionInfosGenerator:


    def __init__(self, startLocation : Coord, endLocation: Coord, checkpoints: List[Coord]):
        self.startLocation: Coord = startLocation
        self.endLocation: Coord = endLocation
        self.checkpoints: List[Coord] = checkpoints



    def getDirections(self, removeDepartAndDestination: bool = True) -> OSMRResponse:
        result = self.__launchRequest()
        return OSMRDeserializer.deserialize(result)


    def __launchRequest(self):

        checkpointsStr = ""
        for ch in self.checkpoints:
            checkpointsStr += f"{ch.lon},{ch.lat};"
        checkpointsStr = checkpointsStr[:-1]

        url: str = f"{BASE_ROUTING_INFOS_OSM_URL}{self.startLocation.lon},{self.startLocation.lat};{checkpointsStr};{self.endLocation.lon},{self.endLocation.lat}{DETAILS_ROUTING_INFOS_OSM_URL}"

        request_manager = requests.get(url, timeout=2)

        if request_manager.status_code == 200:
            logger.info("Request worked")
            return request_manager.json()
        else:
            logger.error(f"Request {url} failed")
            raise Exception("Cannot Load routing")