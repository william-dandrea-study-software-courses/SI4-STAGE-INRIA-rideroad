import { Component, OnInit } from '@angular/core';
import {EditAmenityService} from "../../../../core/service/edit-amenity.service";
import {AmenityTitle} from "../../../../core/service/amenity.service";
import {FormControl} from "@angular/forms";
import {AmenityEnum} from "../../../../core/model/amenity.model";

@Component({
  selector: 'app-dialog-new-amenity',
  templateUrl: './dialog-new-amenity.component.html',
  styleUrls: ['./dialog-new-amenity.component.scss']
})
export class DialogNewAmenityComponent implements OnInit {

  public bikeServicesRepairStation: {name: string, isSelected: boolean, attribute: string, value: string}[] = [
    {name: 'Reparation', isSelected: true, attribute: "service:bicycle:repair", value: "no"},
    {name: 'Pump', isSelected: true, attribute: "service:bicycle:pump", value: "no"},
    {name: 'Tools', isSelected: true, attribute: "service:bicycle:tools", value: "no"},
  ];



  constructor(private editAmenityService: EditAmenityService) { }

  ngOnInit(): void {

  }


  public onSelectRepairStation(value: {name: string, isSelected: boolean, attribute: string, value: string}) {
    value.isSelected = !value.isSelected;
    value.value = value.isSelected ? "yes" : "no";

  }

  public onValidate() {
    console.log("Validate")
  }


}
