import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CurrencyExchangerService {
  constructor(private http: HttpClient) {}

  //Logic for getting current in specific format
  getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  //Logic for formatting of amount value in an application
  amountFormatter(value: any) {
    if (value != undefined && !isNaN(value) && value != null)
      return parseFloat(value.toFixed(2));
    else return 0;
  }

  //Logic for Consuming the Web API for currency conversion
  getCurrencyExchangeData(
    date: string = this.getCurrentDate(),
    toCurrencyType: string = '',
    fromCurrencyType: string = ''
  ) {
    const headers = new HttpHeaders().set('apikey', environment.apiKey);
    return this.http
      .get<any>(
        environment.baseApiUrl +
          date +
          '?symbols=' +
          toCurrencyType +
          '&base=' +
          fromCurrencyType,
        { headers: headers }
      )
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  //Logic for handling the error
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.log(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
