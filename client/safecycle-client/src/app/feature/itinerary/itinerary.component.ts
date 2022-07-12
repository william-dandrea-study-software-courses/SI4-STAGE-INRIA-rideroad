import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {GEO_JSON} from "../../shared/mocks/geojson";
import {Coords, FeatureGroup, LatLng} from "leaflet";
import {ItineraryService} from "../../core/service/itinerary.service";
import {LatLonElevationModel, PathModel} from "../../core/model/itinerary.model";
import {NominatimAddressModel} from "../../core/model/nominatim-address.model";
import {Observable} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  public map;
  public currentItineraryLayers: FeatureGroup[] = [];

  public departureAddress: NominatimAddressModel | null = null;
  public destinationAddress: NominatimAddressModel | null = null;
  public profil: number | null = null;


  constructor(private itineraryService: ItineraryService, private snackBar: MatSnackBar) { }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this.initMat();

    // this.itineraryService.launchSearchItinerary(-1.7629402788039814, 43.37483706661806, -1.5668728515248176, 43.46248423267775, 1);
    // La : 43.37483706661806, Lo : -1.7629402788039814
    // La : 43.46248423267775, Lo -1.5668728515248176
  }

  private initMat(): void {
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


  public onDepartureAddress(event: NominatimAddressModel) {
    console.log(event)
    this.departureAddress = event;
  }
  public onDestinationAddress(event: NominatimAddressModel) {
    this.destinationAddress = event;
  }

  public onProfil(event: number) {
    this.profil = event;
  }

  public onValidate(event: boolean) {

    if (this.departureAddress != null && this.destinationAddress != null && this.profil != null) {
      this.itineraryService.launchSearchItinerary(+this.departureAddress?.lon, +this.departureAddress?.lat, +this.destinationAddress?.lon, +this.destinationAddress?.lat, +this.profil);

      this.itineraryService.$itinerary.subscribe(v => {

        if (v != null){
          this.map.setView([v[0].paths[0].coords[0].lat, v[0].paths[0].coords[0].lon])
        }

        this.itineraryService.$selectedItinerary.subscribe(selected => {
          if (v != null) {
            this.currentItineraryLayers.forEach(cil => cil.remove())
            this.currentItineraryLayers = [];



            for (let index = 0; index < v.length; index++) {
              const allPaths: PathModel[] = v[index].paths;
              let allSegments = []

              const opacity: number = index == selected ? 1.0 : 0.35


              for (let path of allPaths) {
                const allLongLat = path.coords.map(coord => new LatLng(coord.lat, coord.lon, coord.elevation))
                const color: string = index == selected ? (path.costs.elevation > 0 ? "#2596be" : "#be4d25") : "grey"


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

            this.currentItineraryLayers.forEach(cil => cil.addTo(this.map))
          }
        })

      }, error => {
        this.snackBar.open('Cannot find the path', 'OK');
      })
    }

  }

}
