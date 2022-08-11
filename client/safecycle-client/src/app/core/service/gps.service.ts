import { Injectable } from '@angular/core';
import {ItineraryVisual} from "../model/itinerary-visual.class";
import {BehaviorSubject} from "rxjs";
import {LatLng} from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  private itinerary: ItineraryVisual | null = null;
  public $itinerary: BehaviorSubject<ItineraryVisual | null> = new BehaviorSubject<ItineraryVisual | null>(null);

  private allItineraryStagePoints: LatLng[] = [];
  private allItinerarySubPoints: LatLng[] = [];

  constructor() { }

  public setItinerary(itinerary: ItineraryVisual) {
    this.itinerary = itinerary;
    this.$itinerary.next(this.itinerary);
    this.initializeItineraryPoint(itinerary)
  }






  private initializeItineraryPoint(itinerary: ItineraryVisual) {
    this.allItineraryStagePoints = [];
    this.allItinerarySubPoints = [];

    itinerary.itinerary.paths.forEach((path, index) => {
      if (index == 0) {
        if (path.coords.length > 0) {
          this.allItineraryStagePoints.push(new LatLng(path.coords[0].lat, path.coords[0].lon))
          this.allItinerarySubPoints.push(new LatLng(path.coords[0].lat, path.coords[0].lon))
        }
      }

      if (path.coords.length > 0) {
        this.allItineraryStagePoints.push(new LatLng(path.coords[path.coords.length - 1].lat, path.coords[path.coords.length - 1].lon))
        path.coords.forEach(value => {this.allItinerarySubPoints.push(new LatLng(value.lat, value.lon))})
      }
    })
  }
}
