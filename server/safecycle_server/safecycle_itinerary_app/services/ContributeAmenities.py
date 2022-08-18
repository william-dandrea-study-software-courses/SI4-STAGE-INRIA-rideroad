
import osmapi

class ContributeAmenities:

    def __init__(self):
        pass

    def addNewDrinkingWater(self, longitude: float, latitude: float, login: str, password: str, access: str, fee: str):
        api = osmapi.OsmApi(username=login, password=password)

    def addNewRepairStation(self, longitude: float, latitude: float, login: str, password: str, fee: str, attribute_repair: str, attribute_pump: str, attribute_tools: str):
        api = osmapi.OsmApi(username=login, password=password)

    def addNewShelter(self, longitude: float, latitude: float, login: str, password: str, bench: str, bin: str):
        api = osmapi.OsmApi(username=login, password=password)

    def addNewToilets(self, longitude: float, latitude: float, login: str, password: str, disposal: str, access: str, gender: str ):
        api = osmapi.OsmApi(username=login, password=password)