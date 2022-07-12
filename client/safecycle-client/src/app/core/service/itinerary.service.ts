import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {NominatimAddressModel} from "../model/nominatim-address.model";
import {ItineraryModel} from "../model/itinerary.model";

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {

  public itinerary: ItineraryModel | null = null;
  public $itinerary: BehaviorSubject<ItineraryModel | null> = new BehaviorSubject<ItineraryModel | null>(null)

  constructor(private http: HttpClient) { }


  private getItinerary(longitudeStart: number, latitudeStart: number, longitudeEnd: number, latitudeEnd: number, roadType: number): Observable<ItineraryModel> {
    const url = 'http://127.0.0.1:8000/api/itinerary';

    let queryParams = new HttpParams();
    queryParams = queryParams.append("departure_longitude", longitudeStart);
    queryParams = queryParams.append("departure_latitude", latitudeStart);
    queryParams = queryParams.append("destination_longitude", longitudeEnd);
    queryParams = queryParams.append("destination_latitude", latitudeEnd);
    queryParams = queryParams.append("road_type", roadType);

    return this.http.get<ItineraryModel>(url, {params:queryParams})
  }


  public launchSearchItinerary(longitudeStart: number, latitudeStart: number, longitudeEnd: number, latitudeEnd: number, roadType: number) {
    this.getItinerary(longitudeStart, latitudeStart, longitudeEnd, latitudeEnd, roadType).subscribe(v => {
      this.itinerary = v;
      this.$itinerary.next(v);
    })
  }





}
