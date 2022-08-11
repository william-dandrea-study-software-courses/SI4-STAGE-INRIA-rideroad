import { Injectable } from '@angular/core';
import {LatLng, Projection, Point} from "leaflet";
import {DistanceAndId, PointDescription} from "../../model/gps.model";
import {dot} from "mathjs";
import {L} from "@angular/cdk/keycodes";

@Injectable({
  providedIn: 'root'
})
export class GpsDistanceService {


  constructor() { }



  public isPointIsInsideRadiusAroundCurrentLocation(currentLocation: LatLng, radius: number, point: LatLng): boolean {

    const distance = this.distanceBetween2Points(currentLocation.lat, currentLocation.lng, point.lat, point.lng)
    return distance <= radius
  }


  public sortPointsByClosestDistance(currentLocation: LatLng, pointsToSearch: PointDescription[]) {

    let idWithDistance: DistanceAndId[] = [];

    pointsToSearch.forEach(pointToSearch => {
      const distance = this.distanceBetween2Points(currentLocation.lat, currentLocation.lng, pointToSearch.lat, pointToSearch.lon);
      idWithDistance.push({distance: distance, id: pointToSearch.id})
    });


    const sortedArray = idWithDistance.sort((obj1, obj2) => {
      if (obj1.distance > obj2.distance) {
        return 1;
      }
      if (obj1.distance < obj2.distance) {
        return -1;
      }
      return 0;
    });

    return sortedArray;
  }


  public angleBetween2Segments(segmentAFirstPoint: LatLng, segmentASecondPoint: LatLng, segmentBFirstPoint: LatLng, segmentBSecondPoint: LatLng) {

    const xyzPoint1: Point = Projection.LonLat.project(segmentAFirstPoint);
    const xyzPoint2: Point = Projection.LonLat.project(segmentASecondPoint);
    const xyzPoint3: Point = Projection.LonLat.project(segmentBFirstPoint);
    const xyzPoint4: Point = Projection.LonLat.project(segmentBSecondPoint);

    const eq1 = this.convertTwoPointsToLineEquation(xyzPoint1.x, xyzPoint1.y, xyzPoint2.x, xyzPoint2.y);
    const eq2 = this.convertTwoPointsToLineEquation(xyzPoint3.x, xyzPoint3.y, xyzPoint4.x, xyzPoint4.y);

    const result = this.angleBetween2Lines(eq1.m, eq2.m);

    return result
  }


  public distanceBetween2Points(initialLat: number, initialLon: number, destLat: number, destLon: number): number {

    const R = 6371e3; // metres
    const phi1 = initialLat * Math.PI/180; // φ, λ in radians
    const phi2 = destLat * Math.PI/180;
    const phi = (destLat-initialLat) * Math.PI/180;
    const lambda = (destLon-initialLon) * Math.PI/180;

    const a = Math.sin(phi/2) * Math.sin(phi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(lambda/2) * Math.sin(lambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const result = R * c

    return parseFloat(result.toFixed(6)); // in metres
  }


  public convertTwoPointsToLineEquation(x1: number, y1: number, x2: number, y2: number): {m: number, b: number} {
    const m =(y2 - y1) / (x2 - x1);
    const b = y2 / (m + x2);

    // y = mx + b
    return {m: m, b: b};
  }

  public angleBetween2Lines(m1: number, m2: number) {

    const tanOmega = Math.abs( (m2 - m1) / (1 + m1 * m2) )
    const omega = Math.atan(tanOmega);

    return omega * 180 / Math.PI;
  }

}
