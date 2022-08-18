import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {EditAmenityService} from "../../../../core/service/edit-amenity.service";
import {AmenityTitle} from "../../../../core/service/amenity.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AmenityEnum} from "../../../../core/model/amenity.model";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-dialog-new-amenity',
  templateUrl: './dialog-new-amenity.component.html',
  styleUrls: ['./dialog-new-amenity.component.scss']
})
export class DialogNewAmenityComponent implements OnInit {

  public bikeServicesRepairStation: {name: string, isSelected: boolean, attribute: string, value: string}[] = [
    {name: 'Reparation', isSelected: false, attribute: "service:bicycle:repair", value: "no"},
    {name: 'Pump', isSelected: false, attribute: "service:bicycle:pump", value: "no"},
    {name: 'Tools', isSelected: false, attribute: "service:bicycle:tools", value: "no"},
  ];

  public drinkingWaterForm: FormGroup = this.formBuilder.group({
    drinking_water_access: ["public"],
    drinking_water_fee: ["no"]
  })

  public repairStationForm: FormGroup = this.formBuilder.group({
    repair_station_fee: ["free"],
    repair_station_services: [[]]
  })

  public shelterForm: FormGroup = this.formBuilder.group({
    shelter_bench: ["no"],
    shelter_bin: ["no"]
  })

  public toiletsForm: FormGroup = this.formBuilder.group({
    toilets_disposal: ["dry"],
    toilets_access: ["public"],
    toilets_gender: ["unisex"],
  })

  public osmLoginForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  private selectedTabGroupIndex: string = "drinking_water";

  constructor(private editAmenityService: EditAmenityService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {}

  public onSelectRepairStation(value: {name: string, isSelected: boolean, attribute: string, value: string}) {
    value.isSelected = !value.isSelected;
    value.value = value.isSelected ? "yes" : "no";

    this.repairStationForm.controls['repair_station_services'].setValue(this.bikeServicesRepairStation)
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0: {
        this.selectedTabGroupIndex = "drinking_water";
      } break;
      case 1: {
        this.selectedTabGroupIndex = "repair_station";
      } break;
      case 2: {
        this.selectedTabGroupIndex = "shelter";
      } break;
      case 3: {
        this.selectedTabGroupIndex = "toilets";
      } break;
    }
  }

  public onValidate() {
    console.log(this.selectedTabGroupIndex)

    if (this.selectedTabGroupIndex === "drinking_water") {
      this.editAmenityService.addNewDrinkingWater(
        this.osmLoginForm.value['email'],
        this.osmLoginForm.value['password'],
        this.drinkingWaterForm.value['drinking_water_access'],
        this.drinkingWaterForm.value['drinking_water_fee'],
        )
    }

    if (this.selectedTabGroupIndex === "repair_station") {

      const servicesDict: {attribute: string, value: string}[] = []
      this.bikeServicesRepairStation.forEach(serv => servicesDict.push({attribute: serv.attribute, value: serv.value}))

      this.editAmenityService.addNewRepairStation(
        this.osmLoginForm.value['email'],
        this.osmLoginForm.value['password'],
        this.repairStationForm.value['repair_station_fee'],
        servicesDict
        );

    }

    if (this.selectedTabGroupIndex === "shelter") {
      this.editAmenityService.addNewShelter(
        this.osmLoginForm.value['email'],
        this.osmLoginForm.value['password'],
        this.shelterForm.value['shelter_bench'],
        this.shelterForm.value['shelter_bin'],
      )
    }

    if (this.selectedTabGroupIndex === "toilets") {
      this.editAmenityService.addNewToilets(
        this.osmLoginForm.value['email'],
        this.osmLoginForm.value['password'],
        this.toiletsForm.value['toilets_disposal'],
        this.toiletsForm.value['toilets_access'],
        this.toiletsForm.value['toilets_gender'],
      )
    }


  }
}
