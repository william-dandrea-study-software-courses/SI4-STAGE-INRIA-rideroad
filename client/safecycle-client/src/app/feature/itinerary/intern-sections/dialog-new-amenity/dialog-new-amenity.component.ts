import { Component, OnInit } from '@angular/core';
import {EditAmenityService} from "../../../../core/service/edit-amenity.service";
import {AmenityTitle} from "../../../../core/service/amenity.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-dialog-new-amenity',
  templateUrl: './dialog-new-amenity.component.html',
  styleUrls: ['./dialog-new-amenity.component.scss']
})
export class DialogNewAmenityComponent implements OnInit {

  public editableAmenities: AmenityTitle[] = [];

  public myControl = new FormControl('');

  constructor(private editAmenityService: EditAmenityService) { }

  ngOnInit(): void {
    this.editAmenityService.$editableAmenitiesTitle.subscribe(amenitiesEditable => {
      this.editableAmenities = amenitiesEditable;
    })
  }


  public onValidate() {
    console.log("Validate")
  }


}
