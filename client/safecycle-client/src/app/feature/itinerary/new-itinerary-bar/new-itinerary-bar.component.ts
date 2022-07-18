import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
  tap,
  finalize,
  Subscription,
} from "rxjs";
import {AutoCompletionAddressService} from "../../../core/service/auto-completion-address.service";
import {NominatimAddressModel} from "../../../core/model/nominatim-address.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ItineraryService} from "../../../core/service/itinerary.service";
import {ItineraryModel} from "../../../core/model/itinerary.model";
import {MapClickService} from "../../../core/service/map-click.service";
import {LatLng} from "leaflet";
import {ItineraryVisual} from "../../../core/model/itinerary-visual.class";

@Component({
  selector: 'app-new-itinerary-bar',
  templateUrl: './new-itinerary-bar.component.html',
  styleUrls: ['./new-itinerary-bar.component.scss']
})
export class NewItineraryBarComponent implements OnInit, OnDestroy {

  private departureAddress: null | LatLng = null;
  private destinationAddress: null | LatLng  = null;

  public itineraryForm: FormGroup;
  public departureControl = new FormControl('');
  public destinationControl = new FormControl('');
  public departureAPICallIsLoading = false;
  public destinationAPICallIsLoading = false;
  public isFocusOnDeparture = false;
  public isFocusOnDestination = false;

  public adressesOptionsDeparture: NominatimAddressModel[] = []
  public adressesOptionsDestination: NominatimAddressModel[] = []

  public currentItinerary: ItineraryVisual[] | null = null;
  public indexesCurrentItinerary: number[] = [];
  public currentItinerarySubscription: Subscription = new Subscription();

  public mapClickSubscription: Subscription = new Subscription();
  public currentClickPosition: LatLng | null = null;

  constructor(private formBuilder: FormBuilder, private autoCompletionAddressService: AutoCompletionAddressService, private snackBar: MatSnackBar, private itineraryService: ItineraryService, private mapClickService: MapClickService) {
    this.itineraryForm = this.formBuilder.group({
      departure: ['', []],
      destination: ['', []],
      roadType: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.currentItinerarySubscription = this.itineraryService.$itineraryVisual.subscribe(v => {
      this.currentItinerary = v;
      this.indexesCurrentItinerary = Array.from(Array(v?.length).keys())
    })

    this.initializeDepartureControl();
    this.initializeDestinationControl();

    this.initializeMapClick();

  }


  /**
   * Initialize the mapp CLick. When the user select focus on one field (departure or destination), the map will listen
   * the position where the user click on the map, and setup the longitude and lattitude with this position for creating
   * new itinerary
   */
  private initializeMapClick(): void {
    this.mapClickSubscription = this.mapClickService.$clickPosition.subscribe(pos => {
      if (pos != null) {
        this.currentClickPosition = pos.latlng;

        if (this.isFocusOnDestination) {
          this.isFocusOnDestination = false;
          this.destinationControl.setValue(`${pos.latlng.lat} ,  ${pos.latlng.lng}`)
          this.destinationAddress = pos.latlng;
          this.itineraryService.setMarkerStart(this.destinationAddress);
        }
        if (this.isFocusOnDeparture) {
          this.isFocusOnDeparture = false;
          this.departureControl.setValue(`${pos.latlng.lat} ,  ${pos.latlng.lng}`)
          this.departureAddress = pos.latlng;
          this.itineraryService.setMarkerEnd(this.departureAddress);
        }
      }
    })
  }


  /**
   * Called when a user click on the input field
   * @param place 0 for departureAddress, 1 for destinationAddress
   */
  public onFocus(place: number) {
    if (place == 0) {
      this.isFocusOnDeparture = !this.isFocusOnDeparture;
    }
    if (place == 1) {
      this.isFocusOnDestination = !this.isFocusOnDestination;
    }
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
      this.departureAddress = new LatLng(Number(address.lat), Number(address.lon));
      this.itineraryService.setMarkerStart(this.departureAddress);
    }
    if (place == 1) {
      this.itineraryForm.controls['destination'].setValue(address.display_name);
      this.destinationAddress = new LatLng(Number(address.lat), Number(address.lon));
      this.itineraryService.setMarkerEnd(this.destinationAddress);
    }
  }


  /**
   * Method that call the itineraryService for the generation of a new itinerary
   */
  public onSearch(): void {
    if (this.departureAddress != null && this.destinationAddress != null) {
      this.itineraryService.launchSearchItinerary(
        +this.departureAddress.lng,
        +this.departureAddress.lat,
        +this.destinationAddress.lng,
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
      duration: 3000,
    });
  }

  ngOnDestroy(): void {
    this.currentItinerarySubscription.unsubscribe();
  }

}
