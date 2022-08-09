from typing import List

from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass

from .models.AmenityEnum import AmenityEnum
from .models.TourismEnum import TourismEnum
from .utils import query_builder_bbox


class ResearchAmenitiesBbox:

    def __init__(self, bottom_left_longitude: float, bottom_left_latitude: float, top_right_longitude: float, top_right_latitude, amenities: List[str]):
        self.__bottom_left_longitude = bottom_left_longitude
        self.__bottom_left_latitude = bottom_left_latitude
        self.__top_right_longitude = top_right_longitude
        self.__top_right_latitude = top_right_latitude

        self.__amenities: List[AmenityEnum] = []
        self.__tourism: List[TourismEnum] = []
        self.filterAmenities(amenities)


    def launch(self):

        overpass = Overpass()
        bbox = [self.__bottom_left_latitude, self.__bottom_left_longitude, self.__top_right_latitude, self.__top_right_longitude]

        query = query_builder_bbox(bbox=bbox, amenitySelectors=self.__amenities, tourismSelectors=self.__tourism)
        result = overpass.query(query, timeout=10).toJSON()['elements']

        return result



    def filterAmenities(self, amenities: List[str]):

        # AmenityEnum.DRINKING_WATER, AmenityEnum.RESTAURANT, AmenityEnum.BICYCLE_REPAIR_STATION, AmenityEnum.SHELTER, AmenityEnum.TOILETS
        for amenity in amenities:
            if amenity == "drinking_water":
                self.__amenities.append(AmenityEnum.DRINKING_WATER)
            elif amenity == "restaurant":
                self.__amenities.append(AmenityEnum.RESTAURANT)
            elif amenity == "bicycle_repair_station":
                self.__amenities.append(AmenityEnum.BICYCLE_REPAIR_STATION)
            elif amenity == "shelter":
                self.__amenities.append(AmenityEnum.SHELTER)
            elif amenity == "toilets":
                self.__amenities.append(AmenityEnum.TOILETS)

            elif amenity == "camp_site":
                self.__tourism.append(TourismEnum.CAMP_SITE)


