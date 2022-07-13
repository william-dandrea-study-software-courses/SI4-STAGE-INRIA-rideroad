import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItineraryService} from "../../../../core/service/itinerary.service";
import {ItineraryModel} from "../../../../core/model/itinerary.model";
import {Subscription} from "rxjs";
import {ChartConfiguration, ChartOptions} from "chart.js";

@Component({
  selector: 'app-itinerary-card',
  templateUrl: './itinerary-card.component.html',
  styleUrls: ['./itinerary-card.component.scss']
})
export class ItineraryCardComponent implements OnInit, OnDestroy {

  @Input() indexItinerary: string | null = null;
  public indexItineraryNumber: number = 0

  public currentItinerary: ItineraryModel | null = null;
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
    console.log(this.indexItinerary)
    if (this.indexItinerary != null) {
      this.indexItineraryNumber = +this.indexItinerary;
    }

    this.currentItinerarySubscription = this.itineraryService.$itinerary.subscribe(itineraries => {
      if (itineraries != null && this.indexItinerary != null) {
        this.currentItinerary = itineraries[+this.indexItinerary];
        this.setClassVariables(itineraries[+this.indexItinerary], +this.indexItinerary)
      }
    })
  }

  /**
   * Set the variables
   * @param itinerary the curent itinerary
   * @param indexItinerary the index of this itinerary
   */
  private setClassVariables(itinerary: ItineraryModel, indexItinerary: number) {
    this.lengthItineraryInKm = parseFloat((itinerary.length / 1000).toFixed(2))
    this.inflationItinerary = itinerary.filtered_ascend
    this.timeItinerary = new Date(itinerary.time * 1000).toISOString().substr(11, 5).replace(':', 'h ') + 'min'

    this.lineChartData.datasets[0].data = itinerary.altitude_profil
    this.lineChartData.labels = [...Array(itinerary.altitude_profil.length).keys()]
  }



  public onSelectedItinerary(): void {
    if (this.indexItinerary != null)
      this.itineraryService.changeSelectedItinerary(+this.indexItinerary)
  }

  ngOnDestroy(): void {
    this.currentItinerarySubscription.unsubscribe();
  }

}
