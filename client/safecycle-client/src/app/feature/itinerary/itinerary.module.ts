import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItineraryRoutingModule } from './itinerary-routing.module';
import { ItineraryComponent } from './itinerary.component';
import {SharedModule} from "../../shared/shared.module";
import { NewItineraryBarComponent } from './new-itinerary-bar/new-itinerary-bar.component';


@NgModule({
  declarations: [
    ItineraryComponent,
    NewItineraryBarComponent
  ],
  imports: [
    CommonModule,
    ItineraryRoutingModule,
    SharedModule
  ]
})
export class ItineraryModule { }
