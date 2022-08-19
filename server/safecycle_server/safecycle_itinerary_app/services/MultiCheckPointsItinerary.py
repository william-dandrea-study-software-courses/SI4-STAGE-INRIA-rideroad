from typing import List
from django.core import serializers

from .ItineraryGeneration import ItineraryGeneration
from .models.Itinerary import Itinerary
from .models.LonLat import LonLat
from .models.MultiCheckPointsModel import MultiCheckPointsModel


class MultiCheckPointsItinerary:

    def __init__(self, start : LonLat, end : LonLat, checkPoints : List[LonLat], roadType: int):
        self.__start = start
        self.__end = end
        self.__checkPoints = checkPoints
        self.__roadType = roadType

        self.__multiCheckPointModel = MultiCheckPointsModel(
            departure=self.__start,
            destination=self.__end,
            checkPoints=self.__checkPoints,
            itineraries=[],
        )

    def search(self):
        # Recover all itineraries (with all the variantes) from Brouter
        allItinerariesNoConcatenate: List[List[Itinerary]] = []
        lastCheckpoint: LonLat = self.__start
        for index in range(0, len(self.__checkPoints) + 1):
            checkPoint = self.__checkPoints[index] if index < len(self.__checkPoints) else self.__end
            itineraryGeneration = ItineraryGeneration(lastCheckpoint.longitude, lastCheckpoint.latitude,
                                                      checkPoint.longitude, checkPoint.latitude, self.__roadType)
            itineraries = itineraryGeneration.search()

            allItinerariesNoConcatenate.append(itineraries)
            lastCheckpoint = checkPoint

        # Maximum available alternatives
        maximumAvailableAlternatives = min([len(it) for it in allItinerariesNoConcatenate])

        # Create the empty itineraries
        self.__multiCheckPointModel.itineraries = [Itinerary(0, 0, 0, 0, alternative) for alternative in range(maximumAvailableAlternatives)]

        # We explore now the itineraries steps and affect this steps to the correct alternative
        for step in allItinerariesNoConcatenate:
            for alternativeStep in step:
                self.__multiCheckPointModel.itineraries[alternativeStep.alternative].time += alternativeStep.time
                self.__multiCheckPointModel.itineraries[alternativeStep.alternative].profile = alternativeStep.profile
                self.__multiCheckPointModel.itineraries[alternativeStep.alternative].cost = alternativeStep.cost
                self.__multiCheckPointModel.itineraries[alternativeStep.alternative].length = alternativeStep.length
                self.__multiCheckPointModel.itineraries[alternativeStep.alternative].filtered_ascend = alternativeStep.filtered_ascend
                self.__multiCheckPointModel.itineraries[alternativeStep.alternative].altitude_profil.extend(alternativeStep.altitude_profil)
                self.__multiCheckPointModel.itineraries[alternativeStep.alternative].paths.extend(alternativeStep.paths)



        return self.__multiCheckPointModel