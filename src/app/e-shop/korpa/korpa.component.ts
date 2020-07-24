import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { DataService } from '../service/data/data.service';
import { Korpa, RobaKorpa } from '../model/porudzbenica';
import { LocalStorageService } from '../service/data/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ValueHelp, Partner, Fakutra, FakturaDetalji, Roba } from '../model/dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { FakturaService } from '../service/faktura.service';
import { Router } from '@angular/router';
import { UspesnoPorucivanjeModalComponent } from 'src/app/shared/modal/uspesno-porucivanje-modal/uspesno-porucivanje-modal.component';
import { NeuspesnoPorucivanjeModalComponent } from 'src/app/shared/modal/neuspesno-porucivanje-modal/neuspesno-porucivanje-modal.component';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';

@Component({
  selector: 'app-korpa',
  templateUrl: './korpa.component.html',
  styleUrls: ['./korpa.component.scss']
})
export class KorpaComponent implements OnInit, OnDestroy {

  public korpa: Korpa;
  public partner: Partner;
  public bezPdv: string;
  public pdv: string;

  public ukupno: string;
  public dataSource: any;
  public nacinPlacanja: ValueHelp[];
  public izabranNacinPlacanja: ValueHelp;
  public nacinPrevoza: ValueHelp[];
  public izabranNacinPrevoza: ValueHelp;
  private faktura: Fakutra;

  // sve forme
  public drugiNacinPrevoza: FormGroup;
  public adresaForm: FormGroup;
  public anonimanKupacForm: FormGroup;
  public dugmeZaPorucivanjeStisnuto = false;

  public displayedColumns: string[] = ['slika', 'opis', 'cena'
    , 'akcije'];

  public treceLiceOpcije: string[] = ['Kurirske službe', 'Drugo'];
  public izabranaTrecaLiceOpcija: string;
  public kurirskeSluzbe: string[] = ['Aks', 'Beks'];
  public izabraneKurirskeSluzbe: string;
  public adresaDostave: string[] = ['Vaša adresa', 'Druga'];
  public izabraneAdresaDostave: string;
  public napomena: string;
  public ucitavanje = false;
  private alive = true;

  innerWidth;
  public jeMobilni;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private dataService: DataService,
    private loginServis: LoginService,
    public storage: LocalStorageService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private fakturaServis: FakturaService,
    private router: Router,
    private notifikacija: NotifikacijaService) { }

  ngOnInit() {

    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partnerFE => {
        this.partner = partnerFE;
        this.loginServis.vratiUlogovanogKorisnika(false)
          .pipe(takeWhile(() => this.alive))
          .subscribe(partnerBE => {
            if (partnerFE != null && partnerBE == null) {
              this.loginServis.izbaciPartnerIzSesije();
              this.router.navigate(['/login']);
            }
          });
      });
    this.inicijalizujKorpu();
    this.innerWidth = window.innerWidth;
    this.changeSlideConfiguration();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.changeSlideConfiguration();
  }

  changeSlideConfiguration() {
    if (this.innerWidth < 900) {
      this.jeMobilni = true;
    } else {
      this.jeMobilni = false;
    }
  }

  inicijalizujKorpu() {
    this.vratiOpsteInformacije();
    this.dataService.trenutnaKorpa
      .pipe(takeWhile(() => this.alive))
      .subscribe(korpa => {
        this.korpa = korpa;
        this.preracunajUkupno();
        this.dataSource = this.korpa.roba;
      });
    this.izabranaTrecaLiceOpcija = this.treceLiceOpcije[0];
    this.izabraneKurirskeSluzbe = this.kurirskeSluzbe[0];
    this.izabraneAdresaDostave = this.adresaDostave[0];
    this.inicijalizujSveForme();
  }

  inicijalizujSveForme() {
    if (this.partner) {
      this.drugiNacinPrevoza = this.formBuilder.group({
        prevoz: ['', [Validators.required, Validators.minLength(3)]]
      });
      this.adresaForm = this.formBuilder.group({
        ulica: ['', [Validators.required, Validators.minLength(3)]],
        grad: ['', [Validators.required, Validators.minLength(2)]]
      });
    } else {
      this.anonimanKupacForm = this.formBuilder.group({
        ime: ['', [Validators.required, Validators.minLength(3)]],
        prezime: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
        telefon: ['', [Validators.required, Validators.minLength(3)]],
        ulica: ['', [Validators.required, Validators.minLength(3)]],
        stan: ['', []],
        grad: ['', [Validators.required, Validators.minLength(3)]],
        pbroj: ['', [Validators.required, Validators.minLength(3)]],
        napomena: ['', []]
      });
    }
  }

  vratiOpsteInformacije() {
    const vrsteInformacije = ['placanje', 'prevoz'];
    vrsteInformacije.forEach(vrsta => {
      this.dataService.vratiOpsteInformacije(vrsta).pipe(
        takeWhile(() => this.alive),
        catchError((error: Response) => throwError(error)),
        finalize(() => this.ucitavanje = false)
      )
        .subscribe(
          res => {
            if (vrsta === vrsteInformacije[0]) {
              this.nacinPlacanja = res;
              this.izabranNacinPlacanja = res[0];
            } else {
              this.nacinPrevoza = res;
              this.izabranNacinPrevoza = res[0];
            }
          },
          error => {
          });
    });

  }

  izbaciIzKorpe(index: number) {
    this.dataService.izbaciIzKorpe(index);
    this.notifikacija.notify('Artikal izbačen iz korpe', MatSnackBarKlase.Plava);
    this.table.renderRows();
  }

  otvoriDialogUspesnoPorucivanje(): void {
    const dialogRef = this.dialog.open(UspesnoPorucivanjeModalComponent, {
      width: '400px'
    });
    dialogRef.afterClosed()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.router.navigate(['/naslovna']);
      });
  }
  otvoriDialogNeuspesnoPorucivanje(roba: Roba[], faktura: Fakutra): void {
    const dialogRef = this.dialog.open(NeuspesnoPorucivanjeModalComponent, {
      width: '400px',
      data: { faktura: faktura, roba: roba }
    });
    dialogRef.afterClosed()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.zatvaranjeNeuspesnogDiloga(roba);
      });
  }

  zatvaranjeNeuspesnogDiloga(roba: Roba[]) {
    let stanjePromenjeno = false;
    roba.forEach((r: Roba) => {
      this.korpa.roba
        .filter((robaKorpa: RobaKorpa) => robaKorpa.robaid === r.robaid)
        .map((robaKorpa: RobaKorpa) => {
          stanjePromenjeno = true;
          robaKorpa.kolicina = r.stanje;
        });
    });

    this.korpa.roba = this.korpa.roba.filter((rKorpa: RobaKorpa) => rKorpa.kolicina > 0);

    if (stanjePromenjeno) {
      this.dataSource = null;
      this.dataSource = this.korpa.roba;
    }
  }

  private preracunajUkupno() {
    this.korpa.ukupno = 0;
    this.korpa.roba.forEach(roba => {
      this.korpa.ukupno = this.korpa.ukupno + roba.cenaUkupno;
    });
    this.bezPdv = (this.korpa.ukupno / 1.2).toFixed(2);
    this.pdv = (this.korpa.ukupno - this.korpa.ukupno / 1.2).toFixed(2);
    this.ukupno = this.korpa.ukupno.toFixed(2);
  }

  // glavna metoda
  posaljiPorudzbinu() {
    this.dugmeZaPorucivanjeStisnuto = true;
    if (this.partner) {
      if (this.izabraneAdresaDostave === this.adresaDostave[1]) {
        if (this.adresaForm.invalid) {
          return;
        }
      }
      if (this.izabranNacinPrevoza === this.treceLiceOpcije[1]) {
        if (this.drugiNacinPrevoza.invalid) {
          return;
        }
      }
    } else {
      if (this.anonimanKupacForm.invalid) {
        return;
      }
    }

    this.loginServis.vratiUlogovanogKorisnika(false)
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => {
        let posaljiPorudzbenicu = true;
        if (this.partner != null && partner == null) {
          posaljiPorudzbenicu = false;
        }
        if (partner) {
          this.popuniNapomenu();
          this.korpa.nacinIsporuke = this.izabranNacinPrevoza.id;
          this.korpa.nacinPlacanja = this.izabranNacinPlacanja.id;
        } else {
          this.korpa.roba.filter((robaKorpa: RobaKorpa) => !robaKorpa.zaAnonimusa).forEach((roba: RobaKorpa) => {
            posaljiPorudzbenicu = false;
            this.router.navigate(['/login']);
            this.loginServis.izbaciPartnerIzSesije();
            return;
          });
          this.korpa.nacinIsporuke = 2;
          this.korpa.nacinPlacanja = 2;
          this.popuniNapomenuAnonimus();
        }
        if (posaljiPorudzbenicu) {
          this.korpaUFakturu();
          this.submitujFakturu();
        }
      });
  }

  submitujFakturu() {
    this.fakturaServis.submitujFakturu(this.faktura).pipe(
      takeWhile(() => this.alive),
      catchError((error: Response) => throwError(error)),
      finalize(() => this.ucitavanje = false))
      .subscribe((res: Roba[]) => {
        if (res.length === 0) {
          this.otvoriDialogUspesnoPorucivanje();
          this.dataService.ocistiKorpu();
          this.router.navigate(['/naslovna']);
        } else {
          this.otvoriDialogNeuspesnoPorucivanje(res, this.faktura);
        }
      });
  }

  oduzmiOdKolicine(roba: RobaKorpa) {
    if (roba.kolicina > 1) {
      roba.kolicina = roba.kolicina - 1;
    } else {
      this.notifikacija.notify('Količina ne može biti negativna', MatSnackBarKlase.Plava);
    }
    this.preracunajSveCene(roba);
  }

  dodajKolicini(roba: RobaKorpa) {
    if (roba.kolicina < roba.stanje) {
      roba.kolicina = roba.kolicina + 1;
    } else {
      this.notifikacija.notify('Maksimalna količina dostignuta', MatSnackBarKlase.Plava);
    }
    this.preracunajSveCene(roba);
  }

  promenaKolicineManuelno(roba: RobaKorpa, broj: string) {
    if (Number(broj) || broj === '0') {
      const novaKolicina = Number(broj);
      if (roba.stanje < novaKolicina) {
        roba.kolicina = roba.stanje;
        this.notifikacija.notify('Maksimalna količina: ' + roba.stanje, MatSnackBarKlase.Crvena);
      } else if (novaKolicina < 1) {
        roba.kolicina = 1;
        this.notifikacija.notify('Minimalna količina: 1', MatSnackBarKlase.Crvena);
      } else {
        roba.kolicina = novaKolicina;
      }
    }
    this.preracunajSveCene(roba);
  }

  preracunajSveCene(roba: RobaKorpa) {
    roba.cenaUkupno = roba.cenaKom * roba.kolicina;
    this.storage.zameniArtikalSaNovim(roba);
    this.preracunajUkupno();
    this.dataSource = this.korpa.roba;
    this.table.renderRows();
  }

  korpaUFakturu() {
    this.faktura = new Fakutra();
    if (this.partner) {
      this.faktura.adresa = this.napraviIPopuniValueHelp(this.partner.ppid);
    } else {
      this.faktura.adresa = this.napraviIPopuniValueHelp(850);
    }
    this.faktura.nacinPlacanja = this.napraviIPopuniValueHelp(this.korpa.nacinPlacanja);
    this.faktura.nacinPrevoza = this.napraviIPopuniValueHelp(this.korpa.nacinIsporuke);
    this.faktura.napomena = this.korpa.napomena;
    this.faktura.iznosNarucen = this.korpa.ukupno;
    this.faktura.detalji = [];
    this.korpa.roba.forEach((roba: RobaKorpa) => {
      this.faktura.detalji.push(this.popuniStavke(roba));
    });
  }

  popuniStavke(roba: RobaKorpa) {
    const stavka = new FakturaDetalji();
    stavka.kataloskiBroj = roba.katbr;
    stavka.proizvodjac = roba.proizvodjac;
    stavka.kolicina = roba.kolicina;
    stavka.rabat = roba.rabat;
    stavka.robaId = roba.robaid;
    stavka.cena = roba.cenaKom;
    return stavka;
  }

  napraviIPopuniValueHelp(id: number): ValueHelp {
    const valueHelp = new ValueHelp();
    valueHelp.id = id;
    return valueHelp;
  }

  popuniNapomenuAnonimus() {
    this.korpa.napomena = '';
    const imeIprezime = 'Ime i Prezime: '
      + this.anonimanKupacForm.controls.ime.value
      + ' ' + this.anonimanKupacForm.controls.prezime.value;
    this.korpa.napomena = this.korpa.napomena + imeIprezime + ';';

    const telefonIMail = 'Telefon i Mail: '
      + this.anonimanKupacForm.controls.email.value
      + ' ' + this.anonimanKupacForm.controls.telefon.value;
    this.korpa.napomena = this.korpa.napomena + telefonIMail + ';';

    const ulica = 'Ulica: '
      + this.anonimanKupacForm.controls.ulica.value;
    this.korpa.napomena = this.korpa.napomena + ulica + ';';

    if (this.anonimanKupacForm.controls.stan.value) {
      const stan = 'Stan: '
        + this.anonimanKupacForm.controls.stan.value;
      this.korpa.napomena = this.korpa.napomena + stan + ';';
    }

    const gradIPosta = 'Grad i Posta: '
      + this.anonimanKupacForm.controls.grad.value
      + ' ' + this.anonimanKupacForm.controls.pbroj.value;
    this.korpa.napomena = this.korpa.napomena + gradIPosta + ';';

    if (this.anonimanKupacForm.controls.napomena.value) {
      const napomena = 'napomena: '
        + this.anonimanKupacForm.controls.napomena.value;
      this.korpa.napomena = this.korpa.napomena + napomena + ';';
    }

  }

  popuniNapomenu() {
    this.korpa.napomena = '';
    if (this.izabranNacinPrevoza === this.nacinPrevoza[2]) {
      let nacinPrevoza;
      if (this.izabranaTrecaLiceOpcija === this.treceLiceOpcije[0]) {
        nacinPrevoza = this.izabraneKurirskeSluzbe;
      } else {
        nacinPrevoza = this.drugiNacinPrevoza.controls.prevoz.value;
      }
      this.korpa.napomena = this.korpa.napomena + 'Način prevoza: ' + nacinPrevoza + ' - ';
    }

    if (this.izabraneAdresaDostave === this.adresaDostave[1]) {
      const adresaDostave = this.adresaForm.controls.ulica.value + ', ' + this.adresaForm.controls.grad.value;
      this.korpa.napomena = this.korpa.napomena + 'Adresa dostave: ' + adresaDostave + ' - ';
    }
    if (this.napomena) {
      this.korpa.napomena = this.korpa.napomena + 'Napomena: ' + this.napomena;
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  // convenience getter for easy access to form fields
  get a() { return this.adresaForm.controls; }
  get d() { return this.drugiNacinPrevoza.controls; }
  get anoniman() { return this.anonimanKupacForm.controls; }
}
