import json
from typing import List

from django.http import HttpResponse, QueryDict
from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from .services.ContributeAmenities import ContributeAmenities
from .services.ItineraryGeneration import ItineraryGeneration
from .services.MultiCheckPointsItinerary import MultiCheckPointsItinerary
from .services.ResearchAmenitiesBbox import ResearchAmenitiesBbox
from .services.exceptions.BrouterException import BrouterException
from .services.models.TourismEnum import TourismEnum
from .services.models.AmenityEnum import AmenityEnum
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


    # print(departure_longitude, departure_latitude, destination_longitude, destination_latitude, road_type)

    try:
        itinerary = ItineraryGeneration(departure_longitude=departure_longitude, departure_latitude=departure_latitude, destination_longitude=destination_longitude, destination_latitude=destination_latitude, road_type=road_type)
        result = itinerary.search()
        dictResult = [it.toDict() for it in result]
        return HttpResponse(json.dumps(dictResult), status=200)
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
        # print(body)

        departure = LonLat(longitude=body['departure'][0], latitude=body['departure'][1])
        destination = LonLat(longitude=body['destination'][0], latitude=body['destination'][1])
        checkpoints = [ LonLat(longitude=ch[0], latitude=ch[1]) for ch in body['checkpoints'] ]
        roadType = body['road_type']

        multiCheckPoints = MultiCheckPointsItinerary(departure, destination, checkpoints, roadType)
        result = multiCheckPoints.search()

        resultDict = result.toDict()

        return HttpResponse(json.dumps(resultDict))

    return HttpResponse(json.dumps({'message': "Wrong HTTP request"}), status=405)


@csrf_exempt
def get_strategic_points_in_a_bbox(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)

        bottom_left_longitude = body['bottom_left_longitude']
        bottom_left_latitude = body['bottom_left_latitude']
        top_right_longitude = body['top_right_longitude']
        top_right_latitude = body['top_right_latitude']

        amenities = body['amenities']

        try:
            bottom_left_longitude = float(bottom_left_longitude)
            bottom_left_latitude = float(bottom_left_latitude)
            top_right_longitude = float(top_right_longitude)
            top_right_latitude = float(top_right_latitude)
        except:
            return HttpResponse("Cannot parse arguments")

        # amenities: List[AmenityEnum] = [AmenityEnum.DRINKING_WATER, AmenityEnum.RESTAURANT, AmenityEnum.BICYCLE_REPAIR_STATION, AmenityEnum.SHELTER, AmenityEnum.TOILETS]
        # amenities: List[AmenityEnum] = [AmenityEnum.DRINKING_WATER, AmenityEnum.RESTAURANT, AmenityEnum.BICYCLE_REPAIR_STATION, AmenityEnum.SHELTER, AmenityEnum.TOILETS]
        # tourism: List[TourismEnum] = [TourismEnum.CAMP_SITE]

        r = ResearchAmenitiesBbox(bottom_left_longitude = bottom_left_longitude, bottom_left_latitude = bottom_left_latitude, top_right_longitude = top_right_longitude, top_right_latitude = top_right_latitude, amenities=amenities)
        return HttpResponse(json.dumps(r.launch()))


@csrf_exempt
def post_new_drinking_water_amenity(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)

        login = body['login']
        password = body['password']
        access = body['access']
        fee = body['fee']
        longitude = body['longitude']
        latitude = body['latitude']

        try:
            login = str(login)
            password = str(password)
            access = str(access)
            fee = str(fee)
            longitude = float(longitude)
            latitude = float(latitude)
        except:
            return HttpResponse("Cannot parse arguments")

        contributeAmenities = ContributeAmenities()
        result = contributeAmenities.addNewDrinkingWater(longitude, latitude, login, password, access, fee)

        return HttpResponse(json.dumps({"status": "OK"}))


@csrf_exempt
def post_new_repair_station_amenity(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)

        login = body['login']
        password = body['password']
        fee = body['fee']
        attributes = body['attributes']
        longitude = body['longitude']
        latitude = body['latitude']

        try:
            login = str(login)
            password = str(password)
            fee = str(fee)
            attribute_repair = str(attributes["repair"])
            attribute_pump = str(attributes["pump"])
            attribute_tools = str(attributes["tools"])
            longitude = float(longitude)
            latitude = float(latitude)
        except:
            return HttpResponse("Cannot parse arguments")

        contributeAmenities = ContributeAmenities()
        result = contributeAmenities.addNewRepairStation(longitude, latitude,login, password, fee, attribute_repair, attribute_pump, attribute_tools)

        return HttpResponse(json.dumps({"status": "OK"}))

@csrf_exempt
def post_new_shelter_amenity(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)

        login = body['login']
        password = body['password']
        bench = body['bench']
        bin = body['bin']
        longitude = body['longitude']
        latitude = body['latitude']


        try:
            login = str(login)
            password = str(password)
            bench = str(bench)
            bin = str(bin)
            longitude = float(longitude)
            latitude = float(latitude)
        except:
            return HttpResponse("Cannot parse arguments")

        contributeAmenities = ContributeAmenities()
        result = contributeAmenities.addNewShelter(longitude, latitude,login, password, bench, bin)


        return HttpResponse(json.dumps({"status": "OK"}))

@csrf_exempt
def post_new_toilets_amenity(request):

    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)

        login = body['login']
        password = body['password']
        disposal = body['disposal']
        access = body['access']
        gender = body['gender']
        longitude = body['longitude']
        latitude = body['latitude']


        try:
            login = str(login)
            password = str(password)
            disposal = str(disposal)
            access = str(access)
            gender = str(gender)
            longitude = float(longitude)
            latitude = float(latitude)
        except:
            return HttpResponse("Cannot parse arguments")

        contributeAmenities = ContributeAmenities()
        result = contributeAmenities.addNewToilets(longitude, latitude, login, password, disposal, access, gender)

        return HttpResponse(json.dumps({"status": "OK"}))
