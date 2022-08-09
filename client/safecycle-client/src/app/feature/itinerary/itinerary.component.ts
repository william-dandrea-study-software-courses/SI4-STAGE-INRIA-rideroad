import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {Map, LatLng, Marker, Layer, LatLngBounds, Content} from "leaflet";
import {ItineraryService} from "../../core/service/itinerary.service";
import {PathModel} from "../../core/model/itinerary.model";
import {merge, Observable, startWith, Subscription} from "rxjs";
import { map } from 'rxjs/operators';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MapClickService} from "../../core/service/map-click.service";
import {ItineraryVisual} from "../../core/model/itinerary-visual.class";
import {GeolocalisationService} from "../../core/service/geolocalisation.service";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";
import {BreakpointObserver, Breakpoints, MediaMatcher} from "@angular/cdk/layout";
import { environment } from 'src/environments/environment';
import {AmenityService} from "../../core/service/amenity.service";

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, AfterViewInit, OnDestroy {

  public getScreenWidth: any;
  public getScreenHeight: any;



  constructor(public dialog: MatDialog,){}

  public ngOnInit(): void {

    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  public ngAfterViewInit(): void {}


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  public ngOnDestroy() {}
}

