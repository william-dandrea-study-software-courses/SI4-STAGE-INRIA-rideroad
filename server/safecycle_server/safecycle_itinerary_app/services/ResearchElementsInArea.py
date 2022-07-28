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


    """
    def calculateCoordinatesRectangleBbox(self):
        xs = self.__start.lat
        ys = self.__start.lon
        xe = self.__end.lat
        ye = self.__end.lon

        alpha = np.arctan2((ye - ys), (xe - xs))

        xsP = xs + self.__rayon * np.cos(np.pi - alpha)
        ysP = ys - self.__rayon * np.sin(np.pi - alpha)

        xeP = xe - self.__rayon * np.cos(np.pi - alpha)
        yeP = ye + self.__rayon * np.sin(np.pi - alpha)

        # 
        Y
        |
        |                 (x1,y1) --------------------------- (x4,y4)
        |                    |                                   |
        |                    |                                   |
        |     ---------- (xsP,ysP) ------------------------- (xeP,yeP) ----------
        |                    |                                   |
        |                    |                                   |
        |                 (x2,y2) --------------------------- (x3,y3)
        |           
        ---------------------------------------------------------------------> X
        
        # 


        x1 = xsP + self.__rayon * np.cos(alpha + (np.pi / 2))
        y1 = ysP + self.__rayon * np.sin(alpha + (np.pi / 2))
        x2 = xsP + self.__rayon * np.cos(alpha - (np.pi / 2))
        y2 = ysP + self.__rayon * np.sin(alpha - (np.pi / 2))
        x4 = xeP + self.__rayon * np.cos(alpha + (np.pi / 2))
        y4 = yeP + self.__rayon * np.sin(alpha + (np.pi / 2))
        x3 = xeP + self.__rayon * np.cos(alpha - (np.pi / 2))
        y3 = yeP + self.__rayon * np.sin(alpha - (np.pi / 2))

        numberOfDecimals = 5

        x1 = round(x1, numberOfDecimals)
        y1 = round(y1, numberOfDecimals)
        x2 = round(x2, numberOfDecimals)
        y2 = round(y2, numberOfDecimals)
        x4 = round(x4, numberOfDecimals)
        y4 = round(y4, numberOfDecimals)
        x3 = round(x3, numberOfDecimals)
        y3 = round(y3, numberOfDecimals)

        # plt.plot([xsP, xeP], [ysP, yeP], 'b')
        # plt.plot([xs, xe], [ys, ye], 'r')

        # plt.plot([x1, x2, x3, x4, x1], [y1, y2, y3, y4, y1], 'g')
        # plt.show()

        return [y2, x2, y4, x4]
        
    """