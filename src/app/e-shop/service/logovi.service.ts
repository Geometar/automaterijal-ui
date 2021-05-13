import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppUtilsService } from '../utils/app-utils.service';
import { throwError } from 'rxjs';
import { timeoutWith, catchError, map } from 'rxjs/operators';

const DOMAIN_URL = environment.baseUrl + '/api';
const LOGOVI_URL = '/log';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';
@Injectable({
  providedIn: 'root'
})
export class LogoviService {

  constructor(private http: HttpClient, private utils: AppUtilsService) {
   }

   vratiLogove(page: number, pageSize: number, ppid: number) {
    const parameterObject = {};
    parameterObject['page'] = page;
    parameterObject['pageSize'] = pageSize;
    parameterObject['ppid'] = ppid;
    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = DOMAIN_URL + LOGOVI_URL + parametersString;
   return this.http
    .get(fullUrl)
    .pipe(
      timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
      catchError((error: any) => throwError(error)));
  }
}
