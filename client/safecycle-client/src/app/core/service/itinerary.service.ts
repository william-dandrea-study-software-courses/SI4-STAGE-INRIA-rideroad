import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {NominatimAddressModel} from "../model/nominatim-address.model";
import {ItineraryModel} from "../model/itinerary.model";
import {ItineraryVisual} from "../model/itinerary-visual.class"
import {LatLng} from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {

  private itinerary: ItineraryModel[] | null = null;
  private $itinerary: BehaviorSubject<ItineraryModel[] | null > = new BehaviorSubject<ItineraryModel[] | null>(null)

  public itineraryVisual: ItineraryVisual[] | null = null;
  public $itineraryVisual: BehaviorSubject<ItineraryVisual[] | null> = new BehaviorSubject<ItineraryVisual[] | null>(null);

  public selectedItinerary: ItineraryVisual | null = null;
  public $selectedItinerary: BehaviorSubject<ItineraryVisual | null> = new BehaviorSubject<ItineraryVisual | null>(null);

  public startMarker: LatLng | null = null;
  public $startMarker: BehaviorSubject<LatLng | null> = new BehaviorSubject<LatLng | null>(null);
  public endMarker: LatLng | null = null;
  public $endMarker: BehaviorSubject<LatLng | null> = new BehaviorSubject<LatLng | null>(null);

  constructor(private http: HttpClient) { }


  private getItinerary(longitudeStart: number, latitudeStart: number, longitudeEnd: number, latitudeEnd: number, roadType: number): Observable<ItineraryModel[]> {
    const url = 'http://127.0.0.1:8000/api/itinerary';

    let queryParams = new HttpParams();
    queryParams = queryParams.append("departure_longitude", longitudeStart);
    queryParams = queryParams.append("departure_latitude", latitudeStart);
    queryParams = queryParams.append("destination_longitude", longitudeEnd);
    queryParams = queryParams.append("destination_latitude", latitudeEnd);
    queryParams = queryParams.append("road_type", roadType);

    return this.http.get<ItineraryModel[]>(url, {params:queryParams})
  }


  public launchSearchItinerary(longitudeStart: number, latitudeStart: number, longitudeEnd: number, latitudeEnd: number, roadType: number) {
    this.getItinerary(longitudeStart, latitudeStart, longitudeEnd, latitudeEnd, roadType).subscribe(v => {
      this.itinerary = v;
      this.$itinerary.next(v);

      this.itineraryVisual = this.itinerary.map((v, i) => new ItineraryVisual(v, i, false))
      this.itineraryVisual.forEach(iti => {
        iti.startLatLng = new LatLng(latitudeStart, longitudeStart)
        iti.endLatLng = new LatLng(latitudeEnd, longitudeEnd)
      })
      if (this.itineraryVisual.length > 0) {
        this.changeSelectedItinerary(this.itineraryVisual[0].index);
      }

      this.$selectedItinerary.next(this.selectedItinerary);
      this.$itineraryVisual.next(this.itineraryVisual);
    }, error => {
      this.$itinerary.error(error);

      this.itinerary = null;
      this.$itinerary = new BehaviorSubject<ItineraryModel[] | null>(null);

      this.itineraryVisual = null;
      this.$itineraryVisual.next(null);
    })
  }

  public changeSelectedItinerary(index: number) : void {
    if (this.itineraryVisual != null) {

      let selectedIt = null;

      for (let i = 0; i < this.itineraryVisual.length; i++) {
        if (this.itineraryVisual) {
          this.itineraryVisual[i].is_selectionned = this.itineraryVisual[i].index === index;
          if (this.itineraryVisual[i].index === index) {
            selectedIt = this.itineraryVisual[i];
          }
        }
      }

      this.$itineraryVisual.next(this.itineraryVisual);

      this.selectedItinerary = selectedIt;
      this.$selectedItinerary.next(this.selectedItinerary);
    }
  }


  public cleanMapItinerary(): void {
    this.itineraryVisual = null;
    this.$itineraryVisual.next(null);
  }



  public setMarkerStart(latLon: LatLng | null) {
    this.startMarker = latLon;
    this.$startMarker.next(this.startMarker);
  }

  public setMarkerEnd(latLon: LatLng | null) {
    this.endMarker = latLon;
    this.$endMarker.next(this.endMarker);
  }




}
