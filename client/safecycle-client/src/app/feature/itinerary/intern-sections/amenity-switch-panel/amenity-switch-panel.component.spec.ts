import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenitySwitchPanelComponent } from './amenity-switch-panel.component';

describe('AmenitySwitchPanelComponent', () => {
  let component: AmenitySwitchPanelComponent;
  let fixture: ComponentFixture<AmenitySwitchPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmenitySwitchPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenitySwitchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
