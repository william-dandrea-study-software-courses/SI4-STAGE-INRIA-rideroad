import {LonLatModel} from "./multi-checkpoints-itinerary.model";


export interface ItineraryModel {

  time: number,
  profile: number | null,
  alternative: number | null,
  paths: PathModel[],
  cost: number,
  length: number,
  filtered_ascend: number,
  altitude_profil: number[],

}






export interface PathModel {
  tags: Record<string, string>,
  length: number,
  costs: CostModel,
  coords: LatLonElevationModel[]
  first_coord: number | null,
  last_coord: number | null,
  directions: StepModel[]
}


export interface ManeuverModel {
  bearing_after: number;
  bearing_before: number;
  location: LonLatModel;
  type: string;
  modifier: string;
  exit?: number;
}

export interface IntersectionModel {
  out: number;
  entry: boolean[];
  bearings: number[];
  location: number[];
  in?: number;
}

export interface StepModel {
  geometry: string;
  maneuver: ManeuverModel;
  mode: string;
  driving_side: string;
  name: string;
  intersections: IntersectionModel[];
  weight: number;
  duration: number;
  distance: number;
  ref: string;
  rotary_name: string;
}


export interface CostModel {
  per_km: number,
  elevation: number,
  turn: number,
  node: number,
  initial: number,
}

export interface LatLonElevationModel {
  lat: number,
  lon: number,
  elevation: number,
}
