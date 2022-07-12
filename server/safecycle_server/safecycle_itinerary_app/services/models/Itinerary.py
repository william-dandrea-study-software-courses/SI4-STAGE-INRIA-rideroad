from typing import List

from .Path import Path


class Itinerary:


    def __init__(self, time, length, cost, filtered_ascend):
        self.time = time
        self.profile = None
        self.alternative = None
        self.paths: List[Path] = []
        self.cost = cost
        self.length = length
        self.filtered_ascend = filtered_ascend
        self.altitude_profil: List[float] = []


    def toDict(self):
        return {
            "time": self.time,
            "profile": self.profile,
            "alternative": self.alternative,
            "paths": [path.toDict() for path in self.paths],
            "cost": self.cost,
            "length": self.length,
            "filtered_ascend": self.filtered_ascend,
            "altitude_profil": self.altitude_profil,
        }