import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrategicPlaceRoutingModule } from './strategic-place-routing.module';
import { StrategicPlaceComponent } from './strategic-place.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    StrategicPlaceComponent
  ],
  imports: [
    CommonModule,
    StrategicPlaceRoutingModule,
    SharedModule
  ]
})
export class StrategicPlaceModule { }
