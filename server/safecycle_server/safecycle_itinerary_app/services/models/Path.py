from typing import Dict, List

from .Coord import Coord


class Path:


    def __init__(self):
        self.tags: Dict[str, str] = {}
        self.length = 0
        self.costs = dict()
        self.coords: List[Coord] = []


    def addNewCoordinateToPath(self, coord: Coord):
        self.coords.append(coord)

    def generateTags(self, waytages_from_message: str):
        for tag in waytages_from_message.split(" "):
            k, v = tag.split("=")
            self.tags[k] = v

    def setLength(self, length: float):
        self.length = length


    def toDict(self):
        return {
            "tags": self.tags,
            "length": self.length,
            "costs": self.costs,
            "coords": [coord.toDict() for coord in self.coords],
        }