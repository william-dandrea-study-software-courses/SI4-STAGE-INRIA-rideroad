import unittest

from server.safecycle_server.safecycle_itinerary_app.services.ContributeAmenities import ContributeAmenities


class MyTestCase(unittest.TestCase):
    def test_something(self):
        contributeAmenities = ContributeAmenities()
        contributeAmenities.addNewWaterPoint()


if __name__ == '__main__':
    unittest.main()
