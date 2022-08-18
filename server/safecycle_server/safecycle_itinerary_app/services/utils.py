from typing import List



from .models.AmenityEnum import AmenityEnum
from .models.TourismEnum import TourismEnum


from hashlib import md5
from ..config import Config
import requests
import re


ONE_DEGREE_LATITUDE_IN_METER = 1.0 / 111320.0
ONE_DEGREE_LONGITUDE_IN_METER = 1.0 / 111320.0


def query_builder_bbox(bbox: List[float], amenitySelectors: List[AmenityEnum], tourismSelectors: List[TourismEnum]):    
    result = ''
    bbox_string = f'({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]})'

    for amenity in amenitySelectors:
        result += f'node["amenity"="{amenity}"]{bbox_string};'

    for tourism in tourismSelectors:
        result += f'node["tourism"="{tourism}"]{bbox_string};'

    return f'({result});out body;'









# from Raphael Jolivet


MAX_DISTANCE = 10

EQUAL="equal"
BETTER="better"
WORSE="worse"

PARAM_PATTERN=r"^\s*assign\s+(\w+)\s*=\s*(\S+)\s*(#\s*%(\w+)%.*)$"

class HttpError(Exception) :

    def __init__(self, url, status, text) :
        self.status = status
        Exception.__init__(self, "Http error %d on '%s' :\n%s" % (status, url, text))

def debug(*args, **kwargs):
    if Config.IS_DEV == True:
        if kwargs :
            for key, val in kwargs.items():
                args += "%s=%s" % (key, str(val)),

        print(*args)

def md5_hash(val) :
    return md5(val.encode("utf8")).hexdigest()

def valStr(val) :
    if isinstance(val, bool) :
        return "true" if val else "false"
    return str(val)

def profile_fullname(profile_name, **params) :
    if profile_name in Config.DEFAULT_PROFILES:
        profile = render_profile(profile_name, **params)
        return "custom_" + profile_name + "_" + md5_hash(profile)
    return profile_name

def post_profile(profile_name, **params) :

    profile = render_profile(profile_name, **params)
    debug("profile full name = "+profile_fullname(profile_name, **params))
    url = Config.BROUTER_ROOT + "/profile/" + profile_fullname(profile_name, **params)
    res = requests.post(url, profile)

    if res.status_code != 200:
        debug("Upload failed !")
        raise HttpError(url, res.status_code, res.text)

    error = res.json().get("error", None)
    if error:
        raise Exception("Error in profile %s :\n%s" %(profile_name, error))

def render_profile(profile_name, **params_overrides) :
    """Render profile file, replacing args with values"""
    params = {
        **Config.DEFAULT_PROFILES[profile_name],
        **params_overrides}

    res = ""
    with open("res/profile.txt", "r") as f:
        for line in f:
            match = re.match(PARAM_PATTERN, line)
            if match:
                vname, value, comment, pname = match.groups()
                if pname in params :
                    val = params[pname]
                    res += "assign %s = %s %s\n" % (vname, valStr(val), comment)
                    continue
            res += line

    debug("render_profile triggered for : %s" % profile_name, **params)
    #debug("\nProfile:\n", res)
    return res