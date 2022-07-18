import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocalisationService {

  constructor() { }


  /**
   * Get the current geoLocalisation of the user
   * @param onSuccess : user authorize the localisation feature, you get the position from onSuccess
   * @param onError : user don't authorize the localisation feature
   */
  public getLocalisation(onSuccess: Function, onError: Function): void {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      console.log(position)
      onSuccess(position)
    },(error) =>{
      console.log("Position not allowed")
      onError()
    },{
      timeout:10000
    })
  }

}
