import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicPlaceComponent } from './strategic-place.component';

describe('StrategicPlaceComponent', () => {
  let component: StrategicPlaceComponent;
  let fixture: ComponentFixture<StrategicPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicPlaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategicPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
