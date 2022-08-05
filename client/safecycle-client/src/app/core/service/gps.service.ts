import { Injectable } from '@angular/core';
import {ItineraryVisual} from "../model/itinerary-visual.class";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  private itinerary: ItineraryVisual | null = null;
  public $itinerary: BehaviorSubject<ItineraryVisual | null> = new BehaviorSubject<ItineraryVisual | null>(null);

  constructor() { }


  public setItinerary(itinerary: ItineraryVisual) {
    this.itinerary = itinerary;
    this.$itinerary.next(this.itinerary);
  }
}
