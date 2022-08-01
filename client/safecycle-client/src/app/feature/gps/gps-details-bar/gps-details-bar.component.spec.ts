import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsDetailsBarComponent } from './gps-details-bar.component';

describe('GpsDetailsBarComponent', () => {
  let component: GpsDetailsBarComponent;
  let fixture: ComponentFixture<GpsDetailsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsDetailsBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsDetailsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
