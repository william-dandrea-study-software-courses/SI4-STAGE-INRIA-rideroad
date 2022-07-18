import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItineraryService} from "../../../../core/service/itinerary.service";
import {ItineraryModel} from "../../../../core/model/itinerary.model";
import {Subscription} from "rxjs";
import {ChartConfiguration, ChartOptions} from "chart.js";
import {ItineraryVisual} from "../../../../core/model/itinerary-visual.class";

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
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      }
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
    elements: {
      point: {
        radius: 0
      },
    }
  };
  public lineChartLegend = false;
  // ===============

  constructor(public itineraryService: ItineraryService) {}

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

      this.lineChartData.datasets[0].data = this.currentItinerary.itinerary.altitude_profil
      this.lineChartData.labels = [...Array(this.currentItinerary.itinerary.length).keys()]
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

  ngOnDestroy(): void {
    this.currentItinerarySubscription.unsubscribe();
  }

}
