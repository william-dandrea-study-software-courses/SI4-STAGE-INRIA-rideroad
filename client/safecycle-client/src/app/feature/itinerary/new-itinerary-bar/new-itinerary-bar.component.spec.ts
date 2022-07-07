import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItineraryBarComponent } from './new-itinerary-bar.component';

describe('NewItineraryBarComponent', () => {
  let component: NewItineraryBarComponent;
  let fixture: ComponentFixture<NewItineraryBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewItineraryBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewItineraryBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
