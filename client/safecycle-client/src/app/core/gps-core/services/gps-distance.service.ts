import { Injectable } from '@angular/core';
import {LatLng} from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class GpsDistanceService {

  constructor() { }

  public distanceBetween2Points(initialLat: number, initialLon: number, destLat: number, destLon: number): number {

    const R = 6371e3; // metres
    const phi1 = initialLat * Math.PI/180; // φ, λ in radians
    const phi2 = destLat * Math.PI/180;
    const phi = (destLat-initialLat) * Math.PI/180;
    const lambda = (destLon-initialLon) * Math.PI/180;

    const a = Math.sin(phi/2) * Math.sin(phi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(lambda/2) * Math.sin(lambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  }




}
