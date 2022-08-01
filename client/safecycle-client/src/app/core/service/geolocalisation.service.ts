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
      onSuccess(position)
    },(error) =>{
      onError()
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
