import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {GEO_JSON} from "../../shared/mocks/geojson";
import {Coords, Map, FeatureGroup, LatLng} from "leaflet";
import {ItineraryService} from "../../core/service/itinerary.service";
import {ItineraryModel, LatLonElevationModel, PathModel} from "../../core/model/itinerary.model";
import {NominatimAddressModel} from "../../core/model/nominatim-address.model";
import {mergeMap, Observable, pipe, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit, OnDestroy {


  // @ts-ignore
  public map: Map;
  public currentItineraryLayers: FeatureGroup[] = [];

  private itinerarySubscription: Subscription = new Subscription();
  private selectedItinerarySubscription: Subscription = new Subscription();

  constructor(private itineraryService: ItineraryService, private snackBar: MatSnackBar) {}

  public ngOnInit(): void {
    this.itineraryManager();
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
  }


  /**
   * This method launch the subscriptions to the itineraryService and selectedItineraryService, and call the methodds for
   * displaying them on the map
   */
  private itineraryManager(): void {

    this.itinerarySubscription = this.itineraryService.$itinerary.subscribe(itineraries => {

      if (itineraries != null && itineraries.length > 0){
        // We set the start point
        this.map.setView([itineraries[0].paths[0].coords[0].lat, itineraries[0].paths[0].coords[0].lon])

        // Now, we get the selected itinerary
        this.selectedItinerarySubscription = this.itineraryService.$selectedItinerary.subscribe(selectedItinerary => {
          this.showItineraries(itineraries, selectedItinerary)
        })
      }
    }, error => {
      this.itineraryNotFindError(error)
    })
  }


  /**
   * This method show the itineraries, 'underline' the selected itinerary and show the not selected ones in grey
   * @param itineraries : list of itineraries
   * @param selectedItinerary
   */
  private showItineraries(itineraries: ItineraryModel[], selectedItinerary: number): void {
    // We remove the old itineraries from the map
    this.currentItineraryLayers.forEach(currentItineraryLayer => currentItineraryLayer.remove())
    this.currentItineraryLayers = [];

    // We generate the paths as layers for the map and add them to the currentItineraryLayers array
    for (let index = 0; index < itineraries.length; index++) {
      const allPaths: PathModel[] = itineraries[index].paths;
      let allSegments = []

      const opacity: number = index == selectedItinerary ? 1.0 : 0.35

      for (let path of allPaths) {
        const allLongLat = path.coords.map(coord => new LatLng(coord.lat, coord.lon, coord.elevation))

        const color: string = index == selectedItinerary ? (path.costs.elevation > 0 ? "#2596be" : "#be4d25") : "grey"

        allSegments.push(
          L.polyline(allLongLat, {
            color: color,
            weight: 7,
            smoothFactor: 1,
            opacity: opacity,
          })
        )
      }

      let itinerary = L.featureGroup(allSegments);
      this.currentItineraryLayers.push(itinerary)
    }

    // We add the new itineraries to the map
    this.currentItineraryLayers.forEach(currentItineraryLayer => currentItineraryLayer.addTo(this.map))
  }



  /**
   * Handled when the backend return an error
   */
  private itineraryNotFindError(error: any): void {
    this.snackBar.open('Cannot find the path', 'OK', {
      duration: 5,
    });
  }


  public ngOnDestroy() {
    this.itinerarySubscription.unsubscribe();
    this.selectedItinerarySubscription.unsubscribe();
  }


}





