import { Injectable } from '@angular/core';
import {BehaviorSubject, Subscription, timer} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GeolocalisationService {

  public currentPosition: GeolocationPosition | null = null;
  public currentPosition$: BehaviorSubject<GeolocationPosition | null> = new BehaviorSubject<GeolocationPosition | null>(null);

  public centerOnUser: boolean = true;
  public centerOnUser$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.centerOnUser);

  private timerCurrentPositionSubscription: Subscription = new Subscription();

  constructor() {
    this.getLocalisation();
  }

  public changeCenterOnUser(value: boolean): void {
    this.centerOnUser = value;
    this.centerOnUser$.next(this.centerOnUser)
  }


  public startFollowingPosition() {
    this.timerCurrentPositionSubscription = timer(0, 1000).pipe(
      map(() => {
        this.getLocalisation();
      })
    ).subscribe()
  }

  public stopFollowingPosition() {
    this.timerCurrentPositionSubscription.unsubscribe();
  }

  /**
   * Get the current geoLocalisation of the user
   */
  public getLocalisation(): void {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      this.currentPosition = position;
      this.currentPosition$.next(this.currentPosition)
      console.log(this.currentPosition)
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
