import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {NominatimAddressModel} from "../model/nominatim-address.model";
import {NOMINATIM_API_URL} from "../../../config";

@Injectable({
  providedIn: 'root'
})
export class AutoCompletionAddressService {

  constructor(private http: HttpClient) { }

  public getAddress(input: string | null) : Observable<NominatimAddressModel[]> {

    if (input != null ){
      const url = NOMINATIM_API_URL;

      let queryParams = new HttpParams();
      queryParams = queryParams.append("format","jsonv2");
      queryParams = queryParams.append("q", input.replace(/\s/g, '+'));

      return this.http.get<NominatimAddressModel[]>(url, {params:queryParams})

    }

    return new Observable<NominatimAddressModel[]>()
  }


}
