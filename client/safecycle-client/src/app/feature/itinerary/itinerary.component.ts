import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {Map, LatLng, Marker, Layer} from "leaflet";
import {ItineraryService} from "../../core/service/itinerary.service";
import {PathModel} from "../../core/model/itinerary.model";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MapClickService} from "../../core/service/map-click.service";
import {ItineraryVisual} from "../../core/model/itinerary-visual.class";
import {GeolocalisationService} from "../../core/service/geolocalisation.service";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ts-ignore
  public map: Map;

  private currentDrewLayers: Layer[] = [];

  private itinerarySubscription: Subscription = new Subscription();
  private selectedItinerarySubscription: Subscription = new Subscription();
  private startMarkerSubscription: Subscription = new Subscription();
  private endMarkerSubscription: Subscription = new Subscription();

  private inputUserStartMarker: Marker | null = null;
  private inputUserEndMarker: Marker | null = null;

  constructor(private itineraryService: ItineraryService, private mapClickService: MapClickService,private snackBar: MatSnackBar, private geolocalisationService: GeolocalisationService) {}

  public ngOnInit(): void {
    this.itineraryManager();
    this.setMarkersStartStop();
  }

  public ngAfterViewInit(): void {
    this.initialisationMap();
  }

  /**
   * This method initialize the map with OpenStreetMap and LeafLet. At first, we center the map on our current position
   * (or in Paris if the user don't allow the geo-localisation). And secondly, we call the tileServer (OSM) with LeafLet
   * and we had this tiles to the map (tiles are squares PNG where you can see the map)
   */
  private initialisationMap(): void {
    this.map = L.map('map', {
      center: [ 43.482957, -1.762642 ],
      zoom: 14,
    });

    const tiles = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true
    });

    tiles.addTo(this.map);

    this.centerOnUserPosition();
    this.setClickOnMap();
  }

  /**
   * Method used for initiate the center on the map on the user location, but the user need to allow localisation
   */
  private centerOnUserPosition() {
    this.geolocalisationService.getLocalisation((position: GeolocationPosition) => {
      this.map.setView(new LatLng(position.coords.latitude, position.coords.longitude));
    }, () => {
      this.snackBar.open("Please allow you localisation", '', {duration: 2000,})
    })
  }

  /**
   * Initiate the click on the map, for each click on the map, the clickService will be called and be used in  the
   * other components
   * @private
   */
  private setClickOnMap() {
    this.map.on('click', (v) => {
      this.mapClickService.setClickPosition(v);
    })
  }


  /**
   * This method launch the subscriptions to the itineraryService and selectedItineraryService, and call the methodds for
   * displaying them on the map
   */
  private itineraryManager(): void {
    this.itinerarySubscription = this.itineraryService.$itineraryVisual.subscribe(itinerariesVisual => {

      if (itinerariesVisual != null && itinerariesVisual.length > 0){
        // We set the start point
        this.setItineraryMapView(itinerariesVisual[0]);

        // Now, we get the selected itinerary
        this.generateItineraryPathForMap(itinerariesVisual)
      }
    }, error => {
      this.itineraryNotFindError(error)
    })
  }


  /**
   * This method show the itineraries, 'underline' the selected itinerary and show the not selected ones in grey
   * @param itinerariesVisual
   */
  private generateItineraryPathForMap(itinerariesVisual: ItineraryVisual[]): void {

    // We remove the old itineraries from the map
    this.currentDrewLayers.forEach(currentItineraryLayer => {
      this.map.removeLayer(currentItineraryLayer)
    });
    this.currentDrewLayers = [];

    let indexSelectedItinerary = 0;
    // We generate the paths as layers for the map and add them to the currentItineraryLayers array
    for (let index = 0; index < itinerariesVisual.length; index++) {
      const allPaths: PathModel[] = itinerariesVisual[index].itinerary.paths;
      let allSegments = []

      const opacity: number = itinerariesVisual[index].is_selectionned ? 1.0 : 1.0
      indexSelectedItinerary = itinerariesVisual[index].is_selectionned ? index : indexSelectedItinerary;

      for (let path of allPaths) {
        const allLongLat = path.coords.map(coord => new LatLng(coord.lat, coord.lon, coord.elevation))

        const color: string = itinerariesVisual[index].is_selectionned ? (path.costs.elevation > 0 ? "#2596be" : "#be4d25") : "#b2b2b2"

        allSegments.push(
          L.polyline(allLongLat, {
            color: color,
            weight: 7,
            smoothFactor: 1,
            opacity: opacity,
          })
        )
      }

      itinerariesVisual[index].segments_on_map = L.featureGroup(allSegments);
    }

    this.showItineraryOnMap(itinerariesVisual);
  }

  /**
   * This method show the apth on the map, and we put the selected itinerary at the top of all this path (for more
   * visibility)
   * @param itinerariesVisual : list of itinerary that we want to show on the map
   */
  private showItineraryOnMap(itinerariesVisual: ItineraryVisual[]): void {
    // We add the new itineraries to the map
    // First we add the not-seleted itineraries
    itinerariesVisual.forEach(currentItineraryVisual => {
      if (currentItineraryVisual.segments_on_map != null) {
        if (!currentItineraryVisual.is_selectionned) {
          currentItineraryVisual.segments_on_map.addTo(this.map);
          this.currentDrewLayers.push(currentItineraryVisual.segments_on_map)
          currentItineraryVisual.segments_on_map.on('click', (e) => {
            this.itineraryService.changeSelectedItinerary(currentItineraryVisual.index)
          });
        }
      }
    })

    // And we add the selected itinerary
    itinerariesVisual.forEach(currentItineraryVisual => {
      if (currentItineraryVisual.segments_on_map != null) {
        if (currentItineraryVisual.is_selectionned) {
          currentItineraryVisual.segments_on_map.addTo(this.map);
          this.currentDrewLayers.push(currentItineraryVisual.segments_on_map)
          currentItineraryVisual.segments_on_map.on('click', (e) => {
            this.itineraryService.changeSelectedItinerary(currentItineraryVisual.index)
          });
        }
      }
    })
  }


  /**
   * Handled when the backend return an error
   */
  private itineraryNotFindError(error: any): void {
    this.snackBar.open('Cannot find the path', 'OK', {
      duration: 5,
    });
  }


  /**
   * Method who set the marker on the map when the new itinerary is generated. When the new itinerary is generated, we delete
   * every others markers on the map, and we add this markers. We delete all the other markers for being sure that we
   * don't have several times the same marker
   */
  private setItineraryMapView(itineraryVisual: ItineraryVisual) {
    if (itineraryVisual.startLatLng && itineraryVisual.endLatLng) {
      const startLatLng = itineraryVisual.startLatLng;
      const endLatLng = itineraryVisual.endLatLng;
      this.map.fitBounds(L.latLngBounds(startLatLng, endLatLng));


      let itineraryStartMarker = L.marker(startLatLng, {
        icon: L.icon({
          iconUrl: '/assets/icons/start_marker.png',
          iconSize: [35, 35]
        }),
      })
      itineraryStartMarker.addTo(this.map)

      let itineraryEndMarker = L.marker(endLatLng, {
        icon: L.icon({
          iconUrl: '/assets/icons/start_marker.png',
          iconSize: [35, 35]
        }),
      })
      itineraryEndMarker.addTo(this.map)

      this.currentDrewLayers.push(itineraryStartMarker)
      this.currentDrewLayers.push(itineraryEndMarker)
    }
  }


  /**
   * Method who show the marker at the departure / destination position when a user select a new departure (via the input
   * field or the cursor selector). The inputUserStartMarker and inputUserEndMarker need to be clean (removed from the map)
   * when the user change / remove the destination from the input / cursor
   */
  private setMarkersStartStop() {
    this.startMarkerSubscription = this.itineraryService.$startMarker.subscribe(value => {
      if (this.inputUserStartMarker != null) {
        this.map.removeLayer(this.inputUserStartMarker)
      }

      if (value != null) {
        this.inputUserStartMarker = L.marker(value, {
          icon: L.icon({
            iconUrl: '/assets/icons/start_marker.png',
            iconSize: [35, 35]
          }),
        })

        this.map.addLayer(this.inputUserStartMarker)
        this.map.setView(value);
      }
    })

    this.endMarkerSubscription = this.itineraryService.$endMarker.subscribe(value => {
      if (this.inputUserEndMarker != null) {
        this.map.removeLayer(this.inputUserEndMarker)
      }

      if (value != null) {
        this.inputUserEndMarker = L.marker(value, {
          icon: L.icon({
            iconUrl: '/assets/icons/start_marker.png',
            iconSize: [35, 35]
          }),
        })
        this.map.addLayer(this.inputUserEndMarker)
        this.map.setView(value);
      }
    })
  }


  public ngOnDestroy() {
    this.itinerarySubscription.unsubscribe();
    this.selectedItinerarySubscription.unsubscribe();
    this.startMarkerSubscription.unsubscribe();
    this.endMarkerSubscription.unsubscribe();
  }


}





