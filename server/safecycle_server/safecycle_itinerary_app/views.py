import json

from django.http import HttpResponse, QueryDict
from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from .services.ItineraryGeneration import ItineraryGeneration
from .services.MultiCheckPointsItinerary import MultiCheckPointsItinerary
from .services.exceptions.BrouterException import BrouterException
from .services.models.LonLat import LonLat


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

    try:
        itinerary = ItineraryGeneration(departure_longitude=departure_longitude, departure_latitude=departure_latitude, destination_longitude=destination_longitude, destination_latitude=destination_latitude, road_type=road_type)
        result = itinerary.search()
        return HttpResponse(json.dumps(result), status=200)
    except BrouterException:
        return HttpResponse(json.dumps({'message': "Cannot find coordonates in the map"}), status=416)
    except:
        return HttpResponse(json.dumps({'message': "Error during processing"}), status=424)




def get_test_itinerary(request):
    itinerary = ItineraryGeneration(departure_longitude=-1.762642, departure_latitude=43.373684,
                                    destination_longitude=1.62221,
                                    destination_latitude=43.389117, road_type=1)


    result = itinerary.berouter_request('trekking', 1)
    return HttpResponse(result)


@csrf_exempt
def get_itinerary_with_checkpoints(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)

        departure = LonLat(longitude=body['departure'][0], latitude=body['departure'][1])
        destination = LonLat(longitude=body['destination'][0], latitude=body['destination'][1])
        checkpoints = [ LonLat(longitude=ch[0], latitude=ch[1]) for ch in body['checkpoints'] ]
        roadType = body['road_type']

        multiCheckPoints = MultiCheckPointsItinerary(departure, destination, checkpoints, roadType)
        result = multiCheckPoints.search()

        return HttpResponse(json.dumps(result.toDict()))


    return HttpResponse(json.dumps({'message': "Wrong HTTP request"}), status=405)

