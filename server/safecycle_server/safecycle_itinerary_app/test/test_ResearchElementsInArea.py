import unittest
from unittest import TestCase

from server.safecycle_server.safecycle_itinerary_app.services import utils
from server.safecycle_server.safecycle_itinerary_app.services.ResearchElementsInArea import ResearchElementsInArea
from server.safecycle_server.safecycle_itinerary_app.services.models.AmenityEnum import AmenityEnum
from server.safecycle_server.safecycle_itinerary_app.services.models.Coord import Coord
from server.safecycle_server.safecycle_itinerary_app.services.models.LonLat import LonLat


class MyTestCase(unittest.TestCase):

    def test_something(self):
        departure_longitude = 7.079136
        departure_latitude = 48.854263
        destination_longitude = 7.079381
        destination_latitude = 48.850808

        # {'lat': 48.854263, 'lon': 7.079136, 'elevation': 271.0}
        # {'lat': 48.850808, 'lon': 7.079381, 'elevation': 272.75}

        # tst = ResearchElementsInArea(Coord(lon=departure_longitude, lat=departure_latitude), Coord(lon=destination_longitude, lat=destination_latitude), radius=1)

        tst = ResearchElementsInArea(path = [], radius = 1.0, amenities = [])
        tst.launch()


    def test_generateNodes(self):
        r = ResearchElementsInArea(path = [], radius = 1.0, amenities = [])
        self.assertTrue(len(r.generateAmenity()) == 0)

        r = ResearchElementsInArea(path=[Coord(lat=43.550554, lon=7.011957), Coord(lat=43.601460, lon=6.995536), Coord(lat=43.580754, lon=7.110275)], radius=1.0, amenities=[AmenityEnum.ATM, AmenityEnum.BENCH])
        self.assertEqual(r.generateAmenity(), ['["amenity"="atm"]', '["amenity"="bench"]'])


        print(r.generateAmenity())

    def test_generatePath(self):
        r = ResearchElementsInArea(path=[Coord(lat=43.550554, lon=7.011957), Coord(lat=43.601460, lon=6.995536), Coord(lat=43.580754, lon=7.110275)], radius=1.0, amenities=[AmenityEnum.ATM, AmenityEnum.BENCH])
        print(r.generatePath())

    def test_generateUrl(self):
        r = ResearchElementsInArea(path=[Coord(lat=43.550554, lon=7.011957), Coord(lat=43.601460, lon=6.995536),
                                         Coord(lat=43.580754, lon=7.110275)], radius=1.0,
                                   amenities=[AmenityEnum.BENCH, AmenityEnum.ATM])
        print(r.generateUrl())

    def test_launch(self):
        r = ResearchElementsInArea(path=[Coord(lat=43.550554, lon=7.011957), Coord(lat=43.601460, lon=6.995536),
                                         Coord(lat=43.580754, lon=7.110275), Coord(lat=43.657846, lon=7.169487)], radius=100.0,
                                   amenities=[AmenityEnum.BENCH, AmenityEnum.ATM])
        print(r.launch())


if __name__ == '__main__':
    unittest.main()


class TestResearchElementsInArea(TestCase):
    def test_calculate_coordinates_rectangle_bbox(self):
        self.fail()

"""

Generated : 
(node["amenity"="bench"](around:1.0,43.550554,7.011957,43.60146,6.995536,43.580754,7.110275);node["amenity"="atm"](around:1.0,43.550554,7.011957,43.60146,6.995536,43.580754,7.110275);); out;


Worked : 
(node["amenity"="bench"](around:100.0, 43.550554, 7.011957, 43.601460,6.995536, 43.580754,7.110275, 43.657846,7.169487);node["amenity"="atm"](around:100.0, 43.550554, 7.011957, 43.601460,6.995536, 43.580754,7.110275, 43.657846,7.169487);); out;

"""

