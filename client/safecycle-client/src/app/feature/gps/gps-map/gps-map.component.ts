import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from "leaflet";
import {DivIcon, FeatureGroup, LatLng, Layer, Map, Marker} from "leaflet";
import 'leaflet-rotatedmarker';
import {ItineraryVisual} from "../../../core/model/itinerary-visual.class";
import {GpsService} from "../../../core/service/gps.service";
import {GeolocalisationService} from "../../../core/service/geolocalisation.service";
import {Subscription} from "rxjs";
import {ASSISTANT_NAVIGATION_ICON, MARKER_ICON_SIZE} from "../../../../config";

declare var require: any
const osrmTextInstructions = require('osrm-text-instructions')('v5');


@Component({
  selector: 'app-gps-map',
  templateUrl: './gps-map.component.html',
  styleUrls: ['./gps-map.component.scss']
})
export class GpsMapComponent implements OnInit, AfterViewInit, OnDestroy {

  private itinerarySubscription: Subscription | null = null;
  private currentPositionSubscription: Subscription | null = null;

  // @ts-ignore
  public map: Map;

  private currentItinerary: ItineraryVisual | null = null;

  private currentPosition: GeolocationPosition | null = null;

  private segmentsOnMap: Layer[] = [];
  private currentNavigationMarker: Marker | null = null;


  constructor(private gpsService: GpsService, private geolocalisationService: GeolocalisationService) { }

  ngOnInit(): void {
    this.itinerarySubscription = this.gpsService.$itinerary.subscribe(itinerary => {
      this.currentItinerary = itinerary;
    });


  }

  public ngAfterViewInit(): void {
    this.initialisationMap();
  }


  private setMarkerOnCurrentPosition() {

    if (this.currentPositionSubscription) {this.currentPositionSubscription.unsubscribe()}
    this.currentPositionSubscription = this.geolocalisationService.currentPosition$.subscribe(currentPosition => {
      this.currentPosition = currentPosition;

      if (this.currentPosition) {
        if (this.currentNavigationMarker) {
          this.currentNavigationMarker.removeFrom(this.map);
          this.currentNavigationMarker = null;
        }

        const currentPositionForMarker: LatLng = new LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude)

        const rotation = this.currentPosition.coords.heading ? this.currentPosition.coords.heading : 0;

        this.currentNavigationMarker = new L.Marker(currentPositionForMarker, {
          icon: new L.Icon({
            iconUrl: ASSISTANT_NAVIGATION_ICON,
            // @ts-ignore
            iconSize: MARKER_ICON_SIZE,
          }),
          rotationAngle: rotation
        })

        this.currentNavigationMarker.addTo(this.map)
        this.map.setView(currentPositionForMarker)
      }
    })
  }


  private initialisationMap(): void {

    const coordinatesCenter: LatLng = new LatLng(48.86077, 2.29519 );
    if (this.geolocalisationService.currentPosition) {
      coordinatesCenter.lat = this.geolocalisationService.currentPosition.coords.latitude;
      coordinatesCenter.lng = this.geolocalisationService.currentPosition.coords.longitude;
    }

    this.map = L.map('gps-map', {
      center: coordinatesCenter,
      zoom: 18,
    });

    const tiles = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 8,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true,
    });

    tiles.addTo(this.map);

    this.setMarkerOnCurrentPosition();
    this.showItinerary();
  }

  private showItinerary(): void {


    if (this.currentItinerary != null) {


      const allSegments: L.Polyline[] = [];

      this.currentItinerary.itinerary.paths.forEach(path => {
        const allLongLat = path.coords.map(coord => new LatLng(coord.lat, coord.lon, coord.elevation))

        let color: string = "#8291ff";
        let opacity: number = 1.0;


        const line: L.Polyline = L.polyline(allLongLat, { color: color,  weight: 7,  smoothFactor: 1,  opacity: opacity,})
        const valueString = JSON.stringify(path.tags) + "<br>"

        line.bindTooltip(valueString);

        allSegments.push( line );
      });

      this.segmentsOnMap.forEach(seg => seg.removeFrom(this.map));
      this.segmentsOnMap.push(L.featureGroup(allSegments));
      this.segmentsOnMap.forEach(seg => seg.addTo(this.map));
    }
  }








  ngOnDestroy(): void {
    if (this.itinerarySubscription) {this.itinerarySubscription.unsubscribe()}
    if (this.currentPositionSubscription) {this.currentPositionSubscription.unsubscribe()}
  }



}
