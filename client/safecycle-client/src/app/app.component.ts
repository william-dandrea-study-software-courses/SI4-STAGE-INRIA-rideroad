import {Component, ElementRef} from '@angular/core';
import {
  DIRT_ITINERARY_COLOR,
  PEDESTRIAN_ITINERARY_COLOR,
  PROTECTED_ITINERARY_COLOR,
  ROAD_ITINERARY_COLOR
} from "../config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RideRoad - Itinéraire à vélo';

  constructor(private elem: ElementRef) {
    this.elem.nativeElement.style.setProperty('--dirt-itinerary-color', DIRT_ITINERARY_COLOR);
    this.elem.nativeElement.style.setProperty('--protected-itinerary-color', PROTECTED_ITINERARY_COLOR);
    this.elem.nativeElement.style.setProperty('--road-itinerary-color', ROAD_ITINERARY_COLOR);
    this.elem.nativeElement.style.setProperty('--pedestrian-itinerary-color', PEDESTRIAN_ITINERARY_COLOR);
  }
}
