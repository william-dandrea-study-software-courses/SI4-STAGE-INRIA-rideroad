import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAmenityComponent } from './new-amenity.component';

describe('NewAmenityComponent', () => {
  let component: NewAmenityComponent;
  let fixture: ComponentFixture<NewAmenityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAmenityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
