import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {GEO_JSON} from "../../shared/mocks/geojson";
import {Coords, LatLng} from "leaflet";
import {ItineraryService} from "../../core/service/itinerary.service";
import {LatLonElevationModel, PathModel} from "../../core/model/itinerary.model";
import {NominatimAddressModel} from "../../core/model/nominatim-address.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  public map;

  public departureAddress: NominatimAddressModel | null = null;
  public destinationAddress: NominatimAddressModel | null = null;
  public profil: number | null = null;


  constructor(private itineraryService: ItineraryService) { }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this.initMat();

    this.itineraryService.launchSearchItinerary(-1.7629402788039814, 43.37483706661806, -1.5668728515248176, 43.46248423267775, 1);
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

        if (v != null) {
          const allPaths: PathModel[] = v.paths;

          let allSegments = []
          for (let path of allPaths) {
            const allLongLat = path.coords.map(coord => new LatLng(coord.lat, coord.lon, coord.elevation))

            allSegments.push(
              L.polyline(allLongLat, {
                color: path.costs.elevation > 0 ? "blue" : "red",
                weight: 5,
                smoothFactor: 1,
              })
            )
          }

          const itinerary = L.featureGroup(allSegments);
          itinerary.addTo(this.map);
        }


      }, e => {
        console.log("Cannot find the path")
      })
    }

  }

}
