import {FeatureGroup, LatLng, Layer} from "leaflet";
import {ItineraryModel} from "./itinerary.model";


export class ItineraryVisual {

  itinerary: ItineraryModel;
  index: number;
  is_selectionned: boolean;
  segments_on_map: FeatureGroup | null;
  startLatLng: LatLng | null = null;
  endLatLng: LatLng | null = null;

  constructor(itinerary: ItineraryModel, index: number, is_selectionned: boolean) {
    this.itinerary = itinerary;
    this.index = index;
    this.is_selectionned = is_selectionned;
    this.segments_on_map = null;
  }

}
