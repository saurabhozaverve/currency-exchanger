import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';

import { CurrencyExchangerService } from '../service/currency-exchanger.service';
import { ToastrMsgService } from '../service/toastr-msg.service';
import { CurrencyType, ToastrMessageType } from '../constant/enum';
import { data } from '../constant/currencies';
@Component({
  selector: 'app-currency-conversion-detail',
  templateUrl: './currency-conversion-detail.component.html',
  styleUrls: ['./currency-conversion-detail.component.scss'],
})
export class CurrencyConversionDetailComponent implements OnInit {
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
  fromCurrencyObject: any = {};
  isAmountValid: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {};
  chartData: any[] = [];

  //Life Cycle Event
  constructor(
    private currencyExchangerService: CurrencyExchangerService,
    private toastrMsgService: ToastrMsgService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  //Life Cycle Event
  ngOnInit(): void {
    this.lstCurrency = data.symbols;
    this.inputObject.fromCurrencyType = this.route.snapshot.params.fromcurrency;
    this.inputObject.toCurrencyType = this.route.snapshot.params.tocurrency;
    this.amount = this.route.snapshot.params.amount;
    this.fromCurrencyObject = this.lstCurrency.filter(
      (x: any) => x.currency_code == this.inputObject.fromCurrencyType
    )[0];
    this.inputChange();
    this.convertCurrency();
    this.rateConvert();
    this.initChart();
  }

  //Logic for iterate over the last date of every month
  getLastDayForAllMonth() {
    var lastDateArray = [];
    var d = new Date();
    d.setDate(0);
    for (var i = 0; i <= 11; i++) {
      lastDateArray.push(this.endOfMonth(d));

      this.convertCurrency(this.endOfMonth(d), i);
      d.setMonth(d.getMonth() - 1);
    }
    return lastDateArray;
  }

  //Get the last date of month whose date is passed
  endOfMonth(date: any) {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1 <= 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    );
  }

  //Initialize Chart options and default properties
  initChart() {
    this.getLastDayForAllMonth();
    this.chartOptions = {
      chart: {
        renderTo: 'container',
        marginLeft: 100,
      },
      title: {
        text: 'Currency Historical Movement',
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      xAxis: {
        type: 'category',
        min: 0,
      },
      legend: {
        enabled: false,
      },

      series: [
        {
          name: 'Value',
          type: 'column',
          zoneAxis: 'x',
          dataLabels: {
            enabled: true,
            format: '{y:,.2f}',
          },
          dataSorting: {
            enabled: true,
          },
          data: this.chartData,
        },
      ],
    };
  }

  //Back to home navigation method
  back() {
    this.router.navigate(['/']);
  }

  //Amount input keydown change event
  inputChange() {
    if (this.amount == null || this.amount <= 0) {
      this.isAmountValid = false;
    } else {
      this.isAmountValid = true;
    }
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
  }

  //Preparing the data for filled it out in chart
  fillChartData(data: any, monthIndex: number = 0) {
    var lblDateFormat = [];
    var lblDateObj = new Date(new Date().getFullYear(), 12 - monthIndex, 0);
    lblDateFormat.push(
      lblDateObj.toLocaleString('default', { month: 'short' }) +
        ' ' +
        lblDateObj.getFullYear()
    );

    lblDateFormat.push(
      this.currencyExchangerService.amountFormatter(
        //@ts-ignore
        data.rates[this.inputObject.toCurrencyType]
      )
    );
    this.chartData.push(lblDateFormat);
  }

  //API call for conversion of currency data
  convertCurrency(dateObj?: any, monthIndex: number = 0) {
    this.currencyExchangerService
      .getCurrencyExchangeData(
        dateObj,
        this.inputObject.toCurrencyType,
        this.inputObject.fromCurrencyType
      )
      .subscribe(
        (data: any) => {
          if (data.success) {
            if (dateObj == null) this.currenyExchangeData = data;
            else {
              this.fillChartData(data, monthIndex);
            }
            return data;
          } else {
            if (dateObj == null)
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
          if (dateObj == null)
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
