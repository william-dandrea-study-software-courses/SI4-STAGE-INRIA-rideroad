

from django.urls import path
from . import views

urlpatterns = [
    path('hello', views.say_hello, name="hello"),
    path('test-itinerary', views.get_test_itinerary, name="test-itinerary"),
    path('itinerary', views.get_itinerary, name="itinerary"),
    path('checkpoints-itinerary', views.get_itinerary_with_checkpoints, name="checkpoints-itinerary"),
    path('amenitities-bbox', views.get_strategic_points_in_a_bbox, name="amenitities-bbox"),
    path('new-toilet-amenity', views.post_new_toilets_amenity, name="new-toilet-amenity"),
    path('new-shelter-amenity', views.post_new_shelter_amenity, name="new-shelter-amenity"),
    path('new-repair-station-amenity', views.post_new_repair_station_amenity, name="new-repair-station-amenity"),
    path('new-drinking-water-amenity', views.post_new_drinking_water_amenity, name="new-drinking-water-amenity"),
]