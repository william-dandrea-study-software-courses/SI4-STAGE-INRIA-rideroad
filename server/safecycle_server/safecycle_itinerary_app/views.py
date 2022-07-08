from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def say_hello(request):
    return HttpResponse("Hello")


# http://127.0.0.1:8000/api/itinerary?departure_longitude=1&departure_latitude=2&destination_longitude=3&destination_latitude=4&road_type=salut
def get_itinerary(request):

    departure_longitude = request.GET.get('departure_longitude')
    departure_latitude = request.GET.get('departure_latitude')
    destination_longitude = request.GET.get('destination_longitude')
    destination_latitude = request.GET.get('destination_latitude')
    road_type = request.GET.get('road_type')

    try:
        departure_longitude = float(departure_longitude)
        departure_latitude = float(departure_latitude)
        destination_longitude = float(destination_longitude)
        destination_latitude = float(destination_latitude)
        road_type = int(road_type)
    except:
        return HttpResponse("Cannot parse arguments")


    print(departure_longitude, departure_latitude, destination_longitude, destination_latitude, road_type)


    return HttpResponse("Itinerary")
