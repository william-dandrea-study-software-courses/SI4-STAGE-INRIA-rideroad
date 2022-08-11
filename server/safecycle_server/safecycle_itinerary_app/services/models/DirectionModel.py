

"""
{
    "geometry": "oj|hGmwlj@CBAD?F?D@D@DB@B@D?BABC@C@E?G?ECEFIb@_@JIPE",
    "maneuver": {
        "exit": 3,
        "bearing_after": 317,
        "bearing_before": 248,
        "location": [ 7.115587, 43.567916 ],
        "modifier": "left",
        "type": "roundabout turn"
    },
    "mode": "cycling",
    "driving_side": "right",
    "name": "Avenue Georges Gallice",
    "intersections": [],
    "weight": 25.2,
    "duration": 25.2,
    "distance": 89.9
},
{
    "geometry": "om|hGodlj@F?FARIBATKDE",
    "maneuver": {
        "bearing_after": 170,
        "bearing_before": 240,
        "location": [7.112556, 43.568396],
        "modifier": "left",
        "type": "continue"
    },
    "mode": "cycling",
    "ref": "D 2559",
    "driving_side": "right",
    "name": "Boulevard du Président Wilson",
    "intersections": [],
    "weight": 9.6,
    "duration": 9.6,
    "distance": 39.8
},


"""
from .LonLat import LonLat


class Direction:

    def __init__(self, location: LonLat, modifier: str, type: str, name: str, ref: str, exit: str):
        self.location: LonLat = location
        self.modifier = modifier
        self.type = type
        self.name = name
        self.ref = ref
        self.exit = exit

    def toDict(self):
        return {
            "location": self.location.toDict(),
            "modifier": self.modifier,
            "type": self.type,
            "name": self.name,
            "ref": self.ref,
            "exit": self.exit,
        }






