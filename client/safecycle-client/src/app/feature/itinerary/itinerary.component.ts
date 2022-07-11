import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {GEO_JSON} from "../../shared/mocks/geojson";
import {LatLng} from "leaflet";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  public map;

  constructor() { }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this.initMat();
  }



  private initMat(): void {
    this.map = L.map('map', {
      center: [ 43.482957, -1.564209 ],
      zoom: 8,
    });

    const tiles = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true
    });

    tiles.addTo(this.map);

    const latLong = GEO_JSON.map(array => {
      return new LatLng(array[1], array[0], array[2]);
    });



    const itin = L.polyline(latLong)
    itin.addTo(this.map)

  }

}
