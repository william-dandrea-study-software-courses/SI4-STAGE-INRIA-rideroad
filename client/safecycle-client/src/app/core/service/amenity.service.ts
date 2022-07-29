import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LatLngBounds} from "leaflet";

export interface AmenityTitle {
  name: string;
  isSelected: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AmenityService {

  private amenities: AmenityTitle[] = [
    {name: 'Drinking Water', isSelected: false},
    {name: 'Campings', isSelected: false},
    {name: 'Restaurants', isSelected: true},
    {name: 'Repair Station', isSelected: true},
    {name: 'Shelter', isSelected: false},
    {name: 'Toilets', isSelected: false},
  ];
  public $amenities: BehaviorSubject<AmenityTitle[]> = new BehaviorSubject<AmenityTitle[]>(this.amenities)

  private mapBoundsForAmenities: LatLngBounds | null = null;
  public $mapBoundsForAmenities: BehaviorSubject<LatLngBounds | null> = new BehaviorSubject<LatLngBounds | null>(this.mapBoundsForAmenities)

  constructor() {
    this.$amenities.subscribe(amenities => {
      this.$mapBoundsForAmenities.subscribe(mapBounds => {
        if (amenities.length != 0 && mapBounds != null) {
          this.downloadAmenities(amenities, mapBounds)
        }
      })
    })
  }

  public selectAmenity(amenity: AmenityTitle) {
    const index = this.amenities.findIndex(amen => amen.name === amenity.name);
    const amen = this.amenities[index];
    amen.isSelected = !amen.isSelected
    this.amenities[index] = amen
    this.$amenities.next(this.amenities)
  }


  public changeMapBounds(mapBounds: LatLngBounds) {
    this.mapBoundsForAmenities = mapBounds;
    this.$mapBoundsForAmenities.next(this.mapBoundsForAmenities)
  }


  public downloadAmenities(amenities: AmenityTitle[], mapBounds: LatLngBounds) {



  }





}
