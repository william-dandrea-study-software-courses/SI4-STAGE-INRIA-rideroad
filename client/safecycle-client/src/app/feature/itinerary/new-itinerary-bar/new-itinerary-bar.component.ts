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

  public itineraryForm: FormGroup;

  departureControl = new FormControl('');
  public filteredOptions: Subscription;

  options: string[] = ['One', 'Two', 'Three'];
  public adressesOptions: NominatimAddressModel[] = []

  constructor(private formBuilder: FormBuilder, private autoCompletionAddressService: AutoCompletionAddressService) {
    this.itineraryForm = this.formBuilder.group({
      departure: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      roadType: ['', [Validators.required]],
    })

    this.filteredOptions = this.departureControl.valueChanges.pipe(
      filter(res => {
        return res !== null && res.length >= 1
      }),
      distinctUntilChanged(),
      debounceTime(400),
      tap(() => {
        this.adressesOptions = [];
      }),
      switchMap(value => this.autoCompletionAddressService.getAddress(value))
    )
      .subscribe((data: NominatimAddressModel[]) => {
        if (data == undefined) {
          this.adressesOptions = [];
        } else {
          this.adressesOptions = data;
        }
        console.log(this.adressesOptions);
      });
  }

  ngOnInit(): void {}



  public onSearch(): void {
    if (this.itineraryForm.valid) {
      console.log(this.itineraryForm)
    } else {
      console.log("Please enter all details")
    }
  }

}
