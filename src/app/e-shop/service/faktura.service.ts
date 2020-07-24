import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { timeoutWith, catchError, map } from 'rxjs/operators';
import { AppUtilsService } from '../utils/app-utils.service';
import { Fakutra } from '../model/dto';
import { environment } from 'src/environments/environment';

const DOMAIN_URL = environment.baseUrl + '/api';
const FAKTURA_URL = '/fakture';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';
@Injectable({
  providedIn: 'root'
})
export class FakturaService {

  constructor(private http: HttpClient, private utils: AppUtilsService) { }

  public vratiFaktureKorisnika(page: number, pageSize: number, ppid: number, datumOd: Date, datumDo: Date) {
    const parameterObject = {};
    parameterObject['page'] = page;
    parameterObject['pageSize'] = pageSize;

    if (datumOd) {
      parameterObject['dateFrom'] = datumOd.getTime();
    }
    if (datumDo) {
      parameterObject['dateTo'] = datumDo.getTime();
    }

    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = DOMAIN_URL + FAKTURA_URL + '/' + ppid + parametersString;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public vratiFakturuPojedinacno(id: number, ppid: number) {
    const fullUrl = DOMAIN_URL + FAKTURA_URL + '/' + ppid + '/' + id;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public submitujFakturu(faktura: Fakutra) {
    const fullUrl = DOMAIN_URL + FAKTURA_URL;
    return this.http
      .post(fullUrl, faktura)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }
}
