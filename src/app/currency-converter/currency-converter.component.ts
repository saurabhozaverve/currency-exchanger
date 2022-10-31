import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { CurrencyType, ToastrMessageType } from '../constant/enum';
import { data } from '../constant/currencies';

import { CurrencyExchangerService } from '../service/currency-exchanger.service';
import { ToastrMsgService } from '../service/toastr-msg.service';
@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  //Variable and property declaration
  lstCurrency: any = [];
  amount: number = 1;
  inputObject: any = {
    fromCurrencyType: CurrencyType.EUR,
    toCurrencyType: CurrencyType.USD,
  };
  currenyExchangeData: any = null;
  baseConversion: string = '';
  amountConversion: string = '';
  gridIndex: Number[] = [];
  gridDataSet: any[] = [];
  fromCurrencyObject: any = {};
  isAmountValid: boolean = false;

  //Life Cycle Event
  constructor(
    private currencyExchangerService: CurrencyExchangerService,
    private toastrMsgService: ToastrMsgService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  //Life Cycle Event
  ngOnInit(): void {
    this.inputChange();
    this.lstCurrency = data.symbols;
    this.convertCurrency();
    this.initGrid();
    this.rateConvert();
  }

  //Amount input keydown change event
  inputChange() {
    if (this.amount == null || this.amount <= 0) {
      this.isAmountValid = false;
    } else {
      this.isAmountValid = true;
    }
    this.cdr.detectChanges();
  }

  //Logic for initialization of grid values
  initGrid() {
    this.gridIndex = Array(3)
      .fill(0)
      .map((x, i) => i);

    this.fromCurrencyObject = this.lstCurrency.filter(
      (x: any) => x.currency_code == this.inputObject.fromCurrencyType
    )[0];

    for (var i = 0; i <= 9; i++) {
      //@ts-ignore
      this.gridDataSet[i] = {
        fromcurrencyname:
          this.fromCurrencyObject.currency_code +
          ' (' +
          this.fromCurrencyObject.currency_name +
          ')',
        fromcurrencybase: 1 + ' ' + this.fromCurrencyObject.currency_code,
        tocurrencyname:
          this.lstCurrency[i].currency_code +
          ' (' +
          this.lstCurrency[i].currency_name +
          ')',
        tocurrencybase:
          this.currencyExchangerService.amountFormatter(
            1 *
              this.currenyExchangeData?.rates[this.lstCurrency[i].currency_code]
          ) +
          ' ' +
          this.lstCurrency[i].currency_code,
      };
    }
  }

  //Logic for selecting the currency value in grid
  indexMultiplier(outIndex: number = 0, inIndex: number = 0) {
    return (outIndex + 1) * (inIndex + 1);
  }

  //Method for navigation to conversion detail page
  moreDetail() {
    this.router.navigate([
      '/detail/' +
        this.inputObject.fromCurrencyType +
        '/' +
        this.inputObject.toCurrencyType +
        '/' +
        this.amount,
    ]);
  }

  //Logic for swapping of to and from currency values in dropdown
  swapCurrency() {
    this.inputObject.fromCurrencyType =
      this.inputObject.fromCurrencyType + this.inputObject.toCurrencyType;
    this.inputObject.toCurrencyType =
      this.inputObject.fromCurrencyType.substring(
        0,
        this.inputObject.fromCurrencyType.length -
          this.inputObject.toCurrencyType.length
      );
    this.inputObject.fromCurrencyType =
      this.inputObject.fromCurrencyType.substring(
        this.inputObject.toCurrencyType.length
      );
  }

  //Logic for showing base amount conversion and rate conversion for the amount input
  rateConvert() {
    this.baseConversion =
      '1.00 ' +
      this.inputObject.fromCurrencyType +
      ' = ' +
      this.currencyExchangerService.amountFormatter(
        this.currenyExchangeData?.rates[this.inputObject.toCurrencyType]
      ) +
      ' ' +
      this.inputObject.toCurrencyType;
    this.amountConversion =
      this.currencyExchangerService.amountFormatter(
        this.currenyExchangeData?.rates[this.inputObject.toCurrencyType] *
          this.amount
      ) +
      ' ' +
      this.inputObject.toCurrencyType;

    this.initGrid();
  }

  //API call for conversion of currency data
  convertCurrency() {
    var convertedTo = this.inputObject.toCurrencyType;
    for (var currencyIndex = 1; currencyIndex <= 9; currencyIndex++) {
      convertedTo =
        convertedTo + ',' + this.lstCurrency[currencyIndex].currency_code;
    }

    this.currencyExchangerService
      .getCurrencyExchangeData(
        this.currencyExchangerService.getCurrentDate(),
        convertedTo,
        this.inputObject.fromCurrencyType
      )
      .subscribe(
        (data: any) => {
          if (data.success) {
            this.currenyExchangeData = data;
          } else {
            this.toastrMsgService.showToastr(
              'Error',
              'Something went wrong',
              ToastrMessageType.error
            );
            console.log('API Error', data);
          }
          this.rateConvert();
        },
        (err) => {
          this.toastrMsgService.showToastr(
            'Error',
            'Something went wrong',
            ToastrMessageType.error
          );
          console.log('HTTP Error', err);
        }
      );
  }
}
