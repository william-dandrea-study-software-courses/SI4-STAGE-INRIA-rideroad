from typing import List

from .Path import Path


class Itinerary:


    def __init__(self, time, length, cost, filtered_ascend, alternative):
        self.time = time
        self.profile = None
        self.alternative = alternative
        self.paths: List[Path] = []
        self.cost = cost
        self.length = length
        self.filtered_ascend = filtered_ascend
        self.altitude_profil: List[float] = []
        self.amenities: List = []



    def toDict(self):
        return {
            "time": self.time,
            "profile": self.profile,
            "alternative": self.alternative,
            "paths": [pat.toDict() for pat in self.paths],
            "cost": self.cost,
            "length": self.length,
            "filtered_ascend": self.filtered_ascend,
            "altitude_profil": self.altitude_profil,
            "amenities": self.amenities
        }