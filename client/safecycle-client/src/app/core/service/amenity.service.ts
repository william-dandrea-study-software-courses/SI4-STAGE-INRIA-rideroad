import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LatLngBounds} from "leaflet";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AmenityEnum, AmenityModel} from "../model/amenity.model";
import {
  BICYCLE_REPAIR_STATION_ICON,
  CAMP_SITE_ICON,
  DRINKING_WATER_ICON,
  GET_AMENITY_IN_BBOX, NOT_FOUND_ICON,
  RESTAURANT_ICON, SHELTER_ICON, TOILETS_ICON
} from "../../../config";

export interface AmenityTitle {
  name: string;
  isSelected: boolean;
  type: AmenityEnum;
}

export class AmenityError extends Error {
  constructor(error: string) {
    super(error);
  }
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

  private isLoadingAmenities: boolean | AmenityError = false;
  public $isLoadingAmenities: BehaviorSubject<boolean | AmenityError> = new BehaviorSubject<boolean | AmenityError>(this.isLoadingAmenities)



  constructor(private http: HttpClient) {}

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


  public downloadAmenities() {

    if (this.amenitiesTitle.length != 0 && this.mapBoundsForAmenities != null) {
      const url = environment.backend_url + GET_AMENITY_IN_BBOX;


      this.isLoadingAmenities = true;
      this.$isLoadingAmenities.next(this.isLoadingAmenities);

      // ?bottom_left_longitude=7.062080&bottom_left_latitude=43.509184&top_right_longitude=7.192886&top_right_latitude=43.610193

      let body: any = {};
      body['bottom_left_longitude'] = this.mapBoundsForAmenities.getSouthWest().lng;
      body["bottom_left_latitude"] = this.mapBoundsForAmenities.getSouthWest().lat;
      body["top_right_longitude"] = this.mapBoundsForAmenities.getNorthEast().lng;
      body["top_right_latitude"] = this.mapBoundsForAmenities.getNorthEast().lat;
      body["amenities"] = this.amenitiesTitle.filter(am => am.isSelected).map(am => am.type);


      this.http.post<AmenityModel[]>(url, JSON.stringify(body)).subscribe(amenities => {
        this.amenitiesResult = amenities;
        this.$amenitiesResult.next(this.amenitiesResult);

        this.isLoadingAmenities = false;
        this.$isLoadingAmenities.next(this.isLoadingAmenities);

        console.log(amenities)
      }, error => {

        this.isLoadingAmenities = new AmenityError("Cannot load amenities : " + error);
        this.$isLoadingAmenities.next(this.isLoadingAmenities);
      })
    }
  }


  public getIconUrl(amenity: string) {

    switch (amenity) {
      case AmenityEnum.DRINKING_WATER: return DRINKING_WATER_ICON;
      case AmenityEnum.CAMP_SITE: return CAMP_SITE_ICON;
      case AmenityEnum.RESTAURANT: return RESTAURANT_ICON;
      case AmenityEnum.BICYCLE_REPAIR_STATION: return BICYCLE_REPAIR_STATION_ICON;
      case AmenityEnum.SHELTER: return SHELTER_ICON;
      case AmenityEnum.TOILETS: return TOILETS_ICON;
    }

    return NOT_FOUND_ICON;

  }






}
