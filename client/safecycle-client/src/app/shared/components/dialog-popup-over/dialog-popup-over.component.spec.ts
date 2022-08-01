import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPopupOverComponent } from './dialog-popup-over.component';

describe('DialogPopupOverComponent', () => {
  let component: DialogPopupOverComponent;
  let fixture: ComponentFixture<DialogPopupOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPopupOverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPopupOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
