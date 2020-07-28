import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Credentials, Partner } from '../model/dto';
import { timeoutWith, catchError, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppUtilsService } from '../utils/app-utils.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './data/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { SesijaIsteklaModalComponent } from 'src/app/shared/modal/sesija-istekla-modal/sesija-istekla-modal.component';
import { environment } from 'src/environments/environment';
import { PrvoLogovanjeModalComponent } from 'src/app/shared/modal/prvo-logovanje-modal/prvo-logovanje-modal.component';

const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';

const LOGIN_URL = environment.baseUrl + '/login';
const LOGOUT_URL = environment.baseUrl + '/logout';
const PARTNER_URL = environment.baseUrl + '/api/partner';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private partner: Partner = this.storageServis.procitajPartneraIzMemorije() || null;
  private partnerSubjekat = new BehaviorSubject(this.partner);
  public ulogovaniPartner = this.partnerSubjekat.asObservable();

  private listaSubskripcija: Subscription[] = [];

  private logovanjeSubjekat = new BehaviorSubject(this.partner !== null);
  public daLiJePartnerUlogovan = this.logovanjeSubjekat.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private utils: AppUtilsService,
    private storageServis: LocalStorageService,
    public dialog: MatDialog) { }

  public ulogujSe(credentials: Credentials): Observable<any> {
    const parameterObject = {};
    parameterObject['username'] = credentials.username;
    parameterObject['password'] = credentials.password;
    parameterObject['submit'] = 'Login';
    const parametersString = this.utils.vratiKveriParametre(parameterObject);

    const fullUrl = LOGIN_URL + parametersString;

    return this.http.post(fullUrl, {}, { responseType: 'text' })
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  public vratiUlogovanogKorisnika(daLiJePrviRequest: boolean): Observable<any> {
    const parameterObject = {};
    parameterObject['prviRequest'] = daLiJePrviRequest;
    const parametersString = this.utils.vratiKveriParametre(parameterObject);

    const fullUrl = PARTNER_URL + '/read' + parametersString;

    return this.http.get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error)));
  }

  public setDaLiJeUserLogovan(bool: boolean) {
    this.logovanjeSubjekat.next(bool);
  }

  public setUlogovanogPartner(partner: Partner) {
    this.partnerSubjekat.next(partner);
    this.storageServis.sacuvajPartneraUMemoriju(partner);
  }

  public obavesiPartneraAkoJeSesijaIstekla(userId: string) {
    if (userId === 'false' && this.storageServis.procitajPartneraIzMemorije()) {
      this.router.navigate(['/login']);
      this.izbaciPartnerIzSesije();
    }
  }

  public izbaciPartneraIzSesiseAkoJeUMemoriji() {
   const izbacenKorisnik =  this.vratiUlogovanogKorisnika(false)
      .subscribe(res => {
        const partner = res;
        if (partner === null) {
          const partnerStorage = this.storageServis.procitajPartneraIzMemorije();
          if (partnerStorage !== null && partnerStorage.ppid) {
            this.router.navigate(['/login']);
            this.izbaciPartnerIzSesije();
          }
        } else if (partner.loginCount === 0) {
          this.router.navigate(['/naslovna']);
          this.dialog.open(PrvoLogovanjeModalComponent, {
            width: '600px',
            data: this.partner,
            disableClose: true
          });
          this.unistiSubskripcije();
        }
      });
      this.listaSubskripcija.push(izbacenKorisnik);
  }

  private unistiSubskripcije() {
    this.listaSubskripcija.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }


  public izbaciPartnerIzSesije() {
    this.storageServis.logout();
    this.logovanjeSubjekat.next(false);
    this.partnerSubjekat.next(null);
    this.dialog.open(SesijaIsteklaModalComponent, {
      width: '400px'
    });
  }

  public logout() {
    const fullUrl = LOGOUT_URL;
    const logaoutSubskripcija = this.http.post(fullUrl, {}, { responseType: 'text' })
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      )
      .subscribe(() => {
        this.logovanjeSubjekat.next(false);
        this.partnerSubjekat.next(null);
        this.storageServis.logout();
        this.router.navigateByUrl('naslovna');
        this.unistiSubskripcije();
      });
    this.listaSubskripcija.push(logaoutSubskripcija);
  }
}
