import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as L from 'leaflet';

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
      center: [ 48.858840058739816, 7.073708905917356 ],
      zoom: 18,
    });

    const tiles = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true
    });

    tiles.addTo(this.map);
  }

}
