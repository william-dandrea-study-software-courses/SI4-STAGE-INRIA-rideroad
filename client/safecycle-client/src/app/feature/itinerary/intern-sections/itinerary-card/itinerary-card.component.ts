import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItineraryService} from "../../../../core/service/itinerary.service";
import {ItineraryModel} from "../../../../core/model/itinerary.model";
import {Subscription} from "rxjs";
import {ChartConfiguration, ChartOptions} from "chart.js";
import {ItineraryVisual} from "../../../../core/model/itinerary-visual.class";
import {GpsService} from "../../../../core/service/gps.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-itinerary-card',
  templateUrl: './itinerary-card.component.html',
  styleUrls: ['./itinerary-card.component.scss']
})
export class ItineraryCardComponent implements OnInit, OnDestroy {

  public indexItineraryNumber: number = 0

  @Input() public currentItinerary: ItineraryVisual | null = null;
  public currentItinerarySubscription: Subscription = new Subscription();

  public lengthItineraryInKm: number | null = 0;
  public timeItinerary: string | null = null;
  public inflationItinerary: number | null = 0;


  // CHART
  public graph = {
    data: [
      { x: [0], y: [0], type: 'scatter', mode: 'lines', marker: {} },
    ],
    layout: {
      title: 'Altitude',
      height: 400,
    }
  };
  // ===============

  constructor(public itineraryService: ItineraryService,
              private gpsService: GpsService,
              private router: Router,
              ) {}

  ngOnInit(): void {
    this.setClassVariables();
  }

  /**
   * Set the variables
   */
  private setClassVariables() {
    if (this.currentItinerary != null) {
      this.lengthItineraryInKm = parseFloat((this.currentItinerary.itinerary.length / 1000).toFixed(2))
      this.inflationItinerary = this.currentItinerary.itinerary.filtered_ascend
      this.timeItinerary = new Date(this.currentItinerary.itinerary.time * 1000).toISOString().substr(11, 5).replace(':', 'h ') + 'min'

      this.graph.data[0].y = this.currentItinerary.itinerary.altitude_profil
      this.graph.data[0].x = [...Array(this.currentItinerary.itinerary.length).keys()]
    }
  }

  public getIndex(): number {
    if (this.currentItinerary) {
      return this.currentItinerary.index;
    }
    return 0;
  }

  public isSelected(): boolean {
    if (this.currentItinerary) {
      return this.currentItinerary.is_selectionned;
    }
    return false;
  }

  public onSelectedItinerary(): void {
    if (this.currentItinerary != null)
      this.itineraryService.changeSelectedItinerary(this.currentItinerary.index)
  }

  public launchItinerary(): void {
    console.log("Launch")
    if (this.currentItinerary != null) {
      this.gpsService.setItinerary(this.currentItinerary);
      this.gpsService.launchNavigation(true);
      this.router.navigate(['gps'])
    } else {
      console.log("Cannot Launch Itinerary")
    }
  }

  ngOnDestroy(): void {
    this.currentItinerarySubscription.unsubscribe();
  }

}
