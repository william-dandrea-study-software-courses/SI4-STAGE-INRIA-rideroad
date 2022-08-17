from typing import List

from .LonLat import LonLat

class IntersectionOSMR:
    def __init__(self, out: int, entry: List[bool], bearings: List[int], location: LonLat, inV: int):
        self.out: int = out
        self.entry: List[bool] = entry
        self.bearings: List[int] = bearings
        self.location: LonLat = location
        self.inV: int = inV     # Possibly null

    def toDict(self):
        return {
            "out": self.out,
            "entry": self.entry,
            "bearings": self.bearings,
            "location": self.location.toDict(),
            "in": self.inV,
        }


class ManeuverOSMR:
    def __init__(self, bearing_after: int, bearing_before: int, location: LonLat, type: str, modifier: str, exit: int):
        self.bearing_after: int = bearing_after
        self.bearing_before: int = bearing_before
        self.location: LonLat = location
        self.type: str = type
        self.modifier: str = modifier
        self.exit: int = exit   # Possibly null

    def toDict(self):
        return {
            "bearing_after": self.bearing_after,
            "bearing_before": self.bearing_before,
            "location": self.location.toDict(),
            "type": self.type,
            "modifier": self.modifier,
            "exit": self.exit,
        }

class StepOSMR:
    def __init__(self, geometry:  str, maneuver:  ManeuverOSMR, mode:  str, driving_side:  str, name:  str, intersections:  List, weight:  float, duration:  float, distance:  float, ref:  str, rotary_name:  str, ):
        self.geometry: str = geometry
        self.maneuver: ManeuverOSMR = maneuver
        self.mode: str = mode
        self.driving_side: str = driving_side
        self.name: str = name
        self.intersections: List[IntersectionOSMR] = intersections
        self.weight: float = weight
        self.duration: float = duration
        self.distance: float = distance
        self.ref: str = ref
        self.rotary_name: str = rotary_name

    def toDict(self):
        return {
            "geometry": self.geometry,
            "maneuver": self.maneuver.toDict(),
            "mode": self.mode,
            "driving_side": self.driving_side,
            "name": self.name,
            "intersections": [v.toDict() for v in self.intersections],
            "weight": self.weight,
            "duration": self.duration,
            "distance": self.distance,
            "ref": self.ref,
            "rotary_name": self.rotary_name,
        }

class LegOSMR:
    def __init__(self, steps: List[StepOSMR], summary: str, weight: float, duration: float, distance: float):
        self.steps: List[StepOSMR] = steps
        self.summary: str = summary
        self.weight: float = weight
        self.duration: float = duration
        self.distance: float = distance

    def toDict(self):
        return {
            "steps": [v.toDict() for v in self.steps],
            "summary": self.summary,
            "weight": self.weight,
            "duration": self.duration,
            "distance": self.distance,
        }

class RouteOSMR:

    def __init__(self, legs: List[LegOSMR], weight_name: str, weight: float, duration: float, distance: float):

        self.legs: List[LegOSMR] = legs
        self.weight_name: str = weight_name
        self.weight: float = weight
        self.duration: float = duration
        self.distance: float = distance

    def toDict(self):
        return {
            "legs": [leg.toDict() for leg in self.legs],
            "weight_name": self.weight_name,
            "weight": self.weight,
            "duration": self.duration,
            "distance": self.distance,
        }


class WaypointOSMR:

    def __init__(self, hint: str, distance: int, name: str, location: LonLat):
        self.hint: str = hint
        self.distance: int = distance
        self.name: str = name
        self.location: LonLat = location

    def toDict(self):
        return {
            "hint": self.hint,
            "distance": self.distance,
            "name": self.name,
            "location": self.location.toDict(),
        }


class OSMRResponse:
    def __init__(self, code: str, routes: List[RouteOSMR], waypoints: List[WaypointOSMR]):
        self.code: str = code
        self.routes: List[RouteOSMR] = routes
        self.waypoints: List[WaypointOSMR] = waypoints

    def toDict(self):
        return {
            "code": self.code,
            "routes": self.routes,
            "waypoints": self.waypoints,
        }


class OSMRDeserializer:

    @staticmethod
    def deserialize(json) -> OSMRResponse:

        code__response: str = json.get("code")
        routes__response = json.get("routes")
        waypoints__response = json.get("waypoints")

        waypoints: List[WaypointOSMR] = []
        for waypoint in waypoints__response:
            hint__waypoint: str = waypoint.get("hint")
            distance__waypoint: int = waypoint.get("distance")
            name__waypoint: str = waypoint.get("name")
            location__waypoint: LonLat = LonLat(waypoint.get("location")[0], waypoint.get("location")[1])
            waypoints.append(WaypointOSMR(hint__waypoint, distance__waypoint, name__waypoint, location__waypoint))

        routes: List[RouteOSMR] = []
        for route in routes__response:
            weight_name__route: str = route.get("weight_name")
            weight__route: float = route.get("weight")
            duration__route: float = route.get("duration")
            distance__route: float = route.get("distance")

            legs: List[LegOSMR] = []
            legs__route = route.get("legs")
            for leg in legs__route:
                summary__leg: str = leg.get("summary")
                weight__leg: float = leg.get("weight")
                duration__leg: float = leg.get("duration")
                distance__leg: float = leg.get("distance")

                steps: List[StepOSMR] = []
                steps__leg = leg.get("steps")
                for step in steps__leg:
                    geometry__step: str = step.get("geometry")
                    mode__step: str = step.get("mode")
                    driving_side__step: str = step.get("driving_side")
                    name__step: str = step.get("name")
                    weight__step: float = step.get("weight")
                    duration__step: float = step.get("duration")
                    distance__step: float = step.get("distance")
                    ref__step: str = step.get("ref")
                    rotary_name__step: str = step.get("rotary_name")

                    # step.get("maneuver")
                    bearing_after__maneuver = step.get("maneuver").get("bearing_after")
                    bearing_before__maneuver = step.get("maneuver").get("bearing_before")
                    location__maneuver: LonLat = LonLat(step.get("maneuver").get("location")[0], step.get("maneuver").get("location")[1])
                    type__maneuver = step.get("maneuver").get("type")
                    modifier__maneuver = step.get("maneuver").get("modifier")
                    exit__maneuver = step.get("maneuver").get("exit")
                    maneuver__step = ManeuverOSMR(bearing_after__maneuver, bearing_before__maneuver, location__maneuver, type__maneuver, modifier__maneuver, exit__maneuver)

                    intersections: List[IntersectionOSMR] = []
                    intersections__step = step.get("intersections")
                    for intersection in intersections__step:
                        out__intersection: int = intersection.get("out")
                        entry__intersection: List[bool] = intersection.get("entry")
                        bearings__intersection: List[int] = intersection.get("bearings")
                        location__intersection: LonLat = LonLat(intersection.get("location")[0], intersection.get("location")[1])
                        inV__intersection: int = intersection.get("in")

                        intersections.append(IntersectionOSMR(out__intersection, entry__intersection, bearings__intersection, location__intersection, inV__intersection))

                    steps.append(StepOSMR(geometry__step, maneuver__step, mode__step, driving_side__step, name__step, intersections, weight__step, duration__step, distance__step, ref__step, rotary_name__step))

                legs.append(LegOSMR(steps, summary__leg, weight__leg, duration__leg, distance__leg))

            routes.append(RouteOSMR(legs, weight_name__route, weight__route, duration__route, distance__route))


        return OSMRResponse(code__response, routes, waypoints)

