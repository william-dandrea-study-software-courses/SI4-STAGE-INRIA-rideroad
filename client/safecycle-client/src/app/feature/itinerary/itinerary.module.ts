import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItineraryRoutingModule } from './itinerary-routing.module';
import { ItineraryComponent } from './itinerary.component';
import {SharedModule} from "../../shared/shared.module";
import { NewItineraryBarComponent } from './new-itinerary-bar/new-itinerary-bar.component';
import { ItineraryCardComponent } from './intern-sections/itinerary-card/itinerary-card.component';
import {NgChartsModule} from "ng2-charts";
import {PlotlyModule} from "angular-plotly.js";
import { MultiCheckpointsFieldsComponent } from './intern-sections/multi-checkpoints-fields/multi-checkpoints-fields.component';


@NgModule({
  declarations: [
    ItineraryComponent,
    NewItineraryBarComponent,
    ItineraryCardComponent,
    MultiCheckpointsFieldsComponent
  ],
    imports: [
        CommonModule,
        ItineraryRoutingModule,
        SharedModule,
        NgChartsModule,
        PlotlyModule,
    ]
})
export class ItineraryModule { }
