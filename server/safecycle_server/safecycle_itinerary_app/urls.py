

from django.urls import path
from . import views

urlpatterns = [
    path('hello', views.say_hello, name="hello"),
    path('test-itinerary', views.get_test_itinerary, name="test-itinerary"),
    path('itinerary', views.get_itinerary, name="itinerary"),
    path('checkpoints-itinerary', views.get_itinerary_with_checkpoints, name="checkpoints-itinerary"),

]