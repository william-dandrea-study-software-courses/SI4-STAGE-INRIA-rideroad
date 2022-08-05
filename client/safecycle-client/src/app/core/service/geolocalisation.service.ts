import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeolocalisationService {

  public currentPosition: GeolocationPosition | null = null;
  public currentPosition$: BehaviorSubject<GeolocationPosition | null> = new BehaviorSubject<GeolocationPosition | null>(null);

  constructor() {
    this.getLocalisation();
  }

  /**
   * Get the current geoLocalisation of the user
   */
  public getLocalisation(): void {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      this.currentPosition = position;
      this.currentPosition$.next(this.currentPosition)
      // onSuccess(position)
    },(error) =>{
      this.currentPosition = null;
      this.currentPosition$.next(this.currentPosition)
      // onError();
    },{
      timeout:10000
    })
  }


  public handleLocalisationPermission(onGranted: Function, onPrompt: Function, onDenied: Function): void {
    navigator.permissions.query({name: 'geolocation'}).then((permissionStatus) => {
      if (permissionStatus.state == 'granted') {
        onGranted()
      }
      if (permissionStatus.state == 'prompt') {
        onPrompt()
      }
      if (permissionStatus.state == 'denied') {
        onDenied()
      }
    })
  }


}
