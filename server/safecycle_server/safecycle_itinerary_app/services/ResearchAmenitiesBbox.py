from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass

from .models.AmenityEnum import AmenityEnum


class ResearchAmenitiesBbox:

    def __init__(self, bottom_left_longitude: float, bottom_left_latitude: float, top_right_longitude: float, top_right_latitude):
        self.__bottom_left_longitude = bottom_left_longitude
        self.__bottom_left_latitude = bottom_left_latitude
        self.__top_right_longitude = top_right_longitude
        self.__top_right_latitude = top_right_latitude

    def launch(self):
        query = overpassQueryBuilder(
            bbox=[self.__bottom_left_longitude, self.__bottom_left_latitude, self.__top_right_longitude, self.__top_right_latitude],
            elementType='node',
            selector=[f'"amenity"="{AmenityEnum.BAR}"'],
            out='body')
        overpass = Overpass()
        result = overpass.query(query)

        return result.toJSON()['elements']