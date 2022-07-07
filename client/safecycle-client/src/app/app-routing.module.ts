import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./shared/pages/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: "itinerary",
    loadChildren: () => import('./feature/itinerary/itinerary.module').then(m => m.ItineraryModule),
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
