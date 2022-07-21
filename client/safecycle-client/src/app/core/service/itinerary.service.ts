import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {NominatimAddressModel} from "../model/nominatim-address.model";
import {ItineraryModel} from "../model/itinerary.model";
import {ItineraryVisual} from "../model/itinerary-visual.class"
import {LatLng} from "leaflet";
import {MultiCheckpointsItineraryModel} from "../model/multi-checkpoints-itinerary.model";
import {environment} from "../../../environments/environment";

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
  public checkPoints: LatLng[] = [];
  public $checkPoints: BehaviorSubject<LatLng[]> = new BehaviorSubject<LatLng[]>([]);
  public roadType: number = 0;
  public $roadType: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public isLoadingItineraryOnBackend: boolean = false;
  public $isLoadingItineraryOnBackend: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient) { }


  private getItinerary(longitudeStart: number, latitudeStart: number, longitudeEnd: number, latitudeEnd: number, roadType: number): Observable<ItineraryModel[]> {
    this.isLoadingItineraryOnBackend = true;
    this.$isLoadingItineraryOnBackend.next(this.isLoadingItineraryOnBackend);

    const url = environment.backend_url + 'itinerary';

    let queryParams = new HttpParams();
    queryParams = queryParams.append("departure_longitude", longitudeStart);
    queryParams = queryParams.append("departure_latitude", latitudeStart);
    queryParams = queryParams.append("destination_longitude", longitudeEnd);
    queryParams = queryParams.append("destination_latitude", latitudeEnd);
    queryParams = queryParams.append("road_type", roadType);

    return this.http.get<ItineraryModel[]>(url, {params:queryParams})
  }


  private getItineraryWithCheckPoints(longitudeStart: number, latitudeStart: number, longitudeEnd: number, latitudeEnd: number, roadType: number, checkPoints: LatLng[]): Observable<MultiCheckpointsItineraryModel> {
    this.isLoadingItineraryOnBackend = true;
    this.$isLoadingItineraryOnBackend.next(this.isLoadingItineraryOnBackend);

    const url = 'http://127.0.0.1:8000/api/checkpoints-itinerary';

    const body = {
      departure: [longitudeStart, latitudeStart],
      destination: [longitudeEnd, latitudeEnd],
      checkpoints: [
        ...checkPoints.map(latLng => [latLng.lng, latLng.lat])
      ],
      road_type: Number(roadType),
    }


    return this.http.post<MultiCheckpointsItineraryModel>(url, body)
  }


  private launchSearchItinerary(start: LatLng, end: LatLng, roadType: number) {

    this.getItineraryWithCheckPoints(start.lng, start.lat, end.lng, end.lat, roadType, this.checkPoints).subscribe(v => {
      this.itinerary = v.itineraries;
      this.$itinerary.next(v.itineraries);

      this.itineraryVisual = this.itinerary.map((v, i) => new ItineraryVisual(v, i, false))
      this.itineraryVisual.forEach(iti => {
        iti.startLatLng = start
        iti.endLatLng = end
      })
      if (this.itineraryVisual.length > 0) {
        this.changeSelectedItinerary(this.itineraryVisual[0].index);
      }

      this.$selectedItinerary.next(this.selectedItinerary);
      this.$itineraryVisual.next(this.itineraryVisual);

      this.isLoadingItineraryOnBackend = false;
      this.$isLoadingItineraryOnBackend.next(this.isLoadingItineraryOnBackend);
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

  public setStart(latLon: LatLng | null) {
    this.startMarker = latLon;
    this.$startMarker.next(this.startMarker);
    this.updateItinerary();
  }

  public setEnd(latLon: LatLng | null) {
    this.endMarker = latLon;
    this.$endMarker.next(this.endMarker);
    this.updateItinerary();
  }

  public setRoadType(value: number) {
    this.roadType = value;
    this.$roadType.next(this.roadType)
    this.updateItinerary();
  }

  public setCheckPoints(latLonList: LatLng[]) {
    this.checkPoints = latLonList;
    this.$checkPoints.next(this.checkPoints);
    this.updateItinerary();
  }


  public updateItinerary() {

    if (this.startMarker != null && this.endMarker != null && this.roadType != null) {
      this.launchSearchItinerary(this.startMarker, this.endMarker, this.roadType);
    }

  }








}
