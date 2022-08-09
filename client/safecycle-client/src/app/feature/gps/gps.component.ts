import {Component, OnDestroy, OnInit} from '@angular/core';
import {GeolocalisationService} from "../../core/service/geolocalisation.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogPopupOverComponent} from "../../shared/components/dialog-popup-over/dialog-popup-over.component";

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit, OnDestroy {

  public positionAllowed: boolean = false
  public currentPosition: GeolocationPosition | null = null;

  constructor(private geolocalisationService: GeolocalisationService, public dialog: MatDialog) {}

  ngOnInit(): void {

    this.geolocalisationService.startFollowingPosition();

    this.geolocalisationService.currentPosition$.subscribe(position => {
      this.newPositionValue(position)
    });
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
