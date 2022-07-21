from typing import List

from .Itinerary import Itinerary
from .LonLat import LonLat


class MultiCheckPointsModel:

    def __init__(self, departure: LonLat, destination: LonLat, checkPoints: List[LonLat], itineraries: List[Itinerary]):
        self.departure = departure
        self.destination = destination
        self.checkPoints: List[LonLat] = checkPoints
        self.itineraries: List[Itinerary] = itineraries

    def toDict(self):
        return {
            "departure": self.departure.toDict(),
            "destination": self.destination.toDict(),
            "checkPoints": [ch.toDict() for ch in self.checkPoints],
            "itineraries": [it.toDict() for it in self.itineraries],
        }

        