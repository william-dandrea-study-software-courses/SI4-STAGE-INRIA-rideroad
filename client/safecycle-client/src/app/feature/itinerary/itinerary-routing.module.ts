import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ItineraryComponent} from "./itinerary.component";

const routes: Routes = [
  {
    path: '',
    component: ItineraryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItineraryRoutingModule { }
