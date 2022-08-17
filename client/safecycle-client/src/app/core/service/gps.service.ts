import { Injectable } from '@angular/core';
import {ItineraryVisual} from "../model/itinerary-visual.class";
import {BehaviorSubject, Subscription} from "rxjs";
import {LatLng} from "leaflet";
import {NavigationPointsModel} from "../model/navigation-points.model";
import {GeolocalisationService} from "./geolocalisation.service";
import {GpsDistanceService} from "../gps-core/services/gps-distance.service";
import {sum} from "mathjs";

declare var require: any
const osrmTextInstructions = require('osrm-text-instructions')('v5');

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  private currentPositionSubscription: Subscription = new Subscription();

  private itinerary: ItineraryVisual | null = null;
  public $itinerary: BehaviorSubject<ItineraryVisual | null> = new BehaviorSubject<ItineraryVisual | null>(null);

  private navigationPoints: NavigationPointsModel[] = [];
  private nextNavigationPoint: NavigationPointsModel | undefined = undefined;
  public $nextNavigationPoint: BehaviorSubject<NavigationPointsModel | undefined> = new BehaviorSubject<NavigationPointsModel | undefined>(this.nextNavigationPoint);
  private distanceUntilNextPoint: number | undefined = undefined;
  public $distanceUntilNextPoint: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(this.distanceUntilNextPoint);
  private distanceUntilEnd: number | undefined = undefined;
  public $distanceUntilEnd: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(this.distanceUntilEnd);
  private isArrived: boolean = false;
  public $isArrived: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isArrived);

  constructor(private geolocalisationService: GeolocalisationService, private gpsDistanceService: GpsDistanceService) { }

  public setItinerary(itinerary: ItineraryVisual) {
    this.itinerary = itinerary;
    this.$itinerary.next(this.itinerary);
    this.initializeItineraryPoint(itinerary)
  }


  public launchNavigation(launch: boolean) {

    if (launch) {
      this.currentPositionSubscription = this.geolocalisationService.currentPosition$.subscribe(currentPosition => {

        // Recherche du point qui n'a pas encore été visité
        this.nextNavigationPoint = this.navigationPoints.find(point => !point.is_visited);
        this.$nextNavigationPoint.next(this.nextNavigationPoint)

        // Distance entre la position actuelle et le prochain point
        if (currentPosition && this.nextNavigationPoint) {
          this.distanceUntilNextPoint = this.gpsDistanceService.distanceBetween2Points(currentPosition.coords.latitude, currentPosition.coords.longitude, this.nextNavigationPoint.position.lat, this.nextNavigationPoint.position.lng);
          this.$distanceUntilNextPoint.next(this.distanceUntilNextPoint)

          if (this.gpsDistanceService.isPointIsInsideRadiusAroundCurrentLocation(new LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude), 5, this.nextNavigationPoint.position)) {
            this.nextNavigationPoint.is_visited = true;
          }

          // Calculate the distance until the end
          const unexploredNavigationPoints = this.navigationPoints.filter(n => !n.is_visited)
          this.distanceUntilEnd = sum(unexploredNavigationPoints.map(p => p.step.distance))
          if (this.distanceUntilEnd) {this.distanceUntilEnd += this.distanceUntilNextPoint}
          this.$distanceUntilEnd.next(this.distanceUntilEnd);
        }

        // Watch if we finished the navigation
        if (this.nextNavigationPoint == undefined) {
          this.isArrived = true;
        }
        this.$isArrived.next(this.isArrived);
      })
    } else {
      this.currentPositionSubscription.unsubscribe();
    }



  }



  private initializeItineraryPoint(itinerary: ItineraryVisual) {
    this.navigationPoints = [];

    itinerary.itinerary.paths.forEach((path, index) => {

      path.directions.forEach(step => {

        let instruction: string = osrmTextInstructions.compile('en', step)

        if (!instruction.includes("destination")) {

          this.navigationPoints.push(<NavigationPointsModel>{
            position: new LatLng(step.maneuver.location.lat, step.maneuver.location.lon),
            description: instruction,
            is_visited: false,
            step: step,
          })


          console.log(instruction)
        }


      })
    })
  }

}
