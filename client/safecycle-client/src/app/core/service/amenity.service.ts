import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, pipe} from "rxjs";
import {LatLngBounds} from "leaflet";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AmenityEnum, AmenityModel} from "../model/amenity.model";
import {map} from "rxjs/operators";

export interface AmenityTitle {
  name: string;
  isSelected: boolean;
  type: AmenityEnum;
}


@Injectable({
  providedIn: 'root'
})
export class AmenityService {

  private amenitiesTitle: AmenityTitle[] = [
    {name: 'Drinking Water', isSelected: true, type: AmenityEnum.DRINKING_WATER},
    {name: 'Campings', isSelected: false, type: AmenityEnum.CAMP_SITE},
    {name: 'Restaurants', isSelected: false, type: AmenityEnum.RESTAURANT},
    {name: 'Repair Station', isSelected: false, type: AmenityEnum.BICYCLE_REPAIR_STATION},
    {name: 'Shelter', isSelected: true, type: AmenityEnum.SHELTER},
    {name: 'Toilets', isSelected: true, type: AmenityEnum.TOILETS},
  ];
  public $amenitiesTitle: BehaviorSubject<AmenityTitle[]> = new BehaviorSubject<AmenityTitle[]>(this.amenitiesTitle)

  private amenitiesResult: AmenityModel[] = []
  public $amenitiesResult: BehaviorSubject<AmenityModel[]> = new BehaviorSubject<AmenityModel[]>(this.amenitiesResult)

  private mapBoundsForAmenities: LatLngBounds | null = null;
  public $mapBoundsForAmenities: BehaviorSubject<LatLngBounds | null> = new BehaviorSubject<LatLngBounds | null>(this.mapBoundsForAmenities)

  constructor(private http: HttpClient) {
    this.$amenitiesTitle.subscribe(amenities => {
      this.$mapBoundsForAmenities.subscribe(mapBounds => {
        if (amenities.length != 0 && mapBounds != null) {
          this.downloadAmenities(amenities, mapBounds)
        }
      })
    })
  }

  public selectAmenity(amenity: AmenityTitle) {
    const index = this.amenitiesTitle.findIndex(amen => amen.name === amenity.name);
    const amen = this.amenitiesTitle[index];
    amen.isSelected = !amen.isSelected
    this.amenitiesTitle[index] = amen
    this.$amenitiesTitle.next(this.amenitiesTitle)
  }


  public changeMapBounds(mapBounds: LatLngBounds) {
    this.mapBoundsForAmenities = mapBounds;
    this.$mapBoundsForAmenities.next(this.mapBoundsForAmenities)
  }


  public downloadAmenities(amenities: AmenityTitle[], mapBounds: LatLngBounds) {
    const url = environment.backend_url + 'amenitities-bbox';

    // ?bottom_left_longitude=7.062080&bottom_left_latitude=43.509184&top_right_longitude=7.192886&top_right_latitude=43.610193

    let body: any = {};
    body['bottom_left_longitude'] = mapBounds.getSouthWest().lng;
    body["bottom_left_latitude"] = mapBounds.getSouthWest().lat;
    body["top_right_longitude"] = mapBounds.getNorthEast().lng;
    body["top_right_latitude"] = mapBounds.getNorthEast().lat;
    body["amenities"] = amenities.filter(am => am.isSelected).map(am => am.type);


    console.log(body)
    this.http.post<AmenityModel[]>(url, JSON.stringify(body)).subscribe(amenities => {
      this.amenitiesResult = amenities;
      this.$amenitiesResult.next(this.amenitiesResult);
      console.log(amenities)
    }, error => {
      console.log({error})
    })
  }






}
