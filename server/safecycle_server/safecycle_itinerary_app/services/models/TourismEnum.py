from enum import Enum

# https://wiki.openstreetmap.org/wiki/Key:tourism
class TourismEnum(str, Enum):

    ALPINE_HUT = "alpine_hut"
    APARTMENT = "apartment"
    CHALET = "chalet"
    AQUARIUM = "aquarium"
    ARTWORK = "artwork"
    ATTRACTION = "attraction"
    CAMP_PITCH = "camp_pitch"
    CARAVAN_SITE = "caravan_site"
    CAMP_SITE = "camp_site"
    GALLERY = "gallery"
    MUSEUM = "museum"
    GUEST_HOUSE = "guest_house"
    HOSTEL = "hostel"
    HOTEL = "hotel"
    INFORMATION = "information"
    MOTEL = "motel"
    PICNIC_SITE = "picnic_site"
    THEME_PARK = "theme_park"
    VIEWPOINT = "viewpoint"
    WILDERNESS_HUT = "wilderness_hut"
    ZOO = "zoo"

