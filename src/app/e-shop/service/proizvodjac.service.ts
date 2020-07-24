import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { timeoutWith, catchError } from 'rxjs/operators';
import { AppUtilsService } from '../utils/app-utils.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const DOMAIN_URL = environment.baseUrl + '/api';
const ROBA_URL = '/proizvodjaci';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';

@Injectable({
  providedIn: 'root'
})
export class ProizvodjacService {

  constructor(private http: HttpClient, private utils: AppUtilsService) { }

  public pronadjiSveProizvodjace(): Observable<any> {
    const fullUrl = DOMAIN_URL + ROBA_URL;

    return this.http
        .get(fullUrl)
        .pipe(
          timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
          catchError((error: any) => throwError(error))
        );
  }
}
