import { Injectable } from '@angular/core';
import {AmenityEnum} from "../model/amenity.model";
import {BehaviorSubject} from "rxjs";
import {AmenityTitle} from "./amenity.service";
import {LatLng} from "leaflet";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MultiCheckpointsItineraryModel} from "../model/multi-checkpoints-itinerary.model";
import {
  POST_NEW_DRINKING_WATER_AMENITY,
  POST_NEW_REPAIR_STATION_AMENITY,
  POST_NEW_SHELTER_AMENITY, POST_NEW_TOILETS_AMENITY
} from "../../../config";

@Injectable({
  providedIn: 'root'
})
export class EditAmenityService {


  private positionNewAmenity: LatLng | null = null
  public $positionNewAmenity: BehaviorSubject<LatLng | null> = new BehaviorSubject<LatLng | null>(this.positionNewAmenity)

  constructor(private http: HttpClient) { }

  public setPositionNewAmenity(position: LatLng) {
    this.positionNewAmenity = position;
    this.$positionNewAmenity.next(this.positionNewAmenity);
  }

  public addNewDrinkingWater(login: string, password: string, access: string, fee: string) {
    console.log(login, password, access, fee)

    const url = environment.backend_url + POST_NEW_DRINKING_WATER_AMENITY;

    const body = {
      longitude: this.positionNewAmenity?.lng,
      latitude: this.positionNewAmenity?.lat,
      login: login,
      password: password,
      access: access,
      fee: fee,
    }

    return this.http.post(url, body)

  }

  public addNewRepairStation(login: string, password: string, fee: string, repair: string, pump: string, tools: string) {
    console.log(login, password,fee)

    const url = environment.backend_url + POST_NEW_REPAIR_STATION_AMENITY;

    const body = {
      longitude: this.positionNewAmenity?.lng,
      latitude: this.positionNewAmenity?.lat,
      login: login,
      password: password,
      fee: fee,
      attributes: {
        repair: repair,
        pump: pump,
        tools: tools,
      }
    }

    return this.http.post(url, body)
  }

  public addNewShelter(login: string, password: string, bench: string, bin: string) {
    console.log(login, password,bench, bin)

    const url = environment.backend_url + POST_NEW_SHELTER_AMENITY;

    const body = {
      longitude: this.positionNewAmenity?.lng,
      latitude: this.positionNewAmenity?.lat,
      login: login,
      password: password,
      bench: bench,
      bin: bin,
    }

    return this.http.post(url, body)
  }

  public addNewToilets(login: string, password: string, disposal: string, access: string, gender: string) {
    console.log(login, password,disposal, access, gender)

    const url = environment.backend_url + POST_NEW_TOILETS_AMENITY;

    const body = {
      longitude: this.positionNewAmenity?.lng,
      latitude: this.positionNewAmenity?.lat,
      login: login,
      password: password,
      access: access,
      gender: gender,
      disposal: disposal
    }

    return this.http.post(url, body)
  }

}
