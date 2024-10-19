import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyConverterComponent } from './currency-converter.component';



@NgModule({
  declarations: [CurrencyConverterComponent],  // Declare the component
  imports: [CommonModule],
  exports: [CurrencyConverterComponent] 
})
export class CurrencyConverterModule { }
