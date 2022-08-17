import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewAmenityComponent } from './dialog-new-amenity.component';

describe('DialogNewAmenityComponent', () => {
  let component: DialogNewAmenityComponent;
  let fixture: ComponentFixture<DialogNewAmenityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewAmenityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNewAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
