import json
from typing import List

from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass
import numpy as np
import matplotlib.pyplot as plt

from . import utils
from .models.AmenityEnum import AmenityEnum
from .models.Coord import Coord
from .models.LonLat import LonLat

class ResearchElementsInArea:

    """
        - Liste de segments autour dequels on va chercher des trucs
        - Rayon autour duquel on va chercher des lieus
        - List de tout les lieux (AmenityEnum) que l'on va chercher
    """

    def __init__(self, path: List[Coord], radius: float, amenities: List[AmenityEnum]):
        # query = overpassQueryBuilder(bbox=[48.27, 16.47, 48.3, 16.5], elementType='node', selector=[f'"amenity"="{AmenityEnum.DRINKING_WATER}"'], out='body')
        # overpass = Overpass()
        # busStops = overpass.query(query)
        # print(busStops.toJSON())

        self.__radius: float = radius
        self.__path: List[Coord] = path
        self.__amenities: List[AmenityEnum] = amenities



    def launch(self):
        overpass = Overpass()
        # query = overpassQueryBuilder(bbox=bbox, elementType='node', selector=[f'"amenity"="{AmenityEnum.ATM}"'], out='body')
        # val = '(node["amenity"="bench"](around:100.0, 43.550554, 7.011957, 43.601460,6.995536, 43.580754,7.110275, 43.657846,7.169487);node["amenity"="atm"](around:100.0, 43.550554, 7.011957, 43.601460,6.995536, 43.580754,7.110275, 43.657846,7.169487);); out;'
        url = self.generateUrl()
        amenities = overpass.query(url)
        print(url)

        return amenities.toJSON()['elements']


    def generateUrl(self):
        result = '('

        for amenity in self.generateAmenity():
            result += 'node' + amenity + self.generatePath() + ';'

        result += '); out;'

        return result

    def generatePath(self) -> str:
        result = f'(around:{self.__radius},'
        for index_path in range(len(self.__path)):
            coord = self.__path[index_path]
            result += f'{coord.lat}' + ','
            result += f'{coord.lon}' + (',' if index_path != len(self.__path) - 1 else '')

        result += ')'

        return result

    def generateAmenity(self) -> List[str]:
        return [f'["amenity"="{value}"]' for value in self.__amenities]