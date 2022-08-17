import {LatLng} from "leaflet";
import {StepModel} from "./itinerary.model";


export interface NavigationPointsModel {

  position: LatLng,
  description: string,
  is_visited: boolean,
  step: StepModel



}
