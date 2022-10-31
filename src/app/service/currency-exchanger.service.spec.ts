import { TestBed } from '@angular/core/testing';

import { CurrencyExchangerService } from './currency-exchanger.service';

describe('CurrencyExchangerService', () => {
  let service: CurrencyExchangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyExchangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
