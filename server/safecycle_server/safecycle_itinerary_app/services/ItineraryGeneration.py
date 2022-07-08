from server.safecycle_server.safecycle_itinerary_app.services.models import RoadTypeEnum


class ItineraryGeneration:

    def __init__(self, departure_longitude: float, departure_latitude: float, destination_longitude: float, destination_latitude: float, road_type: RoadTypeEnum):

        self.__departure_longitude: float = departure_longitude
        self.__departure_latitude: float = departure_latitude
        self.__destination_longitude: float = destination_longitude
        self.__destination_latitude: float = destination_latitude
        self.__road_type: RoadTypeEnum = road_type

