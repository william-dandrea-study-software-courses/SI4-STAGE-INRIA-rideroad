import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AmenityService, AmenityTitle} from "../../../../core/service/amenity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EditAmenityService} from "../../../../core/service/edit-amenity.service";
import {MapClickService} from "../../../../core/service/map-click.service";
import {LatLng} from "leaflet";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {DialogNewAmenityComponent} from "../dialog-new-amenity/dialog-new-amenity.component";
import {AmenityEnum} from "../../../../core/model/amenity.model";

@Component({
  selector: 'app-new-amenity',
  templateUrl: './new-amenity.component.html',
  styleUrls: ['./new-amenity.component.scss']
})
export class NewAmenityComponent implements OnInit, OnDestroy {

  private amenitiesTitleSubscription: Subscription = new Subscription();
  private mapClickSubscription: Subscription = new Subscription();

  public amenities: AmenityTitle[] = [
    {name: 'Drinking Water', isSelected: true, type: AmenityEnum.DRINKING_WATER},
    {name: 'Repair Station', isSelected: false, type: AmenityEnum.BICYCLE_REPAIR_STATION},
    {name: 'Shelter', isSelected: true, type: AmenityEnum.SHELTER},
    {name: 'Toilets', isSelected: true, type: AmenityEnum.TOILETS},
  ];


  public isFocusOn: boolean = false
  public form: FormGroup = this.formBuilder.group({
    location: ["", [Validators.required]],
  });

  public locationMarker: LatLng | null = null;

  constructor(private editAmenityService: EditAmenityService, private snackBar: MatSnackBar, private mapClickService: MapClickService, private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeMapClick()
  }

  public onFocus() {
    this.isFocusOn = !this.isFocusOn;
  }

  private initializeMapClick(): void {
    this.mapClickSubscription = this.mapClickService.$clickPosition.subscribe(pos => {
      if (pos != null) {
        if (this.isFocusOn) {
          this.locationMarker = pos.latlng;
          this.form.controls['location'].setValue(String(this.locationMarker.toString()))
          this.isFocusOn = false;

          this.editAmenityService.setPositionNewAmenity(pos.latlng);

          this.popupNewAmenity();
        }
      }
    })
  }

  private popupNewAmenity() {
    this.dialog.open(DialogNewAmenityComponent)
  }


  ngOnDestroy(): void {
    this.amenitiesTitleSubscription.unsubscribe();
  }

}
