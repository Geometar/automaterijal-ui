import { Injectable } from '@angular/core';
import { Roba, Proizvodjac } from '../model/dto';
import { RobaKorpa, Korpa } from '../model/porudzbenica';
import { DataService } from '../service/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AppUtilsService {

  constructor(private dataService: DataService) { }

  public vratiIdProizvodjacaAkoPostoji(izabraniProizvodjac: string, proizvodjaci: Proizvodjac[]): string {
    let proId = null;
    if (izabraniProizvodjac && izabraniProizvodjac === 'Svi proizvodjači') {
      proId = null;
    } else {
      proizvodjaci.forEach(pr => {
        if (pr.naziv === izabraniProizvodjac) {
          proId = pr.proid;
        }
      });
    }
    return proId;
  }

  public daLiRobaTrebaDaBudeNaStanju(raspolozivost: string[], izabranaRaspolozivost: string): boolean {
    if (raspolozivost && izabranaRaspolozivost === raspolozivost[0]) {
      return false;
    } else {
      return true;
    }
  }

  public dodajUKorpu(roba: Roba): string {
    let snackBarPoruka = 'Artikal je ubacen u korpu.';
    roba.uKorpi = true;
    if (roba.kolicina == null || roba.kolicina <= 0) {
      roba.kolicina = 1;
    }
    if (roba.stanje < roba.kolicina) {
      snackBarPoruka = 'Maksimalan kolicina ' + roba.stanje + '. ' + snackBarPoruka;
      roba.kolicina = roba.stanje;
    }
    const robaKorpa =
      new RobaKorpa(roba.robaid, roba.katbr, roba.naziv, roba.proizvodjac,
        roba.kolicina, roba.rabat, roba.cena, roba.stanje, roba.slika, roba.dozvoljenoZaAnonimusa);
    this.dataService.ubaciUKorpu(robaKorpa);
    return snackBarPoruka;
  }

  public daLiJeRobaUKorpi(korpa: Korpa, roba: Roba[]) {
    roba.forEach((artikal: Roba) => {
      korpa.roba.forEach(r => {
        if (r.katbr === artikal.katbr) {
          artikal.uKorpi  = true;
        }
      });
    });
  }

  public izbrisiRobuSaStanja(roba: Roba[], robaUKorpi: Roba) {
    roba.forEach(robaBaza => {
      if (robaBaza.katbr === robaUKorpi.katbr) {
        robaBaza.stanje = robaBaza.stanje - robaUKorpi.kolicina;
      }
    });
  }

  public vratiKveriParametre(map) {

    let parameterString = '';

    Object.keys(map).forEach(function (elem, index) {
      const value = map[elem];
      if (value != null || value === 0) {
        if (parameterString) {
          parameterString += '&';
        }

        parameterString += elem + '=' + value;
      }
    });

    if (parameterString) {
      parameterString = '?' + parameterString;
    }
    return parameterString;
  }

  public vratiPutDoResursaZaUlje(vrstaUlja): string {
    let url = '/motorna';
    if (vrstaUlja === 'motorna') {
      url = '/motorna';
    } else if (vrstaUlja === 'menjacka') {
      url = '/menjacka';
    } else if (vrstaUlja === 'kociona') {
      url = '/kociona';
    } else if (vrstaUlja === 'antifriz') {
      url = '/antifriz';
    } else if (vrstaUlja === 'hidraulicna') {
      url = '/hidraulicna';
    } else if (vrstaUlja === 'kompresorska') {
      url = '/kompresorska';
    } else if (vrstaUlja === 'redutktorska') {
      url = '/redutktorska';
    } else if (vrstaUlja === 'transformatorska') {
      url = '/transformatorska';
    } else if (vrstaUlja === 'turbinska') {
      url = '/turbinska';
    } else if (vrstaUlja === 'pneumatska') {
      url = '/pneumatska';
    } else if (vrstaUlja === 'klizna') {
      url = '/klizna';
    } else if (vrstaUlja === 'prenosna') {
      url = '/prenosna';
    } else if (vrstaUlja === 'industrija') {
      url = '/industrija';
    }
    return url;
  }
}
