from typing import List

from .models.AmenityEnum import AmenityEnum
from .models.TourismEnum import TourismEnum


def query_builder_bbox(bbox: List[float], amenitySelectors: List[AmenityEnum], tourismSelectors: List[TourismEnum]):
    result = ''
    bbox_string = f'({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]})'

    for amenity in amenitySelectors:
        result += f'node["amenity"="{amenity}"]{bbox_string};'

    for tourism in tourismSelectors:
        result += f'node["tourism"="{tourism}"]{bbox_string};'

    return f'({result});out body;'

