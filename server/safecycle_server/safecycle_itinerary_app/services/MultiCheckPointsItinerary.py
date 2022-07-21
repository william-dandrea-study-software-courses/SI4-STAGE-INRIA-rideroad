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

        """

        itinerary: ItineraryGeneration = ItineraryGeneration(departure_longitude=self.__start.longitude, departure_latitude=self.__start.latitude,
                                        destination_longitude=self.__end.longitude,
                                        destination_latitude=self.__end.latitude, road_type=self.__roadType)

        result: List[Itinerary] = itinerary.search()
        self.__multiCheckPointModel.itineraries = result

        """


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


        # Dns un premier temps, on récupére juste la premiere variante
        finalItinerary: Itinerary = Itinerary(0, 0, 0, 0, 0)

        for step in allItinerariesNoConcatenate:
            currentAlternativeStep: Itinerary = step[0]
            finalItinerary.time += currentAlternativeStep.time
            finalItinerary.profile = None
            finalItinerary.alternative = 0
            finalItinerary.cost += currentAlternativeStep.cost
            finalItinerary.length += currentAlternativeStep.length
            finalItinerary.filtered_ascend += currentAlternativeStep.filtered_ascend

            finalItinerary.altitude_profil.extend(currentAlternativeStep.altitude_profil)
            finalItinerary.paths.extend(currentAlternativeStep.paths)

        self.__multiCheckPointModel.itineraries.append(finalItinerary)



        return self.__multiCheckPointModel