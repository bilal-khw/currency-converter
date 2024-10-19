import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';  // For testing purpose, replace with actual API service
import { FormControl, FormGroup, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ConversionHistoryDialogComponent } from '../../dialogs/conversion-history-dialog/conversion-history-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient,HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,  // For [(ngModel)]
    MatCardModule,            // For <mat-card>
    MatFormFieldModule,       // For <mat-form-field>
    MatSelectModule,          // For <mat-select> and <mat-option>
    MatInputModule,           // For <input matInput>
    MatButtonModule,          // For <button mat-raised-button>
    MatProgressSpinnerModule,  // For <mat-spinner>
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.css'
})
export class CurrencyConverterComponent implements OnInit {
  loading: boolean = false;
  result: number | null = null;
  conversions: Array<any> = [];

  // Create a FormGroup to group all inputs
  converterForm = new FormGroup({
    fromCurrency: new FormControl('USD'),
    toCurrency: new FormControl('EUR'),
    amount: new FormControl(1)
  });

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    // Subscribe to form changes and debounce them
    this.converterForm.valueChanges
      .pipe(
        debounceTime(500), // Wait for 500ms pause in input
        distinctUntilChanged(), // Only trigger if values changed
        switchMap(value => {
          // Hit API here (replace this with actual API call)
          this.loading = true;
          return this.convertCurrency(String(value.fromCurrency), String(value.toCurrency), Number(value.amount));
        })
      )
      .subscribe(result => {
        this.loading = false;
        this.result = result;
        this.addToHistory();
      });
  }

  // Simulate API call (replace with real HTTP call)
  convertCurrency(fromCurrency: string, toCurrency: string, amount: number) {
    // Simulate an API call by returning an observable
    // In a real-world scenario, you would use HttpClient and call your API here
    return of(amount * 1.1); // Replace with actual conversion logic
  }

  // Add conversion result to history
  addToHistory() {
    const { fromCurrency, toCurrency, amount } = this.converterForm.value;
    this.conversions.push({
      amount: amount,
      from: fromCurrency,
      to: toCurrency,
      result: this.result,
      date: new Date()
    });
  }
  openHistoryDialog(pageIndex: number = 0, pageSize: number = 10): void {
  
    this.http.get(`https://dummyjson.com/products?limit=${pageSize}&skip=${(pageIndex-1)*pageSize}&select=key1,key2,key3%27`)
      .subscribe((response: any) => {
        console.log('fecthed==>',response)
        const dialogRef = this.dialog.open(ConversionHistoryDialogComponent, {
          data: {
            items: response.products,
            totalItems: response.total,
            fetchNewData: (pageIndex: number, pageSize: number) =>{
              console.log(pageIndex,pageSize)
              return this.http.get(`https://dummyjson.com/products?limit=${pageSize}&skip=${(pageIndex-1)*pageSize}&select=key1,key2,key3%27`)
            } 
          },
          width: '400px'
        });
      }, error => {
        console.error('Error fetching conversion history', error);
      });
  }
  
  
  
}