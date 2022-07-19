import json
from unittest import TestCase

from django.conf import settings

from server.safecycle_server.safecycle_itinerary_app.services.MultiCheckPointsItinerary import MultiCheckPointsItinerary
from server.safecycle_server.safecycle_itinerary_app.services.models.LonLat import LonLat


class TestMultiCheckPointsItinerary(TestCase):



    def test_search(self):
        settings.configure()

        start = LonLat(7.079221, 48.854269)         # POSTROFF
        end = LonLat(7.0557352, 48.734239)          # SARREBOURG
        checkPoints = [
            LonLat(7.0196953, 48.8483309),          # FENETRANGE
            LonLat(6.9405345, 48.8618967),          # MITTERSHEIM
        ]

        multiCheckPoints = MultiCheckPointsItinerary(start, end, checkPoints, 3)
        # print(json.dumps(multiCheckPoints.search()))
        print(multiCheckPoints.search())
        # multiCheckPoints.search()
