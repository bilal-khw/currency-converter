import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from '../environment/constants';

@Injectable({
  providedIn: 'root',
})

export class CurrencyService {
  private apiUrl = SERVER_URL

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<any> {
    return this.http.get(this.apiUrl+'/list-currency');
  }
}
