import {Component, OnDestroy, OnInit} from '@angular/core';
import {GeolocalisationService} from "../../core/service/geolocalisation.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogPopupOverComponent} from "../../shared/components/dialog-popup-over/dialog-popup-over.component";
import {Router} from "@angular/router";
import {ItineraryService} from "../../core/service/itinerary.service";

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit, OnDestroy {

  public positionAllowed: boolean = false
  public currentPosition: GeolocationPosition | null = null;

  constructor(private geolocalisationService: GeolocalisationService, private itineraryService: ItineraryService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {

    this.geolocalisationService.startFollowingPosition();

    this.geolocalisationService.currentPosition$.subscribe(position => {
      this.newPositionValue(position)
    });


    if (this.itineraryService.selectedItinerary == null) {
      this.router.navigate(['itinerary']);
    }
  }



  private newPositionValue(position: GeolocationPosition | null) {
    if (position) {
      console.log(position)
      this.currentPosition = position
      this.positionAllowed = true
      this.dialog.closeAll()
    } else {
      this.positionAllowed = false
      this.dialog.open(DialogPopupOverComponent, {
        width: '250px',
        disableClose: true,
      })
    }
  }


  ngOnDestroy() {
    this.geolocalisationService.stopFollowingPosition();
  }

}
