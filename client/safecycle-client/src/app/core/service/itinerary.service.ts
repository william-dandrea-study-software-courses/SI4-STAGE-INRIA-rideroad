import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {NominatimAddressModel} from "../model/nominatim-address.model";
import {ItineraryModel, PathModel} from "../model/itinerary.model";
import {ItineraryVisual} from "../model/itinerary-visual.class"
import {LatLng} from "leaflet";
import {MultiCheckpointsItineraryModel} from "../model/multi-checkpoints-itinerary.model";
import {environment} from "../../../environments/environment";
import {NewUserItineraryInfosClass} from "../model/new-user-itinerary-infos.class";

export class ItineraryError extends Error {
  constructor(error: string) {
    super(error);
  }
}


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

  public newItineraryUserInfos: NewUserItineraryInfosClass = new NewUserItineraryInfosClass();
  public newItineraryUserInfos$: BehaviorSubject<NewUserItineraryInfosClass> = new BehaviorSubject<NewUserItineraryInfosClass>(this.newItineraryUserInfos);

  public isLoadingItineraryOnBackend: boolean | ItineraryError = false;
  public $isLoadingItineraryOnBackend: BehaviorSubject<boolean | ItineraryError> = new BehaviorSubject<boolean | ItineraryError>(false)

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

    const url = environment.backend_url + 'checkpoints-itinerary';

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


  private launchSearchItinerary(start: LatLng, end: LatLng, roadType: number, checkpoints: LatLng[]) {

    this.getItineraryWithCheckPoints(start.lng, start.lat, end.lng, end.lat, roadType, checkpoints).subscribe(v => {
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

      this.isLoadingItineraryOnBackend = new ItineraryError("Cannot generate the itinerary");
      this.$isLoadingItineraryOnBackend.next(this.isLoadingItineraryOnBackend);

      console.log("yo")

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

    this.newItineraryUserInfos.startMarker = latLon;
    this.newItineraryUserInfos$.next(this.newItineraryUserInfos);
    this.updateItinerary();
  }

  public setEnd(latLon: LatLng | null) {
    this.newItineraryUserInfos.endMarker = latLon;
    this.newItineraryUserInfos$.next(this.newItineraryUserInfos);
    this.updateItinerary();
  }

  public setRoadType(value: number) {
    this.newItineraryUserInfos.roadType = value;
    this.newItineraryUserInfos$.next(this.newItineraryUserInfos);
    this.updateItinerary();
  }

  public setCheckPoints(latLonList: LatLng[]) {
    this.newItineraryUserInfos.checkPoints = latLonList;
    this.newItineraryUserInfos$.next(this.newItineraryUserInfos);
    this.updateItinerary();
  }


  public updateItinerary() {
    if (this.newItineraryUserInfos.isPossibleToGenerateItinerary()) {
      // @ts-ignore
      this.launchSearchItinerary(this.newItineraryUserInfos.startMarker, this.newItineraryUserInfos.endMarker, this.newItineraryUserInfos.roadType, this.newItineraryUserInfos.checkPoints);
    }
  }



  public isBikePath(highways: PathModel): boolean {
    let lanes = ["lane", "opposite", "opposite_lane", "track", "opposite_track", "share_busway", "share_lane"]
    return highways.tags['highway'] === "cycleway" || highways.tags['bicycle'] === "designated" || highways.tags['bicycle_road'] != null || lanes.includes(highways.tags['cycleway:right']) || lanes.includes(highways.tags['cycleway:left']) || lanes.includes(highways.tags['cycleway'])|| highways.tags['route_bicycle_icn'] == 'yes'
  }

  public isPedestrianPath(highway: string): boolean {
    return highway === "footway"|| highway === "pedestrian" || highway === "step";
  }

  public isDirtPath(highway: string): boolean {
    return highway === "abandoned"|| highway === "bridleway" || highway === "proposed";
  }









}
