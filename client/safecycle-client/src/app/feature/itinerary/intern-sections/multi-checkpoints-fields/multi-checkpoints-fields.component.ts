import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormArray} from "@angular/forms";
import {debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap} from "rxjs";
import {NominatimAddressModel} from "../../../../core/model/nominatim-address.model";
import {AutoCompletionAddressService} from "../../../../core/service/auto-completion-address.service";
import {LatLng} from "leaflet";
import {ItineraryService} from "../../../../core/service/itinerary.service";

@Component({
  selector: 'app-multi-checkpoints-fields',
  templateUrl: './multi-checkpoints-fields.component.html',
  styleUrls: ['./multi-checkpoints-fields.component.scss']
})
export class MultiCheckpointsFieldsComponent implements OnInit {

  public checkpointForm = this.formBuilder.group({
    checkpoints: this.formBuilder.array([])
  });

  public addressOptionsList: NominatimAddressModel[][] = []
  public isLoadingList: boolean[] = []
  public checkPoints: LatLng[] = []

  constructor(
    private formBuilder: FormBuilder,
    private autoCompletionAddressService: AutoCompletionAddressService,
    private itineraryService: ItineraryService
  ) { }

  ngOnInit(): void {}


  public onAddCheckpoint() {
    const control = <FormArray> this.checkpointForm.controls['checkpoints'];
    const formControl = new FormControl();
    this.initializeFormControl(formControl, this.addressOptionsList.length)
    control.push(formControl)
  }

  public deleteCheckPoint(index: number) {
    let control = <FormArray> this.checkpointForm.controls['checkpoints'];
    control.removeAt(index);

    this.addressOptionsList.splice(index, 1)
    this.isLoadingList.splice(index, 1)
    this.checkPoints.splice(index, 1)
    this.itineraryService.setCheckPoints(this.checkPoints);
  }


  public initializeFormControl(formControl: FormControl, indexArray: number) {
    formControl.valueChanges.pipe(
      filter(res => {
        return res !== null
      }),
      distinctUntilChanged(),
      debounceTime(400),
      tap(() => {
        this.addressOptionsList[indexArray] = [];
        this.isLoadingList[indexArray] = true;
      }),
      switchMap(value =>
        this.autoCompletionAddressService.getAddress(value)
          .pipe(
            finalize(() => {
              this.isLoadingList[indexArray] = false;
            })
          )
      )
    ).subscribe((data: NominatimAddressModel[]) => {
      if (data == undefined) {
        this.addressOptionsList[indexArray] = [];
      } else {
        this.addressOptionsList[indexArray] = data;
      }
    });
  }



  public onAddressChange(address: NominatimAddressModel, index: number) : void {
    this.checkPoints[index] = new LatLng(Number(address.lat), Number(address.lon));
    this.itineraryService.setCheckPoints(this.checkPoints);
  }


  public tst() {
    console.log(this.checkpointForm.value)
    console.log(this.addressOptionsList)
    console.log(this.isLoadingList)
  }


}
