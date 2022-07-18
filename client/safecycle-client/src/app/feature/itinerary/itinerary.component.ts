import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {GEO_JSON} from "../../shared/mocks/geojson";
import {Coords, Map, FeatureGroup, LatLng, LeafletMouseEvent} from "leaflet";
import {ItineraryService} from "../../core/service/itinerary.service";
import {ItineraryModel, LatLonElevationModel, PathModel} from "../../core/model/itinerary.model";
import {NominatimAddressModel} from "../../core/model/nominatim-address.model";
import {mergeMap, Observable, pipe, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MapClickService} from "../../core/service/map-click.service";
import {ItineraryVisual} from "../../core/model/itinerary-visual.class";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit, OnDestroy {


  // @ts-ignore
  public map: Map;

  private itinerarySubscription: Subscription = new Subscription();
  private selectedItinerarySubscription: Subscription = new Subscription();

  constructor(private itineraryService: ItineraryService, private mapClickService: MapClickService,private snackBar: MatSnackBar) {}

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

    this.setClickOnMap();
  }


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
        this.map.setView([itinerariesVisual[0].itinerary.paths[0].coords[0].lat, itinerariesVisual[0].itinerary.paths[0].coords[0].lon])

        // Now, we get the selected itinerary
        this.showItineraries(itinerariesVisual)

      }
    }, error => {
      this.itineraryNotFindError(error)
    })
  }


  /**
   * This method show the itineraries, 'underline' the selected itinerary and show the not selected ones in grey
   * @param itinerariesVisual
   */
  private showItineraries(itinerariesVisual: ItineraryVisual[]): void {
    // We remove the old itineraries from the map
    itinerariesVisual.forEach(currentItineraryLayer => {
      if (currentItineraryLayer.segments_on_map != null) {
        currentItineraryLayer.segments_on_map.remove()
      }
    })


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





    console.log(itinerariesVisual)
    // We add the new itineraries to the map
    // First we add the not-seleted itineraries
    itinerariesVisual.forEach(currentItineraryVisual => {
      if (currentItineraryVisual.segments_on_map != null) {
        if (!currentItineraryVisual.is_selectionned) {
          currentItineraryVisual.segments_on_map.addTo(this.map);
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


  public ngOnDestroy() {
    this.itinerarySubscription.unsubscribe();
    this.selectedItinerarySubscription.unsubscribe();
  }


}





