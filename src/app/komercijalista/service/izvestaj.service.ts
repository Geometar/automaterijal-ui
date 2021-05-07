import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { KreirajIzvestaj } from '../model/dto';
import { timeoutWith, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppUtilsService } from 'src/app/e-shop/utils/app-utils.service';

const DOMAIN_URL = environment.baseUrl + '/api/izvestaj';
const FIRME_URL = '/firme'
const DETALJI_URL = '/detalji'
const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';

@Injectable({
  providedIn: 'root'
})
export class IzvestajService {

  constructor(
    private utils: AppUtilsService,
    private http: HttpClient
  ) { }

  vratiIzvestaje(pretraga: string, page: number, pageSize: number, ppid: number, datumOd: Date, datumDo: Date, komercijalista: number) {
    const parameterObject = {};
    parameterObject['page'] = page;
    parameterObject['pageSize'] = pageSize;

    if (datumOd) {
      parameterObject['dateFrom'] = datumOd.getTime();
    }
    if (datumDo) {
      parameterObject['dateTo'] = datumDo.getTime();
    }
    if (pretraga) {
      parameterObject['trazenaRec'] = pretraga;
    }
    if (komercijalista) {
      parameterObject['komercijalista'] = komercijalista;
    }

    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = DOMAIN_URL + parametersString;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  vratiDetaljeIzvestaja(id: number) {
    const fullUrl = DOMAIN_URL + DETALJI_URL + '/' + id;;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  posaljiIzvestaj(izvestaj: KreirajIzvestaj) {
    const fullUrl = DOMAIN_URL;
    return this.http.post(fullUrl, izvestaj)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  vratiSveFirme() {
    const fullUrl = DOMAIN_URL + FIRME_URL;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }
}
