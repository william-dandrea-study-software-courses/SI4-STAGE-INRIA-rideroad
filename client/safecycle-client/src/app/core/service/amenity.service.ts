import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LatLngBounds} from "leaflet";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AmenityEnum, AmenityModel} from "../model/amenity.model";

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

  constructor(private http: HttpClient) {

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


  public downloadAmenities() {

    if (this.amenitiesTitle.length != 0 && this.mapBoundsForAmenities != null) {
      const url = environment.backend_url + 'amenitities-bbox';


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
      case AmenityEnum.DRINKING_WATER: return '/assets/icons/water_drop_icon.svg';
      case AmenityEnum.CAMP_SITE: return '/assets/icons/camping_icon.svg';
      case AmenityEnum.RESTAURANT: return '/assets/icons/restaurant_icon.svg';
      case AmenityEnum.BICYCLE_REPAIR_STATION: return '/assets/icons/repair_icon.svg';
      case AmenityEnum.SHELTER: return '/assets/icons/shelter_icon.svg';
      case AmenityEnum.TOILETS: return '/assets/icons/toilets_icon.svg';
    }

    return '/assets/icons/didnt_find_icon.svg'

  }






}
