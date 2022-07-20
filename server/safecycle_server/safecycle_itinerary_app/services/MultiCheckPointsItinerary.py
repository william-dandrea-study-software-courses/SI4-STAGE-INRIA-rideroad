from typing import List

from .ItineraryGeneration import ItineraryGeneration
from .models.LonLat import LonLat
from .models.MultiCheckPointsModel import MultiCheckPointsModel


class MultiCheckPointsItinerary:

    def __init__(self, start : LonLat, end : LonLat, checkPoints : List[LonLat], roadType: int):
        self.__start = start
        self.__end = end
        self.__checkPoints = checkPoints
        self.__roadType = roadType

    def search(self):

        itineraries_steps = []

        # Generate the itineraries
        lastCheckPoint: LonLat = self.__start
        for index in range(0, len(self.__checkPoints)+1):
            checkPoint = self.__checkPoints[index] if index < len(self.__checkPoints) else self.__end
            itineraryGeneration = ItineraryGeneration(lastCheckPoint.longitude, lastCheckPoint.latitude, checkPoint.longitude, checkPoint.latitude, self.__roadType)
            itinerary = itineraryGeneration.search()

            itineraries_steps.append(itinerary)
            lastCheckPoint = checkPoint

        # Filter the variantes
        itineraries = [
            itineraries_steps[0][0],
            itineraries_steps[0][1],
            itineraries_steps[0][2],
            itineraries_steps[0][3],
        ]


        for index_step in range(1, len(itineraries_steps)):
            step = itineraries_steps[index_step]

            for index_alternative in range(0, 4):
                itineraries[index_alternative]["time"] += step[index_alternative]["time"]
                itineraries[index_alternative]["cost"] += step[index_alternative]["cost"]
                itineraries[index_alternative]["length"] += step[index_alternative]["length"]
                itineraries[index_alternative]["filtered_ascend"] += step[index_alternative]["filtered_ascend"]
                itineraries[index_alternative]["paths"].append(step[index_alternative]["paths"])
                itineraries[index_alternative]["altitude_profil"].append(step[index_alternative]["altitude_profil"])

        return MultiCheckPointsModel(
            departure=self.__start,
            destination=self.__end,
            checkPoints=self.__checkPoints,
            itineraries=itineraries,
        )



