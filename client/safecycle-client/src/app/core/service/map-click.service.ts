import { Injectable } from '@angular/core';
import {LeafletMouseEvent, Map} from "leaflet";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapClickService {

  public clickPosition: LeafletMouseEvent | null = null;
  public $clickPosition: BehaviorSubject<LeafletMouseEvent | null> = new BehaviorSubject<LeafletMouseEvent | null>(null);

  constructor() {}

  public setClickPosition(event: LeafletMouseEvent) {
    this.clickPosition = event;
    this.$clickPosition.next(this.clickPosition)
  }

}
