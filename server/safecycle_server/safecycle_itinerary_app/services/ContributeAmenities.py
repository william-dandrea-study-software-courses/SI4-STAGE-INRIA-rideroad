
import osmapi

class ContributeAmenities:

    URL_API: str = "https://master.apis.dev.openstreetmap.org"

    def __init__(self):
        pass

    def addNewDrinkingWater(self, longitude: float, latitude: float, login: str, password: str, access: str, fee: str):
        api = osmapi.OsmApi(username=login, password=password, api=self.URL_API)

        api.ChangesetCreate({"comment": login + " modification"})
        creationResult = api.NodeCreate({"lon": longitude, "lat": latitude, "tag": {
            "amenity": "drinking_water",
            "access": access,
            "fee": fee,
        }})
        print(creationResult)
        api.ChangesetClose()

    def addNewRepairStation(self, longitude: float, latitude: float, login: str, password: str, fee: str, attribute_repair: str, attribute_pump: str, attribute_tools: str):
        api = osmapi.OsmApi(username=login, password=password, api=self.URL_API)

        api.ChangesetCreate({"comment": login + " modification"})
        creationResult = api.NodeCreate({"lon": longitude, "lat": latitude, "tag": {
            "amenity": "bicycle_repair_station",
            "service:bicycle:repair": attribute_repair,
            "service:bicycle:pump": attribute_pump,
            "service:bicycle:tools": attribute_tools,
            "fee": fee,
        }})
        print(creationResult)
        api.ChangesetClose()

    def addNewShelter(self, longitude: float, latitude: float, login: str, password: str, bench: str, bin_v: str):
        api = osmapi.OsmApi(username=login, password=password, api=self.URL_API)

        api.ChangesetCreate({"comment": login + " modification"})
        creationResult = api.NodeCreate({"lon": longitude, "lat": latitude, "tag": {
            "amenity": "shelter",
            "bench": bench,
            "bin": bin_v,
        }})
        print(creationResult)
        api.ChangesetClose()

    def addNewToilets(self, longitude: float, latitude: float, login: str, password: str, disposal: str, access: str, gender: str ):
        api = osmapi.OsmApi(username=login, password=password, api=self.URL_API)

        api.ChangesetCreate({"comment": login + " modification"})
        creationResult = api.NodeCreate({"lon": longitude, "lat": latitude, "tag": {
            "amenity": "toilets",
            "disposal": disposal,
            "access": access,
            "gender": gender,
        }})
        print(creationResult)
        api.ChangesetClose()