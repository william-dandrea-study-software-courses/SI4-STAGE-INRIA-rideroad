import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormArray} from "@angular/forms";

@Component({
  selector: 'app-multi-checkpoints-fields',
  templateUrl: './multi-checkpoints-fields.component.html',
  styleUrls: ['./multi-checkpoints-fields.component.scss']
})
export class MultiCheckpointsFieldsComponent implements OnInit {

  public checkpointForm = this.formBuilder.group({
    checkpoints: this.formBuilder.array([])
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {}


  public onAddCheckpoint() {
    const control = <FormArray> this.checkpointForm.controls['checkpoints'];
    control.push(new FormControl())
    this.submit()
  }

  public deleteCheckPoint(index: number) {
    let control = <FormArray> this.checkpointForm.controls['checkpoints'];
    control.removeAt(index);

    this.submit();
  }


  public submit() {
    console.log(this.checkpointForm.value)
  }

}
