import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrencyConverterComponent } from '../app/currency-converter/currency-converter.component';
import { CurrencyConversionDetailComponent } from '../app/currency-conversion-detail/currency-conversion-detail.component';

const routes: Routes = [
  { path: '', component: CurrencyConverterComponent },
  {
    path: 'detail/:fromcurrency/:tocurrency/:amount',
    component: CurrencyConversionDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
