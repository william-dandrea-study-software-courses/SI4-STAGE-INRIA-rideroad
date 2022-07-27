import unittest
from unittest import TestCase

from server.safecycle_server.safecycle_itinerary_app.services.ResearchElementsInArea import ResearchElementsInArea
from server.safecycle_server.safecycle_itinerary_app.services.models.LonLat import LonLat


class MyTestCase(unittest.TestCase):

    def test_something(self):
        tst = ResearchElementsInArea(LonLat(5, 3), LonLat(3, 0), rayon=1)

        tst.calculateCoordinatesRectangleBbox()


if __name__ == '__main__':
    unittest.main()


class TestResearchElementsInArea(TestCase):
    def test_calculate_coordinates_rectangle_bbox(self):
        self.fail()
