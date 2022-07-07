import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItineraryRoutingModule } from './itinerary-routing.module';
import { ItineraryComponent } from './itinerary.component';
import {SharedModule} from "../../shared/shared.module";
import { NewItineraryBarComponent } from './new-itinerary-bar/new-itinerary-bar.component';
import { ItineraryCardComponent } from './intern-sections/itinerary-card/itinerary-card.component';


@NgModule({
  declarations: [
    ItineraryComponent,
    NewItineraryBarComponent,
    ItineraryCardComponent
  ],
  imports: [
    CommonModule,
    ItineraryRoutingModule,
    SharedModule
  ]
})
export class ItineraryModule { }
