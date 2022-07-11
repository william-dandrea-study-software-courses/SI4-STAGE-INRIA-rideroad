import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {GEO_JSON} from "../../shared/mocks/geojson";
import {Coords, LatLng} from "leaflet";
import {ItineraryService} from "../../core/service/itinerary.service";
import {LatLonElevationModel, PathModel} from "../../core/model/itinerary.model";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  public map;


  constructor(private itineraryService: ItineraryService) { }

  public ngOnInit(): void {


  }

  public ngAfterViewInit(): void {
    this.initMat();

    this.itineraryService.getItinerary(-1.762642, 43.373684, -1.62221, 43.389117, 1).subscribe(v => {

      const allPaths: PathModel[] = v.paths
      const allCoord: LatLonElevationModel[] = allPaths.map(v => v.coords).flat()
      const allLongLat = allCoord.map(coord => new LatLng(coord.lat, coord.lon, coord.elevation))

      const itin = L.polyline(allLongLat)
      itin.addTo(this.map)

    })
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

}
