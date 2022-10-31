import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConversionDetailComponent } from './currency-conversion-detail.component';

describe('CurrencyConversionDetailComponent', () => {
  let component: CurrencyConversionDetailComponent;
  let fixture: ComponentFixture<CurrencyConversionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyConversionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConversionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
