import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-itinerary-bar',
  templateUrl: './new-itinerary-bar.component.html',
  styleUrls: ['./new-itinerary-bar.component.scss']
})
export class NewItineraryBarComponent implements OnInit {

  public itineraryForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.itineraryForm = this.formBuilder.group({
      departure: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      roadType: ['', [Validators.required]],
    })
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
