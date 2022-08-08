import {LatLng} from "leaflet";


export class NewUserItineraryInfosClass {
  private _startMarker: LatLng | null;
  private _endMarker: LatLng | null;
  private _checkPoints: LatLng[];
  private _roadType: number;

  constructor() {
    this._startMarker = null;
    this._endMarker = null;
    this._checkPoints = [];
    this._roadType = 0;
  }


  public isPossibleToGenerateItinerary(): boolean {
    return this._startMarker != null && this._endMarker != null;
  }






  get startMarker(): LatLng | null {
    return this._startMarker;
  }

  set startMarker(value: LatLng | null) {
    this._startMarker = value;
  }

  get endMarker(): LatLng | null {
    return this._endMarker;
  }

  set endMarker(value: LatLng | null) {
    this._endMarker = value;
  }

  get checkPoints(): LatLng[] {
    return this._checkPoints;
  }

  set checkPoints(value: LatLng[]) {
    this._checkPoints = value;
  }

  get roadType(): number {
    return this._roadType;
  }

  set roadType(value: number) {
    this._roadType = value;
  }
}
