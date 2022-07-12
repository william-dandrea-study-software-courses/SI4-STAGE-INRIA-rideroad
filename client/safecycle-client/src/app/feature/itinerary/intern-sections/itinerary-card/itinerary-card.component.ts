import {Component, OnDestroy, OnInit} from '@angular/core';
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

  public currentItinerary: ItineraryModel | null = null;
  public currentItinerarySubscription: Subscription;

  public lengthItineraryInKm: number | null = 0;
  public timeItinerary: string | null = null;
  public inflationItinerary: number | null = 0;


  // CHART
  title = 'ng2-charts-demo';

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




  constructor(private itineraryService: ItineraryService) {

    this.currentItinerarySubscription = this.itineraryService.$itinerary.subscribe(v => {
      this.currentItinerary = v;

      if (v != null) {
        this.lengthItineraryInKm = parseFloat((v.length / 1000).toFixed(2))
        this.inflationItinerary = v.filtered_ascend
        // @ts-ignore
        this.timeItinerary = new Date(v.time * 1000).toISOString().substr(11, 8)

        this.lineChartData.datasets[0].data = v.altitude_profil
        this.lineChartData.labels = [...Array(v.altitude_profil.length).keys()]
      }
    })
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.currentItinerarySubscription.unsubscribe();
  }

}
