import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsMapComponent } from './gps-map.component';

describe('GpsMapComponent', () => {
  let component: GpsMapComponent;
  let fixture: ComponentFixture<GpsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
