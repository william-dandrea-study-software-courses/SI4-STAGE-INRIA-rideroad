from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass

from server.safecycle_server.safecycle_itinerary_app.services.models.AmenityEnum import AmenityEnum

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

    def __init__(self):
        query = overpassQueryBuilder(bbox=[48.27, 16.47, 48.3, 16.5], elementType='node', selector=[f'"amenity"="{AmenityEnum.DRINKING_WATER}"'], out='body')

        overpass = Overpass()
        busStops = overpass.query(query)

        print(busStops.toJSON())



