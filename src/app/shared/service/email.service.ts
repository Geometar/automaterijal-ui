import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registracija, ResetSifre} from '../../e-shop/model/dto';
import { timeoutWith, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Poruka, Upit } from 'src/app/e-commerce/model/dto';
import { environment } from 'src/environments/environment';

const DOMAIN_URL = environment.baseUrl + '/api/email';
const REGISTRACIJA_URL = '/registracija';
const RESETOVANJE_SIFRE_URL = '/zaboravljena-sifra';
const PORUKA_URL = '/poruka';
const UPIT_URL = '/upit';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient) { }

  public posaljiMailZaRegistraciju(registracija: Registracija): Observable<any> {
    const fullUrl = DOMAIN_URL + REGISTRACIJA_URL;
   return this.http.post(fullUrl, registracija)
    .pipe(
      timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
      catchError((error: any) => throwError(error))
    );
  }

  public posaljiMailZaResetovanjeSifre(email: ResetSifre): Observable<any> {
    const fullUrl = DOMAIN_URL + RESETOVANJE_SIFRE_URL;
   return this.http.post(fullUrl, email)
    .pipe(
      timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
      catchError((error: any) => throwError(error))
    );
  }

  public posaljiPoruku(poruka: Poruka): Observable<any> {
    const fullUrl = DOMAIN_URL + PORUKA_URL;
   return this.http.post(fullUrl, poruka)
    .pipe(
      timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
      catchError((error: any) => throwError(error))
    );
  }

  public posaljiUpit(upit: Upit): Observable<any> {
    const fullUrl = DOMAIN_URL + UPIT_URL;
   return this.http.post(fullUrl, upit)
    .pipe(
      timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
      catchError((error: any) => throwError(error))
    );
  }
}
