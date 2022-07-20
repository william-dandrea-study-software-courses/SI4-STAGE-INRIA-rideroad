

class LonLat:

    def __init__(self, longitude: float, latitude: float):
        self.longitude = longitude
        self.latitude = latitude




    def toDict(self):
        return {
            "lon": self.longitude,
            "lat": self.latitude,
        }