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

        alphaPrime = np.arctan((ye - ys) / (xe - xs))
        alpha = (np.pi / 2) + alphaPrime

        xsP = xs + self.__rayon * np.cos(np.pi - alphaPrime)
        ysP = ys - self.__rayon * np.sin(np.pi - alphaPrime)

        xeP = xe - self.__rayon * np.cos(np.pi - alphaPrime)
        yeP = ye + self.__rayon * np.sin(np.pi - alphaPrime)


        L = np.sqrt(np.square(xeP - xsP) + np.square(yeP - ysP))
        print(L)

        """
        Y
        |
        |                 (x1,y1) --------------------------- (x2,y2)
        |                    |                                   |
        |                    |                                   |
        |     ---------- (xsP,ysP) ------------------------- (xeP,yeP) ----------
        |                    |                                   |
        |                    |                                   |
        |                 (x4,y4) --------------------------- (x3,y3)
        |           
        ---------------------------------------------------------------------> X
        
        """

        x1NoRotateRectangle = xsP
        y1NoRotateRectangle = ysP + self.__rayon
        x4NoRotateRectangle = xsP
        y4NoRotateRectangle = ysP - self.__rayon

        x2NoRotateRectangle = xsP + L
        y2NoRotateRectangle = ysP + self.__rayon
        x3NoRotateRectangle = xsP + L
        y3NoRotateRectangle = ysP - self.__rayon

        xCenterLine = (xsP + xeP) / 2
        yCenterLine = (ysP + yeP) / 2


        x1 = xCenterLine + (x1NoRotateRectangle - xCenterLine) * np.cos(alphaPrime) + (yCenterLine - y1NoRotateRectangle) * np.sin(alphaPrime)
        y1 = yCenterLine - (x1NoRotateRectangle - xCenterLine) * np.sin(alphaPrime) + (yCenterLine - y1NoRotateRectangle) * np.cos(alphaPrime)

        x2 = xCenterLine + (x2NoRotateRectangle - xCenterLine) * np.cos(alphaPrime) + (
                    yCenterLine - y2NoRotateRectangle) * np.sin(alphaPrime)
        y2 = yCenterLine - (x2NoRotateRectangle - xCenterLine) * np.sin(alphaPrime) + (
                    yCenterLine - y2NoRotateRectangle) * np.cos(alphaPrime)

        x3 = xCenterLine + (x3NoRotateRectangle - xCenterLine) * np.cos(alphaPrime) + (
                    yCenterLine - y3NoRotateRectangle) * np.sin(alphaPrime)
        y3 = yCenterLine - (x3NoRotateRectangle - xCenterLine) * np.sin(alphaPrime) + (
                    yCenterLine - y3NoRotateRectangle) * np.cos(alphaPrime)

        x4 = xCenterLine + (x4NoRotateRectangle - xCenterLine) * np.cos(alphaPrime) + (
                    yCenterLine - y4NoRotateRectangle) * np.sin(alphaPrime)
        y4 = yCenterLine - (x4NoRotateRectangle - xCenterLine) * np.sin(alphaPrime) + (
                    yCenterLine - y4NoRotateRectangle) * np.cos(alphaPrime)

        plt.plot([xsP, xeP], [ysP, yeP], 'b')
        plt.plot([xs, xe], [ys, ye], 'r')


        plt.plot([x1NoRotateRectangle, x2NoRotateRectangle, x3NoRotateRectangle, x4NoRotateRectangle, x1NoRotateRectangle], [y1NoRotateRectangle, y2NoRotateRectangle, y3NoRotateRectangle, y4NoRotateRectangle, y1NoRotateRectangle], 'y')
        plt.plot([x1, x2, x3, x4, x1], [y1, y2, y3, y4, y1], 'g')




        plt.show()





