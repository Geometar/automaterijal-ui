import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { timeoutWith, catchError } from 'rxjs/operators';
import { Korpa, RobaKorpa } from '../../model/porudzbenica';
import { LocalStorageService } from './local-storage.service';
import { Roba } from '../../model/dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const DOMAIN_URL = environment.baseUrl + '/api/informacije/';
const TIMEOUT = 15000;
const TIMEOUT_ERROR = 'Timeout error!';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private korpa: Korpa = this.korpaStorage.vratiKorpuIzMemorije() || new Korpa();
  private korpaSubjekat = new BehaviorSubject(this.korpa);
  public trenutnaKorpa = this.korpaSubjekat.asObservable();

  constructor(private korpaStorage: LocalStorageService, private http: HttpClient) { }

  public inicijalizujKorpu() {
    this.korpa = this.korpaStorage.vratiKorpuIzMemorije() || new Korpa();
    this.korpaSubjekat.next(this.korpa);
  }

  public setKorpu() {
    this.korpa = this.korpaStorage.vratiKorpuIzMemorije() || new Korpa();
  }

  ubaciUKorpu(robaKorpa: RobaKorpa) {
    if (this.korpa.roba.length === 0) {
      this.korpa.roba.push(robaKorpa);
    } else {
      let daLiPostojiVecUKorpi = false;
      this.korpa.roba.forEach(roba => {
        if (roba.katbr === robaKorpa.katbr) {
          roba.kolicina = roba.kolicina + robaKorpa.kolicina;
          roba.cenaUkupno = roba.kolicina * robaKorpa.cenaKom;
          daLiPostojiVecUKorpi = true;
        }
      });
      if (daLiPostojiVecUKorpi === false) {
        this.korpa.roba.push(robaKorpa);
      }
    }
    this.korpaStorage.cuvajKorpuULokalnojMemoriji(robaKorpa);
    this.korpaSubjekat.next(this.korpa);
  }

  public skiniSaStanjaUkolikoJeUKorpi(robaBaza: Roba[]) {
    const korpa = this.korpaStorage.vratiKorpuIzMemorije();
    if (korpa && robaBaza) {
      korpa.roba.forEach((storage: RobaKorpa) => {
        robaBaza.forEach((roba: Roba) => {
          if (storage.katbr === roba.katbr) {
            roba.stanje = roba.stanje - storage.kolicina;
          }
        });
      });
    }
    return robaBaza;
  }
  public izbaciIzKorpe(index: number) {
    this.setKorpu();
    this.korpa.roba.splice(index, 1);
    this.korpaStorage.izbaciIzMemorije(index);
    this.korpaSubjekat.next(this.korpa);
  }

  public vratiOpsteInformacije(vrsta: string): Observable<any> {
    const fullUrl = DOMAIN_URL + vrsta;
    return this.http
      .get(fullUrl)
      .pipe(
        timeoutWith(TIMEOUT, throwError(TIMEOUT_ERROR)),
        catchError((error: any) => throwError(error))
      );
  }

  public ocistiKorpu() {
    this.korpa = new Korpa();
    this.korpaSubjekat.next(this.korpa);
    this.korpaStorage.ocistiKorpuIzMemorije();
  }
}
