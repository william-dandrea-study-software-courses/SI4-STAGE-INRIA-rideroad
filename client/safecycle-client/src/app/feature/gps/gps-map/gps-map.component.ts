import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from "leaflet";
import {DivIcon, LatLng, Layer, Map, Marker} from "leaflet";
import 'leaflet-rotatedmarker';
import {ItineraryVisual} from "../../../core/model/itinerary-visual.class";
import {GpsService} from "../../../core/service/gps.service";
import {GeolocalisationService} from "../../../core/service/geolocalisation.service";

@Component({
  selector: 'app-gps-map',
  templateUrl: './gps-map.component.html',
  styleUrls: ['./gps-map.component.scss']
})
export class GpsMapComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ts-ignore
  public map: Map;

  private currentItinerary: ItineraryVisual | null = null;

  private currentPosition: GeolocationPosition | null = null;

  private segmentsOnMap: Layer[] = [];
  private currentNavigationMarker: Marker | null = null;

  constructor(private gpsService: GpsService, private geolocalisationService: GeolocalisationService) { }

  ngOnInit(): void {
    this.gpsService.$itinerary.subscribe(itinerary => {
      this.currentItinerary = itinerary;
    });

    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  public ngAfterViewInit(): void {
    this.initialisationMap();


  }


  private setMarkerOnCurrentPosition() {

    this.geolocalisationService.currentPosition$.subscribe(currentPosition => {
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
            iconUrl: "/assets/icons/assistant_navigation.svg"
          }),
          rotationAngle: rotation
        })

        this.currentNavigationMarker.addTo(this.map)
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
      zoom: 14,
    });

    const tiles = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 8,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true,
    });

    tiles.addTo(this.map);

    this.setMarkerOnCurrentPosition();
    this.showItinerary();
  }

  private showItinerary(): void {

    if (this.currentItinerary != null && this.currentItinerary.segments_on_map != null) {
      this.currentItinerary.segments_on_map.addTo(this.map)
      this.segmentsOnMap.push(this.currentItinerary.segments_on_map)
    }


  }

  ngOnDestroy(): void {
  }



}
