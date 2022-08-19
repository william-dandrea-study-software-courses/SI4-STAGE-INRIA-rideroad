import {Component, OnDestroy, OnInit} from '@angular/core';
import {GpsService} from "../../../core/service/gps.service";
import {Subscription} from "rxjs";
import {round} from "mathjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-gps-details-bar',
  templateUrl: './gps-details-bar.component.html',
  styleUrls: ['./gps-details-bar.component.scss']
})
export class GpsDetailsBarComponent implements OnInit, OnDestroy {

  private distanceUntilEndSubscription: Subscription | null = null;
  public distanceUntilEnd: number | undefined = undefined;


  constructor(private gpsService: GpsService, private router: Router) {}

  ngOnInit(): void {
    this.distanceUntilEndSubscription = this.gpsService.$distanceUntilEnd.subscribe(distanceUntilEnd => {
      this.newDistanceUntilEndValue(distanceUntilEnd);
    })
  }

  private newDistanceUntilEndValue(distanceUntilEnd: number | undefined) {
    this.distanceUntilEnd = distanceUntilEnd;
    if (this.distanceUntilEnd) {this.distanceUntilEnd = round(this.distanceUntilEnd, 2)}
  }

  public leaveGpsMode() {
    this.router.navigate(['itinerary'])
  }

  ngOnDestroy() {
    if (this.distanceUntilEndSubscription) {this.distanceUntilEndSubscription.unsubscribe();}
  }
}
