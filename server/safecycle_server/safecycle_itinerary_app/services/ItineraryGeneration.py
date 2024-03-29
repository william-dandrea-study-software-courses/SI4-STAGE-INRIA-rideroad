from django_thread import ThreadPoolExecutor

import requests
import logging
import utils

from .DirectionInfosGenerator import DirectionInfosGenerator
from .exceptions.BrouterException import BrouterException
from .models import RoadTypeEnum
from .models.Coord import Coord
from .models.DirectionModel import OSMRResponse
from .models.Itinerary import Itinerary
from .models.Path import Path
from .config import Config

logger = logging.getLogger(__name__)


class ItineraryGeneration:

    def __init__(self, departure_longitude: float, departure_latitude: float, destination_longitude: float, destination_latitude: float, road_type: RoadTypeEnum):

        self.__departure_longitude: float = departure_longitude
        self.__departure_latitude: float = departure_latitude
        self.__destination_longitude: float = destination_longitude
        self.__destination_latitude: float = destination_latitude
        self.__road_type: RoadTypeEnum = road_type


    def search(self):

        def process_fn(profile_variante_array):
            profile=profile_variante_array[0]
            variante=profile_variante_array[1]
            alternative = self.berouter_request(profile, variante)
            return self.__analyse_brouter_request(alternative, variante)

        profile: str = ""

        if self.__road_type == 1:  # Road
            profile = "fastbike"

        if self.__road_type == 2:  # Dirt
            profile = "hiking-mountain"

        if self.__road_type == 3:  # Bike Path
            profile = "trekking"

        if self.__road_type == 4:  # Safety Path from Raphael Jolivet
            #profile = "safety"
            utils.post_profile("safe")
            profile = utils.profile_fullname("safe")
        

        executor = ThreadPoolExecutor()

        itinerarys = []
        for i in [0,1,2,3]:
            future = executor.submit(process_fn, [profile, i])
            itinerarys.append(future)

        itinerarys = [f.result() for f in itinerarys]

        return itinerarys

    def berouter_request(self, profile: str, alternative: int):
        url = Config.BROUTER_BASE_URL
        url += f'format=geojson' + '&'
        url += f'profile={profile}' + '&'
        url += f'lonlats={self.__departure_longitude},{self.__departure_latitude}|{self.__destination_longitude},{self.__destination_latitude}' + '&'
        url += f'alternativeidx={alternative}'


        request_manager = requests.get(url, timeout=10)

        if request_manager.status_code == 200:
            logger.info("Request worked")
            return request_manager.json()

        logger.error(f"Request {url} failed")
        raise BrouterException()



    def __analyse_brouter_request(self, request_json, variante):

        if request_json == None:
            logger.error(f"Cannot analyse a None Request")
            return

        features = request_json["features"][0]
        props = features["properties"]
        messages = props["messages"]
        coordinates = features["geometry"]["coordinates"]
        header = messages.pop(0)
        messages = list(dict((k, v) for k, v in zip(header, message)) for message in messages)

        time = int(props["total-time"])
        cost = int(props["cost"])
        length = int(props["track-length"])
        filtered_ascend = int(props["filtered ascend"])

        iti = Itinerary(time, length, cost, filtered_ascend, variante)
        print(variante)

        def new_path():
            path = Path()
            iti.paths.append(path)
            return path

        current_path = new_path()
        messages_iteration = iter(messages)
        current_message = next(messages_iteration)


        for index_initial_coordinate, initial_coordinate in enumerate(coordinates):

            longitude_from_initial_coordinate: float = initial_coordinate[0]
            latitude_from_initial_coordinate: float = initial_coordinate[1]
            height_from_initial_coordinate: float = initial_coordinate[2] if len(initial_coordinate) == 3 else None

            coordinate = Coord(longitude_from_initial_coordinate, latitude_from_initial_coordinate, height_from_initial_coordinate)
            current_path.addNewCoordinateToPath(coordinate)
            iti.altitude_profil.append(height_from_initial_coordinate)

            # Because a path is a combinaison of several coordinates (named 'coordinates' in the json), we need to watch
            # when we want to close this path. The moment when we close this path is when the coordinates of a message
            # (named 'message' in the json) are the same as a coordinate.
            longitude_str = str(int(coordinate.lon * 1000000))
            latitude_str = str(int(coordinate.lat * 1000000))

            if current_message is not None and longitude_str == current_message['Longitude'] and latitude_str == current_message['Latitude']:
                # We can close the path and start a new one

                current_path.generateTags(current_message['WayTags'])
                current_path.setLength(current_message['Distance'])

                for key, name in dict(CostPerKm="per_km", ElevCost="elevation", TurnCost="turn", NodeCost="node", InitialCost="initial").items():
                    current_path.costs[name] = float(current_message[key])


                try:
                    current_message = next(messages_iteration)
                    current_path = new_path()
                    current_path.coords.append(coordinate)
                except StopIteration:
                    if index_initial_coordinate < len(coordinates) - 1:
                        logger.error("There was still coordinates!")
                    break

        self.generateDirections(iti)
        return iti



    def generateDirections(self, itinerary: Itinerary):

        firstCoord = itinerary.paths[0].getFirstCoord()
        lastCoord = itinerary.paths[-1].getLastCoord()
        checkpoints = [coor.getLastCoord() for coor in itinerary.paths[:-1]]

        directionInfosGenerator = DirectionInfosGenerator(firstCoord, lastCoord, checkpoints)
        directions_response: OSMRResponse = directionInfosGenerator.getDirections(removeDepartAndDestination=False)
        direction_legs = directions_response.routes[0].legs

        for index, path in enumerate(itinerary.paths):
            steps = direction_legs[index].steps
            path.setDirectionInfos(steps)

