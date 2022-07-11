


class Coord:


    def __init__(self, lon : float, lat : float, elevation : float=None):
        self.lat = lat
        self.lon = lon
        self.elevation = elevation


    def toDict(self):
        return {
            "lat": self.lat,
            "lon": self.lon,
            "elevation": self.elevation,
        }