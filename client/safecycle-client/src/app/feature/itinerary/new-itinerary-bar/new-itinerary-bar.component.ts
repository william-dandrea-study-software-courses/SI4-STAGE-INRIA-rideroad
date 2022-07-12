import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  Subscription, BehaviorSubject
} from "rxjs";
import {AutoCompletionAddressService} from "../../../core/service/auto-completion-address.service";
import {NominatimAddressModel} from "../../../core/model/nominatim-address.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-new-itinerary-bar',
  templateUrl: './new-itinerary-bar.component.html',
  styleUrls: ['./new-itinerary-bar.component.scss']
})
export class NewItineraryBarComponent implements OnInit {


  @Output() public departureAddress = new EventEmitter<NominatimAddressModel>();
  @Output() public destinationAddress = new EventEmitter<NominatimAddressModel>();
  @Output() public profil = new EventEmitter<number>();
  @Output() public onValidate = new EventEmitter<boolean>();
  // @Output() public onValidate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  private isDepartureAddressInitialized: boolean = false;
  private isDestinationAddressInitialized: boolean = false;
  private isProfilInitialized: boolean = false;

  public itineraryForm: FormGroup;
  public departureControl = new FormControl('');
  public destinationControl = new FormControl('');

  public adressesOptionsDeparture: NominatimAddressModel[] = []
  public adressesOptionsDestination: NominatimAddressModel[] = []

  constructor(private formBuilder: FormBuilder, private autoCompletionAddressService: AutoCompletionAddressService, private snackBar: MatSnackBar) {
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
    this.departureAddress.emit(address);
    this.isDepartureAddressInitialized = true;
  }

  public setDestinationAddress(address: NominatimAddressModel): void {
    this.itineraryForm.controls['destination'].setValue(address.display_name);
    this.destinationAddress.emit(address)
    this.isDestinationAddressInitialized = true;
  }



  public onSearch(): void {

    if (this.itineraryForm.valid && this.isDepartureAddressInitialized && this.isDestinationAddressInitialized) {
      console.log(this.itineraryForm)

      this.profil.emit(+this.itineraryForm.value['roadType'])
      this.onValidate.emit(true);
    } else {
      console.log("Please enter all details")
      this.snackBar.open("Please fill all the forms", "Ok");
    }
  }

}
