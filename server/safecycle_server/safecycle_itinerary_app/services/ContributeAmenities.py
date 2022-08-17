
import osmapi

class ContributeAmenities:

    def __init__(self):
        self.api = osmapi.OsmApi(username="william.dandrea@hotmail.com", password="")

    def addNewWaterPoint(self):
        print(self.api.NodeGet(123))