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

        itinerary: ItineraryGeneration = ItineraryGeneration(departure_longitude=self.__start.longitude, departure_latitude=self.__start.latitude,
                                        destination_longitude=self.__end.longitude,
                                        destination_latitude=self.__end.latitude, road_type=self.__roadType)

        result: List[Itinerary] = itinerary.search()
        self.__multiCheckPointModel.itineraries = result



        return self.__multiCheckPointModel