

export interface NominatimAddressModel {

  place_id: number | null,
  licence: string | null,
  osm_type: string | null,
  osm_id: number | null,
  boundingbox: string[] | null,
  lat: string,
  lon: string,
  display_name: string | null,
  place_rank: number | null,
  category: string | null,
  type: string | null,
  importance: number | null,

}
