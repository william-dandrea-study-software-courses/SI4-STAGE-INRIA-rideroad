import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
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
import {ItineraryService} from "../../../core/service/itinerary.service";
import {ItineraryModel} from "../../../core/model/itinerary.model";

@Component({
  selector: 'app-new-itinerary-bar',
  templateUrl: './new-itinerary-bar.component.html',
  styleUrls: ['./new-itinerary-bar.component.scss']
})
export class NewItineraryBarComponent implements OnInit, OnDestroy {

  private departureAddress: NominatimAddressModel | null = null;
  private destinationAddress: NominatimAddressModel | null = null;

  public itineraryForm: FormGroup;
  public departureControl = new FormControl('');
  public destinationControl = new FormControl('');
  public departureAPICallIsLoading = false;
  public destinationAPICallIsLoading = false;

  public adressesOptionsDeparture: NominatimAddressModel[] = []
  public adressesOptionsDestination: NominatimAddressModel[] = []

  public currentItinerary: ItineraryModel[] | null = null;
  public indexesCurrentItinerary: number[] = [];
  public currentItinerarySubscription: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder, private autoCompletionAddressService: AutoCompletionAddressService, private snackBar: MatSnackBar, private itineraryService: ItineraryService) {
    this.itineraryForm = this.formBuilder.group({
      departure: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      roadType: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.currentItinerarySubscription = this.itineraryService.$itinerary.subscribe(v => {
      this.currentItinerary = v;
      this.indexesCurrentItinerary = Array.from(Array(v?.length).keys())
    })

    this.initializeDepartureControl();
    this.initializeDestinationControl()
  }

  /**
   * Manage the auto-completion for the departureControl form
   */
  private initializeDepartureControl(): void {
    this.departureControl.valueChanges.pipe(
      filter(res => {
        return res !== null
      }),
      distinctUntilChanged(),
      debounceTime(400),
      tap(() => {
        this.adressesOptionsDeparture = [];
        this.departureAPICallIsLoading = true;
      }),
      switchMap(value =>
        this.autoCompletionAddressService.getAddress(value)
          .pipe(
            finalize(() => {
              this.departureAPICallIsLoading = false;
            })
          )
      )
    ).subscribe((data: NominatimAddressModel[]) => {
      if (data == undefined) {
        this.adressesOptionsDeparture = [];
      } else {
        this.adressesOptionsDeparture = data;
      }
    });
  }


  /**
   * Manage the auto-completion for the destinationControl form
   */
  private initializeDestinationControl(): void {
    this.destinationControl.valueChanges.pipe(
      filter(res => {
        return res !== null
      }),
      distinctUntilChanged(),
      debounceTime(400),
      tap(() => {
        this.adressesOptionsDestination = [];
        this.destinationAPICallIsLoading = true;
      }),
      switchMap(value =>
        this.autoCompletionAddressService.getAddress(value)
          .pipe(
            finalize(() => {
              this.destinationAPICallIsLoading = false;
            })
          )
      )
    ).subscribe((data: NominatimAddressModel[]) => {
      if (data == undefined) {
        this.adressesOptionsDestination = [];
      } else {
        this.adressesOptionsDestination = data;
      }
    });
  }



  /**
   * Called when a user click on the address in the list when he search a new adress
   * @param address we want to affect
   * @param place 0 for departureAddress, 1 for destinationAddress
   */
  public onAddressChange(address: NominatimAddressModel, place: number): void {
    if (place == 0) {
      this.itineraryForm.controls['departure'].setValue(address.display_name);
      this.departureAddress = address;
    }
    if (place == 1) {
      this.itineraryForm.controls['destination'].setValue(address.display_name);
      this.destinationAddress = address;
    }
  }


  /**
   * Method that call the itineraryService for the generation of a new itinerary
   */
  public onSearch(): void {
    if (this.departureAddress != null && this.destinationAddress != null) {
      this.itineraryService.launchSearchItinerary(
        +this.departureAddress.lon,
        +this.departureAddress.lat,
        +this.destinationAddress.lon,
        +this.destinationAddress.lat,
        +this.itineraryForm.value['roadType']
      )
    } else {
      this.itineraryNotFindError()
    }
  }

  /**
   * Handled when the fields are not full
   */
  private itineraryNotFindError(): void {
    this.snackBar.open('Please fill all the forms', 'OK', {
      duration: 5,
    });
  }

  ngOnDestroy(): void {
    this.currentItinerarySubscription.unsubscribe();
  }

}
