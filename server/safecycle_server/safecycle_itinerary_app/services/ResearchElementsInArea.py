from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass
import numpy as np
import matplotlib.pyplot as plt

from .models.AmenityEnum import AmenityEnum
from .models.LonLat import LonLat

"""
    - Points d'eau  =>  selector='"amenity"="drinking_water"'
    - Campings      =>  

"""

class ResearchElementsInArea:

    """
        - Liste de segments autour dequels on va chercher des trucs
        - Rayon autour duquel on va chercher des lieus
        - List de tout les lieux (AmenityEnum) que l'on va chercher
    """

    def __init__(self, x1, y1, x2, y2, rayon: float):
        # query = overpassQueryBuilder(bbox=[48.27, 16.47, 48.3, 16.5], elementType='node', selector=[f'"amenity"="{AmenityEnum.DRINKING_WATER}"'], out='body')
        # overpass = Overpass()
        # busStops = overpass.query(query)
        # print(busStops.toJSON())

        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.__rayon = rayon



    def calculateCoordinatesRectangleBbox(self):
        xs = self.x1
        xe = self.x2
        ys = self.y1
        ye = self.y2

        alpha = np.arctan((ye - ys) / (xe - xs))

        xsP = xs + self.__rayon * np.cos(np.pi - alpha)
        ysP = ys - self.__rayon * np.sin(np.pi - alpha)

        xeP = xe - self.__rayon * np.cos(np.pi - alpha)
        yeP = ye + self.__rayon * np.sin(np.pi - alpha)


        L = np.sqrt(np.square(xeP - xsP) + np.square(yeP - ysP))
        print(L)

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

        plt.plot([xsP, xeP], [ysP, yeP], 'b')
        plt.plot([xs, xe], [ys, ye], 'r')

        plt.plot([x1, x2, x3, x4, x1], [y1, y2, y3, y4, y1], 'g')




        plt.show()





