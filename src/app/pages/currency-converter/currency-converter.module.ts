import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyConverterComponent } from './currency-converter.component';
import { CurrencyService } from '../../services/currency-conversion';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [CurrencyConverterComponent],  // Declare the component
  imports: [CommonModule,HttpClientModule],
  providers: [CurrencyService],
  exports: [CurrencyConverterComponent]
})
export class CurrencyConverterModule { }
