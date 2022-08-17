import {Component, OnDestroy, OnInit} from '@angular/core';
import {GpsService} from "../../../core/service/gps.service";
import {NavigationPointsModel} from "../../../core/model/navigation-points.model";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-gps-direction-bar',
  templateUrl: './gps-direction-bar.component.html',
  styleUrls: ['./gps-direction-bar.component.scss']
})
export class GpsDirectionBarComponent implements OnInit, OnDestroy {

  public nextNavigationPoint: NavigationPointsModel | undefined = undefined;
  public distanceUntilNextPoint: number | undefined = undefined;
  public isArrived: boolean = false;

  private nextNavigationPointSubscription: Subscription | null = null;
  private distanceUntilNextPointSubscription: Subscription | null = null;
  private isArrivedSubscription: Subscription | null = null;

  constructor(private gpsService: GpsService, private router: Router,) { }

  ngOnInit(): void {
    this.nextNavigationPointSubscription = this.gpsService.$nextNavigationPoint.subscribe(nextNavigationPoint => {
      this.newNextNavigationPointValue(nextNavigationPoint);
    })
    this.distanceUntilNextPointSubscription = this.gpsService.$distanceUntilNextPoint.subscribe(distanceUntilNextPoint => {
      this.newDistanceUntilNextPointValue(distanceUntilNextPoint);
    })
    this.isArrivedSubscription = this.gpsService.$isArrived.subscribe(isArrived => {
      this.newIsArrivedValue(isArrived);
    })
  }

  private newNextNavigationPointValue(nextNavigationPoint: NavigationPointsModel | undefined){
    this.nextNavigationPoint = nextNavigationPoint;
  }

  private newDistanceUntilNextPointValue(distanceUntilNextPoint: number | undefined){
    this.distanceUntilNextPoint = distanceUntilNextPoint;
  }

  private newIsArrivedValue(isArrived: boolean){
    this.isArrived = isArrived;
  }

  public leaveGpsMode() {
    this.router.navigate(['itinerary'])
  }


  ngOnDestroy() {
    if (this.nextNavigationPointSubscription) {this.nextNavigationPointSubscription.unsubscribe()}
    if (this.distanceUntilNextPointSubscription) {this.distanceUntilNextPointSubscription.unsubscribe()}
    if (this.isArrivedSubscription) {this.isArrivedSubscription.unsubscribe()}
  }


}
