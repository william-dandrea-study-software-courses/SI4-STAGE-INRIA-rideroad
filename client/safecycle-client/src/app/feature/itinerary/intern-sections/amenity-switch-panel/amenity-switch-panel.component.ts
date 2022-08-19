import {Component, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {AmenityTitle, AmenityService} from "../../../../core/service/amenity.service";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";



@Component({
  selector: 'app-amenity-switch-panel',
  templateUrl: './amenity-switch-panel.component.html',
  styleUrls: ['./amenity-switch-panel.component.scss']
})
export class AmenitySwitchPanelComponent implements OnInit, OnDestroy {

  private amenitiesTitleSubscription: Subscription = new Subscription();
  private amenitiesLoadingSubscription: Subscription = new Subscription();

  public amenities: AmenityTitle[] = []
  public isLoadingAmenities: boolean | Error = false;


  constructor(private amenityService: AmenityService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.amenitiesTitleSubscription = this.amenityService.$amenitiesTitle.subscribe(amenities => {
      this.amenities = amenities;
    });

    this.amenitiesLoadingSubscription = this.amenityService.$isLoadingAmenities.subscribe(isLoading => {
      this.isLoadingAmenities = isLoading;

      if (isLoading instanceof Error) {
        this.snackBar.open("Cannot load amenities, please try to zoom more", "Ok", {duration: 5000})
      }
    })
  }

  public onSelect(amenity: AmenityTitle) {
    this.amenityService.selectAmenity(amenity)
  }

  public onSearch() {
    this.amenityService.downloadAmenities();
  }



  ngOnDestroy(): void {
    this.amenitiesTitleSubscription.unsubscribe();
  }

}
