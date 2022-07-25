from OSMPythonTools.overpass import overpassQueryBuilder
from OSMPythonTools.overpass import Overpass

"""
    - Points d'eau  =>  selector='"amenity"="drinking_water"'
    - Campings      =>  

"""

class ResearchElementsInArea:

    def __init__(self):
        query = overpassQueryBuilder(bbox=[48.27, 16.47, 48.3, 16.5], elementType='node', selector='"amenity"="drinking_water"', out='body')

        overpass = Overpass()
        busStops = overpass.query(query)

        print(busStops.toJSON())