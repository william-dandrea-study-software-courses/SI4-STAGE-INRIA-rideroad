import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./shared/pages/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./feature/itinerary/itinerary.module').then(m => m.ItineraryModule),
  },
  {
    path: "itinerary",
    loadChildren: () => import('./feature/itinerary/itinerary.module').then(m => m.ItineraryModule),
  },
  {
    path: "gps",
    loadChildren: () => import('./feature/gps/gps.module').then(m => m.GpsModule),
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
