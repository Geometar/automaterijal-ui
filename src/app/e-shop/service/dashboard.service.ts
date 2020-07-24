import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { timeoutWith, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppUtilsService } from '../utils/app-utils.service';

const DOMAIN_URL = environment.baseUrl + '/api';
const DASHBOARD_URL = '/dashboard';
const SPECIFIKACIJE_URL = '/specifikacije';
const IZDVAJAMO_URL = '/izdvajamo';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private utils: AppUtilsService) { }

  public vratiOsnovnePodatke() {

    const fullUrl = DOMAIN_URL + DASHBOARD_URL + SPECIFIKACIJE_URL;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public vratiORobuIzdvojenuIzPonude(grupa: string) {

    const parameterObject = {};
    parameterObject['grupa'] = grupa;

    const parametersString = this.utils.vratiKveriParametre(parameterObject);
    const fullUrl = DOMAIN_URL + DASHBOARD_URL + IZDVAJAMO_URL + parametersString;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public promeniDashboardRodbu(stariId: number, noviIId: number, grupa: string) {
    const parameterObject = {};
    parameterObject['staraRobaId'] = stariId;
    parameterObject['novaRobaId'] = noviIId;
    parameterObject['grupa'] = grupa;
    const parametersString = this.utils.vratiKveriParametre(parameterObject);

    const fullUrl = DOMAIN_URL + DASHBOARD_URL + IZDVAJAMO_URL + parametersString;
    return this.http.put(fullUrl, null)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }
}
