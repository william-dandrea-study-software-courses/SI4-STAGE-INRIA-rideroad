import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  switchMap,
  filter,
  tap,
  finalize,
  Subscription
} from "rxjs";
import {AutoCompletionAddressService} from "../../../core/service/auto-completion-address.service";
import {NominatimAddressModel} from "../../../core/model/nominatim-address.model";

@Component({
  selector: 'app-new-itinerary-bar',
  templateUrl: './new-itinerary-bar.component.html',
  styleUrls: ['./new-itinerary-bar.component.scss']
})
export class NewItineraryBarComponent implements OnInit {

  private departureAddress: NominatimAddressModel | null = null;
  private destinationAddress: NominatimAddressModel | null = null;

  public itineraryForm: FormGroup;
  public departureControl = new FormControl('');
  public destinationControl = new FormControl('');

  public adressesOptionsDeparture: NominatimAddressModel[] = []
  public adressesOptionsDestination: NominatimAddressModel[] = []

  constructor(private formBuilder: FormBuilder, private autoCompletionAddressService: AutoCompletionAddressService) {
    this.itineraryForm = this.formBuilder.group({
      departure: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      roadType: ['', [Validators.required]],
    })

    this.departureControl.valueChanges.pipe(
      filter(res => {
        return res !== null
      }),
      distinctUntilChanged(),
      debounceTime(400),
      tap(() => {
        this.adressesOptionsDeparture = [];
      }),
      switchMap(value => this.autoCompletionAddressService.getAddress(value))
    ).subscribe((data: NominatimAddressModel[]) => {
        if (data == undefined) {
          this.adressesOptionsDeparture = [];
        } else {
          this.adressesOptionsDeparture = data;
        }
      });

    this.destinationControl.valueChanges.pipe(
      filter(res => res !== null),
      distinctUntilChanged(),
      debounceTime(400),
      tap(() => {this.adressesOptionsDeparture = [];}),
      switchMap(value => this.autoCompletionAddressService.getAddress(value))
    ).subscribe((data: NominatimAddressModel[]) => {
      if (data == undefined) {
        this.adressesOptionsDestination = [];
      } else {
        this.adressesOptionsDestination = data
      }
    })
  }


  ngOnInit(): void {}


  public setDepartureAddress(address: NominatimAddressModel): void {
    this.itineraryForm.controls['departure'].setValue(address.display_name);
    this.departureAddress = address
  }

  public setDestinationAddress(address: NominatimAddressModel): void {
    this.itineraryForm.controls['destination'].setValue(address.display_name);
    this.destinationAddress = address
  }



  public onSearch(): void {

    console.log(this.itineraryForm.value)
    console.log(this.departureAddress)

    if (this.itineraryForm.valid) {
      console.log(this.itineraryForm)
    } else {
      console.log("Please enter all details")
    }
  }

}
