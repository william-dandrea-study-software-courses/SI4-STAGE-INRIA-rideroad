from typing import List

from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass

from .models.AmenityEnum import AmenityEnum
from .models.TourismEnum import TourismEnum
from .utils import query_builder_bbox


class ResearchAmenitiesBbox:

    def __init__(self, bottom_left_longitude: float, bottom_left_latitude: float, top_right_longitude: float, top_right_latitude, amenities: List[AmenityEnum], tourism: List[TourismEnum]):
        self.__bottom_left_longitude = bottom_left_longitude
        self.__bottom_left_latitude = bottom_left_latitude
        self.__top_right_longitude = top_right_longitude
        self.__top_right_latitude = top_right_latitude

        self.__amenities = amenities
        self.__tourism = tourism

    def launch(self):

        bbox = [self.__bottom_left_latitude, self.__bottom_left_longitude, self.__top_right_latitude, self.__top_right_longitude]

        query = query_builder_bbox(bbox=bbox, amenitySelectors=self.__amenities, tourismSelectors=self.__tourism)

        print(query)
        overpass = Overpass()
        result = overpass.query(query)

        return result.toJSON()['elements']