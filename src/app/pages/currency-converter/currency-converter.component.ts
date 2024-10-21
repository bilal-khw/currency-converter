import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs'; // For testing purpose, replace with actual API service
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ConversionHistoryDialogComponent } from '../../dialogs/conversion-history-dialog/conversion-history-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CurrencyService } from '../../services/currency-conversion';
import { SERVER_URL } from '../../environment/constants';
@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule, // For [(ngModel)]
    MatCardModule, // For <mat-card>
    MatFormFieldModule, // For <mat-form-field>
    MatSelectModule, // For <mat-select> and <mat-option>
    MatInputModule, // For <input matInput>
    MatButtonModule, // For <button mat-raised-button>
    MatProgressSpinnerModule, // For <mat-spinner>
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.css',
})
export class CurrencyConverterComponent implements OnInit {
  loading: boolean = false;
  result: any = 0;
  conversions: Array<any> = [];
  currencies: string[] = [];
  // Create a FormGroup to group all inputs
  converterForm = new FormGroup({
    fromCurrency: new FormControl('USD'),
    toCurrency: new FormControl('EUR'),
    amount: new FormControl(1),
  });

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe(
      (data) => {
        this.currencies = data;
      },
      (error) => {
        console.error('Error fetching currency data:', error);
      }
    );
    // Subscribe to form changes and debounce them
    this.converterForm.valueChanges
      .pipe(
        debounceTime(500), // Wait for 500ms pause in input
        distinctUntilChanged(), // Only trigger if values changed
        switchMap((value) => {
          if (Number(value.amount) && String(value.fromCurrency) && String(value.toCurrency)) {
            // Hit API here (replace this with actual API call)
            this.loading = true;
            return this.http.get(`${SERVER_URL}/convert`, {
              params: {
                base: String(value.fromCurrency),
                target: String(value.toCurrency),
                amount: Number(value.amount),
              },
            });
          }
          else { return of(0.00) }
        })
      )
      .subscribe((result: any) => {
        console.log(
          '🚀 ~ CurrencyConverterComponent ~ ngOnInit ~ result:',
          result, result.toFixed(2),
          typeof result
        );
        this.loading = false;
        this.result = result.toFixed(2);
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
    let current = localStorage.getItem('history')
      ? JSON.parse(localStorage.getItem('history') || '[]')
      : [];
    current.push({
      fromCurrency,
      toCurrency,
      amount,
      result: this.result,
      datetime: new Date().toISOString(),
    });
    localStorage.setItem('history', JSON.stringify(current));
  }
  openHistoryDialog(): void {
    const dialogRef = this.dialog.open(ConversionHistoryDialogComponent, {
      width: '400px',
      height: "600px"
    });
  }
}
