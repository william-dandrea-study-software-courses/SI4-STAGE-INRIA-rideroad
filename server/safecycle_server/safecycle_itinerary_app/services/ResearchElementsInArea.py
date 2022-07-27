from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass
import numpy as np
import matplotlib.pyplot as plt

from .models.AmenityEnum import AmenityEnum
from .models.LonLat import LonLat

class ResearchElementsInArea:

    """
        - Liste de segments autour dequels on va chercher des trucs
        - Rayon autour duquel on va chercher des lieus
        - List de tout les lieux (AmenityEnum) que l'on va chercher
    """

    def __init__(self, start: LonLat, end: LonLat, rayon: float):
        query = overpassQueryBuilder(bbox=[48.27, 16.47, 48.3, 16.5], elementType='node', selector=[f'"amenity"="{AmenityEnum.DRINKING_WATER}"'], out='body')
        # overpass = Overpass()
        # busStops = overpass.query(query)
        # print(busStops.toJSON())

        self.__start = start
        self.__end = end
        self.__rayon = rayon



    def launch(self):
        bbox = self.calculateCoordinatesRectangleBbox()

        overpass = Overpass()
        query = overpassQueryBuilder(bbox=bbox, elementType='node',
                                     selector=[f'"amenity"="{AmenityEnum.DRINKING_WATER}"'], out='body')

        waterPoints = overpass.query(query)
        print(waterPoints.toJSON())





    def calculateCoordinatesRectangleBbox(self):
        xs = self.__start.latitude
        ys = self.__start.longitude
        xe = self.__end.latitude
        ye = self.__end.longitude

        alpha = np.arctan2((ye - ys), (xe - xs))

        xsP = xs + self.__rayon * np.cos(np.pi - alpha)
        ysP = ys - self.__rayon * np.sin(np.pi - alpha)

        xeP = xe - self.__rayon * np.cos(np.pi - alpha)
        yeP = ye + self.__rayon * np.sin(np.pi - alpha)

        """
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
        
        """


        x1 = xsP + self.__rayon * np.cos(alpha + (np.pi / 2))
        y1 = ysP + self.__rayon * np.sin(alpha + (np.pi / 2))
        x2 = xsP + self.__rayon * np.cos(alpha - (np.pi / 2))
        y2 = ysP + self.__rayon * np.sin(alpha - (np.pi / 2))
        x4 = xeP + self.__rayon * np.cos(alpha + (np.pi / 2))
        y4 = yeP + self.__rayon * np.sin(alpha + (np.pi / 2))
        x3 = xeP + self.__rayon * np.cos(alpha - (np.pi / 2))
        y3 = yeP + self.__rayon * np.sin(alpha - (np.pi / 2))

        # plt.plot([xsP, xeP], [ysP, yeP], 'b')
        # plt.plot([xs, xe], [ys, ye], 'r')

        # plt.plot([x1, x2, x3, x4, x1], [y1, y2, y3, y4, y1], 'g')
        # plt.show()

        return [y2, x2, y4, x4]





