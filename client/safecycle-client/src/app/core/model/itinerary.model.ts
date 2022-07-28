

export interface ItineraryModel {

  time: number;
  profile: number | null;
  alternative: number | null;
  paths: PathModel[];
  cost: number;
  length: number;
  filtered_ascend: number;
  altitude_profil: number[];
}

export interface PathModel {
  tags: Record<string, string>;
  length: number;
  costs: CostModel;
  coords: LatLonElevationModel[]
  first_coord: number | null,
  last_coord: number | null,
}


export interface CostModel {
  per_km: number;
  elevation: number;
  turn: number;
  node: number;
  initial: number;
}

export interface LatLonElevationModel {
  lat: number;
  lon: number;
  elevation: number;
}
