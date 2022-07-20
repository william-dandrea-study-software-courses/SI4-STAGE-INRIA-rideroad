import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCheckpointsFieldsComponent } from './multi-checkpoints-fields.component';

describe('MultiCheckpointsFieldsComponent', () => {
  let component: MultiCheckpointsFieldsComponent;
  let fixture: ComponentFixture<MultiCheckpointsFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiCheckpointsFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiCheckpointsFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
