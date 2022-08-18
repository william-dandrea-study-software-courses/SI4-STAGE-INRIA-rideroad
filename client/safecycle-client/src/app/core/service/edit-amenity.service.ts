import { Injectable } from '@angular/core';
import {AmenityEnum} from "../model/amenity.model";
import {BehaviorSubject} from "rxjs";
import {AmenityTitle} from "./amenity.service";
import {LatLng} from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class EditAmenityService {


  private positionNewAmenity: LatLng | null = null
  public $positionNewAmenity: BehaviorSubject<LatLng | null> = new BehaviorSubject<LatLng | null>(this.positionNewAmenity)

  constructor() { }

  public setPositionNewAmenity(position: LatLng) {
    this.positionNewAmenity = position;
    this.$positionNewAmenity.next(this.positionNewAmenity);
  }

  public addNewDrinkingWater(login: string, password: string, access: string, fee: string) {
    console.log(login, password, access, fee)
  }

  public addNewRepairStation(login: string, password: string, fee: string, services: {attribute: string, value: string}[]) {
    console.log(login, password,fee, services)
  }

  public addNewShelter(login: string, password: string, bench: string, bin: string) {
    console.log(login, password,bench, bin)
  }

  public addNewToilets(login: string, password: string, disposal: string, access: string, gender: string) {
    console.log(login, password,disposal, access, gender)
  }

}
