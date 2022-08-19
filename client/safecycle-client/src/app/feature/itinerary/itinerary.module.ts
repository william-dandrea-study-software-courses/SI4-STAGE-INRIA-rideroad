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
import { AmenitySwitchPanelComponent } from './intern-sections/amenity-switch-panel/amenity-switch-panel.component';
import { ItineraryMapComponent } from './itinerary-map/itinerary-map.component';
import { NewAmenityComponent } from './intern-sections/new-amenity/new-amenity.component';
import { DialogNewAmenityComponent } from './intern-sections/dialog-new-amenity/dialog-new-amenity.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonToggleModule} from "@angular/material/button-toggle";


@NgModule({
  declarations: [
    ItineraryComponent,
    NewItineraryBarComponent,
    ItineraryCardComponent,
    MultiCheckpointsFieldsComponent,
    AmenitySwitchPanelComponent,
    ItineraryMapComponent,
    NewAmenityComponent,
    DialogNewAmenityComponent
  ],
    imports: [
        CommonModule,
        ItineraryRoutingModule,
        SharedModule,
        NgChartsModule,
        PlotlyModule,
        MatRadioModule,
        MatButtonToggleModule,
    ]
})
export class ItineraryModule { }
