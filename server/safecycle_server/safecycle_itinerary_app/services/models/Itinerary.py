from typing import List

from .Path import Path


class Itinerary:


    def __init__(self, time, length, cost):
        self.time = time
        self.profile = None
        self.alternative = None
        self.paths: List[Path] = []
        self.cost = cost
        self.length = length


    def toDict(self):
        return {
            "time": self.time,
            "profile": self.profile,
            "alternative": self.alternative,
            "paths": [path.toDict() for path in self.paths],
            "cost": self.cost,
            "length": self.length,
        }