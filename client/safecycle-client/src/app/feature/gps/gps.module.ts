import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpsRoutingModule } from './gps-routing.module';
import { GpsDirectionBarComponent } from './gps-direction-bar/gps-direction-bar.component';
import { GpsDetailsBarComponent } from './gps-details-bar/gps-details-bar.component';
import { GpsMapComponent } from './gps-map/gps-map.component';
import {GpsComponent} from "./gps.component";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    GpsComponent,
    GpsDirectionBarComponent,
    GpsDetailsBarComponent,
    GpsMapComponent
  ],
  imports: [
    CommonModule,
    GpsRoutingModule,
    SharedModule
  ]
})
export class GpsModule { }
