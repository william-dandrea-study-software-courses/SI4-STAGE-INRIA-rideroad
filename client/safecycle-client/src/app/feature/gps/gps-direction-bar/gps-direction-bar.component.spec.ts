import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsDirectionBarComponent } from './gps-direction-bar.component';

describe('GpsDirectionBarComponent', () => {
  let component: GpsDirectionBarComponent;
  let fixture: ComponentFixture<GpsDirectionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsDirectionBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsDirectionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
