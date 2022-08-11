import { TestBed } from '@angular/core/testing';

import { GpsDistanceService } from './gps-distance.service';
import {LatLng} from "leaflet";

describe('GpsDistanceService', () => {
  let service: GpsDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpsDistanceService);
  });

  it('Verify that distanceBetween2Points give the good distance', () => {
    expect(service).toBeTruthy();

    const startPoint: LatLng = new LatLng(39.689201, -76.044213);
    const endPoint: LatLng = new LatLng(38.889069,-77.034502);

    expect(service.distanceBetween2Points(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng)).toBe(123201.450447)
  });


  it('Verify that sortPointsByClosestDistance sort well', () => {
    expect(service).toBeTruthy();

    // 43.61928382031339, 7.062742563384034
    const startPoint: LatLng = new LatLng(43.61928382031339, 7.062742563384034);
    const mediumPoint: LatLng = new LatLng(43.620400114635395, 7.063523836152225);
    const closePoint: LatLng = new LatLng(43.61993127354451, 7.063148619625396);
    const farPoint: LatLng = new LatLng(43.620906161233926, 7.061277676943676);

    const result = service.sortPointsByClosestDistance(startPoint, [
      {id: 1, lat: mediumPoint.lat, lon: mediumPoint.lng},
      {id: 2, lat: closePoint.lat, lon: closePoint.lng},
      {id: 3, lat: farPoint.lat, lon: farPoint.lng},
    ])

    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(1)
    expect(result[2].id).toBe(3)
  });


  it('isPointIsInsideRadiusAroundCurrentLocation', () => {
    expect(service).toBeTruthy();

    // 43.61928382031339, 7.062742563384034
    const startPoint: LatLng = new LatLng(43.619287541328895, 7.062742563384034);
    const isIn20mPoint: LatLng = new LatLng(43.61941777672636, 7.062763123193722);
    const isOut20mPoint: LatLng = new LatLng(43.61950335983392, 7.062773403098567);

    expect(service.isPointIsInsideRadiusAroundCurrentLocation(startPoint, 20, isIn20mPoint)).toBeTrue()
    expect(service.isPointIsInsideRadiusAroundCurrentLocation(startPoint, 20, isOut20mPoint)).toBeFalse()
  });


  it('angleBetween2Segments Test', () => {
    expect(service).toBeTruthy();

    // 43.61928382031339, 7.062742563384034

    const segmentAFirstPoint: LatLng = new LatLng(43.61928382031339, 7.0627477033364565);
    const segmentASecondPoint: LatLng = new LatLng(43.61952568584195, 7.06277854305099);
    const segmentBFirstPoint: LatLng = new LatLng(43.62018429934927, 7.06306638038664);
    const segmentBSecondPoint: LatLng = new LatLng(43.62015081070097, 7.063287398340798);

    const result = service.angleBetween2Segments(segmentAFirstPoint, segmentASecondPoint, segmentBFirstPoint, segmentBSecondPoint)


    expect(result).toBe(88.65052018670856)
  });


});
