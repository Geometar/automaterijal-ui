import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeoutWith, catchError } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { AppUtilsService } from '../utils/app-utils.service';
import { environment } from 'src/environments/environment';
import { Roba, RobaPage } from '../model/dto';
import { Filter } from '../model/filter';

const DOMAIN_URL = environment.baseUrl + '/api';
const ROBA_URL = '/roba';
const FILTERI_URL = '/filteri';
const AKUMULATORI_URL = '/akumulatori';
const ULJA_URL = '/ulja';
const OSTALE_KATEGORIJE_URL = '/kategorije';

const TIMEOUT = 35000;
const TIMEOUT_ERROR = 'Timeout error!';

@Injectable({
  providedIn: 'root'
})
export class RobaService {


  constructor(private http: HttpClient, private utils: AppUtilsService) { }

  public pronadjiDetaljeRobe(robaId: number): Observable<HttpResponse<Object>> {
    const fullUrl = DOMAIN_URL + ROBA_URL + '/' + robaId;
    return this.http
      .get(fullUrl, {observe: 'response'})
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  public sacuvajTekst(roba: Roba) {
    const fullUrl = DOMAIN_URL + ROBA_URL + '/' + roba.robaid;
    return this.http
      .post(fullUrl, roba.tekst)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  public pronadjiSvuRobu(sort: Sort, pageSize, page, searchValue, filter: Filter): Observable<HttpResponse<Object>> {
    const parameterObject = {};
    parameterObject['pageSize'] = pageSize;
    parameterObject['page'] = page;
    if (sort) {
      parameterObject['sortBy'] = sort.active.toLocaleUpperCase();
      parameterObject['sortDirection'] = sort.direction.toLocaleUpperCase();
    }
    if (searchValue) {
      parameterObject['searchTerm'] = searchValue;
    }
    parameterObject['proizvodjac'] = filter.proizvodjacId;
    parameterObject['naStanju'] = filter.naStanju;
    if (filter.grupa) {
      parameterObject['grupa'] = filter.grupa;
    }
    if (filter.pretrazitiGrupe) {
      parameterObject['pretrazitiGrupe'] = filter.pretrazitiGrupe;
    }
    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = DOMAIN_URL + ROBA_URL + parametersString;

    return this.http
      .get(fullUrl, {observe: 'response'})
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  public pronadjiPoKategoriji(
    sort: Sort, pageSize, page, searchValue, filter: Filter, kategorija: string
    ): Observable<HttpResponse<Object>> {
    const parameterObject = {};
    parameterObject['pageSize'] = pageSize;
    parameterObject['page'] = page;
    if (sort) {
      parameterObject['sortBy'] = sort.active.toLocaleUpperCase();
      parameterObject['sortDirection'] = sort.direction.toLocaleUpperCase();
    }
    if (searchValue) {
      parameterObject['searchTerm'] = searchValue;
    }
    parameterObject['proizvodjac'] = filter.proizvodjacId;
    parameterObject['naStanju'] = filter.naStanju;
    if (filter.grupa) {
      parameterObject['grupa'] = filter.grupa;
    }
    if (filter.pretrazitiGrupe) {
      parameterObject['pretrazitiGrupe'] = filter.pretrazitiGrupe;
    }
    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = DOMAIN_URL + OSTALE_KATEGORIJE_URL + '/' + kategorija.toUpperCase() + parametersString;
    return this.http
      .get(fullUrl, {observe: 'response'})
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  public ostaleKategorije(): Observable<any> {
    const fullUrl = DOMAIN_URL + OSTALE_KATEGORIJE_URL;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }
}
