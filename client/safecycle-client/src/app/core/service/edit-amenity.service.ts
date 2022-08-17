import { Injectable } from '@angular/core';
import {AmenityEnum} from "../model/amenity.model";
import {BehaviorSubject} from "rxjs";
import {AmenityTitle} from "./amenity.service";
import {LatLng} from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class EditAmenityService {

  private editableAmenitiesTitle: AmenityTitle[] = [
    {name: 'Drinking Water', isSelected: true, type: AmenityEnum.DRINKING_WATER},
    {name: 'Repair Station', isSelected: false, type: AmenityEnum.BICYCLE_REPAIR_STATION},
    {name: 'Shelter', isSelected: true, type: AmenityEnum.SHELTER},
    {name: 'Toilets', isSelected: true, type: AmenityEnum.TOILETS},
  ];
  public $editableAmenitiesTitle: BehaviorSubject<AmenityTitle[]> = new BehaviorSubject<AmenityTitle[]>(this.editableAmenitiesTitle)

  private positionNewAmenity: LatLng | null = null
  public $positionNewAmenity: BehaviorSubject<LatLng | null> = new BehaviorSubject<LatLng | null>(this.positionNewAmenity)

  constructor() { }


  public setPositionNewAmenity(position: LatLng) {
    this.positionNewAmenity = position;
    this.$positionNewAmenity.next(this.positionNewAmenity);
  }
}
