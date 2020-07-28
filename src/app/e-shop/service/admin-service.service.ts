import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppUtilsService } from '../utils/app-utils.service';
import { timeoutWith, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Grupa } from '../model/dto';


const DOMAIN_URL = environment.baseUrl + '/api';
const ADMIN_UTL = '/admin';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http: HttpClient,  private utils: AppUtilsService) { }

  public vratiSvaLogovanja(page: number, pageSize: number) {
    const parameterObject = {};
    parameterObject['page'] = page;
    parameterObject['pageSize'] = pageSize;

    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = DOMAIN_URL + ADMIN_UTL + '/logovanja' + parametersString;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public vratiSveDozvoljeneGrupe() {
    const fullUrl = DOMAIN_URL + ADMIN_UTL + '/dozvoljene_grupe';
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public izbrisiDozvoljenuGrupu(grupaId: string) {
    const fullUrl = DOMAIN_URL + ADMIN_UTL + '/dozvoljene_grupe' + '/' + grupaId;
    return this.http
      .delete(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public vratiSveGrupe() {
    const fullUrl = DOMAIN_URL + ADMIN_UTL + '/grupe';
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public dodajGrupu(grupa: Grupa) {
    const fullUrl = DOMAIN_URL + ADMIN_UTL + '/dozvoljene_grupe';
    return this.http
      .post(fullUrl, grupa)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));

  }

}
