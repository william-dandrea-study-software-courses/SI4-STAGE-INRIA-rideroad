import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from "leaflet";
import {Map} from "leaflet";

@Component({
  selector: 'app-gps-map',
  templateUrl: './gps-map.component.html',
  styleUrls: ['./gps-map.component.scss']
})
export class GpsMapComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  public map: Map;

  constructor() { }

  ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    this.initialisationMap();
  }


  private initialisationMap(): void {
    this.map = L.map('map', {
      center: [ 48.86077, 2.29519 ],
      zoom: 14,
    });

    const tiles = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 8,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true,
    });

    tiles.addTo(this.map);

  }

}
