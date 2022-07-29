import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {AmenityTitle, AmenityService} from "../../../../core/service/amenity.service";



@Component({
  selector: 'app-amenity-switch-panel',
  templateUrl: './amenity-switch-panel.component.html',
  styleUrls: ['./amenity-switch-panel.component.scss']
})
export class AmenitySwitchPanelComponent implements OnInit {

  public amenities: AmenityTitle[] = []

  constructor(private amenityService: AmenityService) { }

  ngOnInit(): void {
    this.amenityService.$amenitiesTitle.subscribe(amenities => {
      this.amenities = amenities;
    })
  }


  public onSelect(amenity: AmenityTitle) {
    this.amenityService.selectAmenity(amenity)
  }

}
