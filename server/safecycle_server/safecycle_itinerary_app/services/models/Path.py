from typing import Dict, List

from .Coord import Coord
from .DirectionModel import StepOSMR


class Path:


    def __init__(self):
        self.tags: Dict[str, str] = {}
        self.length = 0
        self.costs = dict()
        self.coords: List[Coord] = []
        self.directionInfos: List[StepOSMR] = []


    def getFirstCoord(self):
        if len(self.coords) > 0:
            return self.coords[0]
        return None

    def getLastCoord(self):
        if len(self.coords) > 0:
            return self.coords[-1]
        return None


    def addNewCoordinateToPath(self, coord: Coord):
        self.coords.append(coord)

    def generateTags(self, waytages_from_message: str):
        for tag in waytages_from_message.split(" "):
            k, v = tag.split("=")
            self.tags[k] = v

    def setLength(self, length: float):
        self.length = length

    def setDirectionInfos(self, directions: List[StepOSMR]):
        self.directionInfos = directions

    def toDict(self):
        return {
            "tags": self.tags,
            "length": self.length,
            "costs": self.costs,
            "directions": [direc.toDict() for direc in self.directionInfos],
            "coords": [coord.toDict() for coord in self.coords],
            "first_coord": self.coords[0].toDict() if len(self.coords) > 0 else None,
            "last_coord": self.coords[-1].toDict() if len(self.coords) > 0 else None,
        }