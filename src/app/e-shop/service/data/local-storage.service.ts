import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { Korpa, RobaKorpa } from '../../model/porudzbenica';
import { Partner } from '../../model/dto';
import * as _ from 'lodash';

const KORPA_KLJUC = 'korpa_roba';
const PARTNER_KLJUC = 'partner_kljuc';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  public sacuvajPartneraUMemoriju(partner: Partner) {
    const partnerCopy = _.cloneDeep(partner);
    if (partnerCopy != null && partnerCopy.ppid != null) {
      partnerCopy.loginCount = null;
      this.storage.set(PARTNER_KLJUC, partnerCopy);
    }
  }

  public logout() {
    this.storage.remove(PARTNER_KLJUC);
  }

  public procitajPartneraIzMemorije(): Partner {
    return this.storage.get(PARTNER_KLJUC);
  }

  public vratiKorpuIzMemorije(): Korpa {
    return this.storage.get(KORPA_KLJUC);
  }

  public cuvajKorpuULokalnojMemoriji(robaKorpa: RobaKorpa) {
    let trenutnaKorpa: Korpa;
    if (this.storage.get(KORPA_KLJUC)) {
      trenutnaKorpa = this.storage.get(KORPA_KLJUC);
      this.ubaciRobuUMemoriju(trenutnaKorpa, robaKorpa);
    } else {
      trenutnaKorpa = new Korpa();
      trenutnaKorpa.roba.push(robaKorpa);
    }

    this.storage.set(KORPA_KLJUC, trenutnaKorpa);
  }

  private ubaciRobuUMemoriju(trenutnaKorpa: Korpa, robaKorpa: RobaKorpa) {
    let daLiPostojiVecUMemoriji = false;
    trenutnaKorpa.roba.forEach(storage => {
      if (storage.katbr === robaKorpa.katbr) {
        storage.kolicina = storage.kolicina + robaKorpa.kolicina;
        storage.cenaUkupno = storage.kolicina * robaKorpa.cenaKom;
        daLiPostojiVecUMemoriji = true;
      }
    });
    if (daLiPostojiVecUMemoriji === false) {
      trenutnaKorpa.roba.push(robaKorpa);
    }
  }

  public izbaciIzMemorije(index: number) {
    const korpa = this.vratiKorpuIzMemorije();
    korpa.roba.splice(index, 1);
    this.storage.set(KORPA_KLJUC, korpa);
  }

  public zameniArtikalSaNovim(robaKorpa: RobaKorpa) {
    const trenutnaKorpa: Korpa = this.storage.get(KORPA_KLJUC);
    trenutnaKorpa.roba.forEach(storage => {
      if (storage.katbr === robaKorpa.katbr) {
        storage.kolicina = robaKorpa.kolicina;
        storage.cenaUkupno = robaKorpa.cenaUkupno;
      }
    });
    this.storage.set(KORPA_KLJUC, trenutnaKorpa);
  }

  public ocistiKorpuIzMemorije() {
    this.storage.remove(KORPA_KLJUC);
  }
}
