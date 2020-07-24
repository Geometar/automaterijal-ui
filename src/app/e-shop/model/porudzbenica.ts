import { Proizvodjac } from './dto';

export class Korpa {
    public roba: RobaKorpa[] = [];
    public ukupno: number;
    public nacinPlacanja: number;
    public nacinIsporuke: number;
    public napomena: string;
}

export class RobaKorpa {

    public robaid: number;
    public slikaId: string;
    public katbr: string;
    public naziv: string;
    public proizvodjac: Proizvodjac;
    public kolicina: number;
    public rabat: number;
    public cenaKom: number;
    public stanje: number;
    public cenaUkupno: number;
    public zaAnonimusa: boolean;

    constructor(robaid: number, katbr: string, naziv: string, proizvodjac: Proizvodjac,
         kolicina: number, rabat: number, cena: number, stanje: number, slikaId: string, zaAnonimusa: boolean) {
        this.robaid = robaid;
        this.katbr = katbr;
        this.naziv = naziv;
        this.proizvodjac = proizvodjac;
        this.kolicina = kolicina;
        this.rabat = rabat;
        this.cenaKom = cena;
        this.cenaUkupno = cena * kolicina;
        this.stanje = stanje;
        this.slikaId = slikaId;
        this.zaAnonimusa = zaAnonimusa;
    }
}

export class RobaPromena {
    katbr: string = null;
    opis: string = null;
    rapolozivaKolicina: number = null;
    trazenaKolicina: number = null;
}
