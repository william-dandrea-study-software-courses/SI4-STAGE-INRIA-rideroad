import {ItineraryModel} from "./itinerary.model";


export interface MultiCheckpointsItineraryModel {

  departure: LonLatModel,
  destination: LonLatModel,
  checkpoints: LonLatModel[],
  itineraries: ItineraryModel[],

}


export interface LonLatModel {
  lon: number,
  lat: number
}
