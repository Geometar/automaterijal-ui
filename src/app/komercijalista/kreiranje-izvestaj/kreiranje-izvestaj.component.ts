import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, takeWhile } from 'rxjs/operators';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { Firma, KreirajIzvestaj } from '../model/dto';
import { IzvestajService } from '../service/izvestaj.service'

interface Sektor {
  value: string;
  viewValue: string;
}
export const SEKTORI: Sektor[] = [
  { value: 'servis', viewValue: 'Auto Servis' },
  { value: 'transport', viewValue: 'Transport' },
  { value: 'industrija', viewValue: 'Industrija' },
  { value: 'gradjevina', viewValue: 'Gradjevina' },
  { value: 'obrada_metala', viewValue: 'Obrada Metala' },
  { value: 'ostalo', viewValue: 'Ostalo' }
];

@Component({
  selector: 'app-kreiranje-izvestaj',
  templateUrl: './kreiranje-izvestaj.component.html',
  styleUrls: ['./kreiranje-izvestaj.component.scss']
})
export class KreiranjeIzvestajComponent implements OnInit, OnDestroy {
  public izvestajForm: FormGroup;
  public izvestajSubmited = false;

  minDate: Date;

  sektori = SEKTORI;
  firme: Firma[] = [];
  filtriraneFirme: Observable<Firma[]>;

  // boolean za unistavanje observera
  private alive = true;


  izabraniSektor: string;

  constructor(
    private formBuilder: FormBuilder,
    private izvestajServise: IzvestajService,
    private notifikacijaService: NotifikacijaService,
    private loginServis: LoginService,
    private router: Router) {
    const danasjiDatum = new Date();
    this.minDate = new Date(danasjiDatum);
  }

  ngOnInit(): void {
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => {
        if (!partner || partner.privilegije < 2042) {
          this.router.navigate(['/naslovna']);
        }
      });
    this.vratiSveFirme();
    this.inicijalizujForme();
  }

  vratiSveFirme() {
    this.izvestajServise.vratiSveFirme()
      .pipe(
        takeWhile(() => this.alive)
      ).subscribe((firme: Firma[]) => {
        this.firme = firme;
      })
  }

  inicijalizujForme() {
    this.izvestajForm = this.formBuilder.group({
      firmaId: [''],
      ime: ['', [Validators.required, Validators.minLength(3)]],
      mesto: ['', [Validators.required, Validators.minLength(3)]],
      adresa: ['', [Validators.required, Validators.minLength(3)]],
      sektor: ['', [Validators.required]],
      kontakt: ['', [Validators.required, Validators.minLength(3)]],
      konkurenti: ['', [Validators.required, Validators.minLength(3)]],
      asortiman: ['', [Validators.required, Validators.minLength(3)]],
      komentar: ['', [Validators.required, Validators.minLength(3)]],
      datumKreiranja: [new Date(), [Validators.required]],
      podsetnik: [''],
    });

    this.filtriraneFirme = this.izvestaj.ime.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.ime),
        map(ime => ime ? this._filter(ime) : this.firme.slice())
      );
  }

  // slanje izvestaja
  posaljiIzvestaj() {
    this.izvestajSubmited = true;
    if (this.izvestajForm.invalid) {
      return;
    }

    const izvestaj: KreirajIzvestaj = this.popuniIzvestaj();
    this.izvestajServise.posaljiIzvestaj(izvestaj)
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(() => {
        this.notifikacijaService.notify('Izveštaj sačuvan', MatSnackBarKlase.Zelena);
        this.router.navigate(['/izvestaj']);
      });
  }

  // Popunjavanje izvestaja iz forme
  popuniIzvestaj() {
    const izvestaj = new KreirajIzvestaj();
    izvestaj.ime = this.izvestaj.ime.value;
    izvestaj.mesto = this.izvestaj.mesto.value;
    izvestaj.adresa = this.izvestaj.adresa.value;
    izvestaj.sektor = this.izvestaj.sektor.value;
    izvestaj.kontakt = this.izvestaj.kontakt.value;
    izvestaj.osnovniAsortiman = this.izvestaj.asortiman.value;
    izvestaj.konkurent = this.izvestaj.konkurenti.value;
    izvestaj.komentar = this.izvestaj.komentar.value;
    izvestaj.datumKreiranja = (this.izvestaj.datumKreiranja.value as Date).getTime();
    if (this.izvestaj.podsetnik.value) {
      izvestaj.podsetnik = (this.izvestaj.podsetnik.value as Date).getTime();
    }
    if (this.izvestaj.firmaId.value) {
      izvestaj.firmaId = this.izvestaj.firmaId.value;
    }
    return izvestaj;
  }

  // Ako se firma izabere setovati sve ostala polja te firme
  izbranaFirma(izabranaFirme: string) {
    const firma = this.firme.filter((firma: Firma) => firma.ime === izabranaFirme)[0];
    this.izvestajForm.patchValue({
      firmaId: firma.id,
      ime: firma.ime,
      mesto: firma.mesto,
      adresa: firma.adresa,
      sektor: firma.sektor,
      kontakt: firma.kontakt,
      konkurenti: firma.konkurent,
      asortiman: firma.osnovniAsortiman
    });
  }

  // Filtriraj firme - auto complete
  private _filter(name: string): Firma[] {
    const filterValue = name.toLowerCase();

    return this.firme.filter(option => option.ime.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  idiNazad() {
    this.router.navigate(['/izvestaj']);
  }

  // convenience getter for easy access to form fields
  get izvestaj() { return this.izvestajForm.controls; }

}
