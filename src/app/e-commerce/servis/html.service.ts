import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeoutWith, catchError } from 'rxjs/operators';


const TIMEOUT = 35000;
const TIMEOUT_ERROR = 'Timeout error!';

@Injectable({
  providedIn: 'root'
})
export class HtmlService {

  constructor(private http: HttpClient) { }
  
  public pronadjiDetaljeRobe(url: string): Observable<HttpResponse<any>> {
     return this.http
      .get(url, {observe: 'response', responseType: 'text'})
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }
}
