import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { timeoutWith, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Partner, PromenaSifre } from '../model/dto';
import { AppUtilsService } from '../utils/app-utils.service';
import { environment } from 'src/environments/environment';

const PARTNER_CITANJE_URL = environment.baseUrl + '/api/partner';
const PARTNER_UPDATE_URL = environment.baseUrl + '/api/partner/update';
const RESETOVANJE_SIFRE_URL = '/promena-sifre';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(
    private http: HttpClient,
    private utils: AppUtilsService) { }

  public promeniSifru(reset: PromenaSifre, isPrvaPromena: boolean): Observable<any> {
    const parameterObject = {};
    parameterObject['isPrvaPromena'] = isPrvaPromena;
    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = PARTNER_CITANJE_URL + RESETOVANJE_SIFRE_URL + parametersString;

    return this.http
      .put(fullUrl, reset)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  public updejtujPartnera(partner: Partner, vrstaPromene: string): Observable<Partner> {
    const parameterObject = {};
    parameterObject['vrstaPromene'] = vrstaPromene;
    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = PARTNER_UPDATE_URL + parametersString;

    return this.http
      .put(fullUrl, partner)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }
}
