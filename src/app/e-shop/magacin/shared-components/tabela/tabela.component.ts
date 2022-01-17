import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Roba, Partner } from 'src/app/e-shop/model/dto';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { AppUtilsService } from 'src/app/e-shop/utils/app-utils.service';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { DataService } from 'src/app/e-shop/service/data/data.service';
import { Korpa } from 'src/app/e-shop/model/porudzbenica';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ZabranjenaRobaModalComponent } from 'src/app/shared/modal/zabranjena-roba-modal/zabranjena-roba-modal.component';
import { isPlatformBrowser } from '@angular/common';
import { SlikaModalComponent } from 'src/app/shared/modal/slika-modal/slika-modal.component';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit, OnDestroy, OnChanges {

  @Input() dataSource: any[];
  @Input() roba: Roba[];

  // Paging and Sorting elements
  @Input() rowsPerPage = 10;
  @Input() pageIndex = 0;
  @Input() tableLength;
  @Output() magacinEvent = new EventEmitter<any>();

  innerWidth;
  public partner: Partner;
  public partnerLogovan = false;
  private korpa: Korpa;
  public jeMobilni = false;

  // boolean za unistavanje observera
  private alive = true;

  // Tabela
  private columnDefinitions = [
    { def: 'slika', ifNotMobile: true },
    { def: 'opis', ifNotMobile: true },
    { def: 'tehnickidetalji', ifNotAuth: false },
    { def: 'korpa', ifNotMobile: true },
  ];

  constructor(
    private utilsService: AppUtilsService,
    private loginServis: LoginService,
    private notifikacijaServis: NotifikacijaService,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId,
    public dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.roba && changes.roba.currentValue) {
      this.utilsService.daLiJeRobaUKorpi(this.korpa, changes.roba.currentValue);
      this.preispitajSlike(this.roba);
    }
  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      this.jeMobilni = window.innerWidth > 900;
      this.innerWidth = window.innerWidth;
    }
    this.preispitajSlike(this.roba);
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => this.partner = partner);
    this.dataService.trenutnaKorpa
      .pipe(takeWhile(() => this.alive))
      .subscribe(korpa => this.korpa = korpa);
    this.loginServis.daLiJePartnerUlogovan
      .pipe(takeWhile(() => this.alive))
      .subscribe(bool => this.partnerLogovan = bool);
    this.changeSlideConfiguration();
  }

  preispitajSlike(roba: Roba[]) {
    if (roba) {
      roba.forEach(r => {
        if (!r.slika.isUrl && r.slika.slikeByte) {
          r.slika.slikeUrl = 'data:image/jpeg;base64,' + r.slika.slikeByte;
        }
      });
    }
  }

  changeSlideConfiguration() {
    if (this.innerWidth < 900) {
      this.jeMobilni = false;
    } else {
      this.jeMobilni = true;
    }
  }

  paginatorEvent(pageEvent) {
    this.magacinEvent.emit(pageEvent);
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }

  getDisplayedColumns(): string[] {
    const dataColumns = this.columnDefinitions
      .filter(cd => this.jeMobilni || cd.ifNotMobile)
      .map(cd => cd.def);
    return dataColumns;
  }
  oduzmiOdKolicine(roba: Roba) {
    if (!Number(roba.kolicina)) {
      roba.kolicina = 1;
    }
    if (roba.kolicina > 1) {
      roba.kolicina = roba.kolicina - 1;
    } else {
      this.notifikacijaServis.notify('Količina ne može biti negativna', MatSnackBarKlase.Plava);
    }
  }

  dodajKolicini(roba: Roba) {
    if (!Number(roba.kolicina)) {
      roba.kolicina = 1;
    }
    if (roba.kolicina < roba.stanje) {
      roba.kolicina = roba.kolicina + 1;
    } else {
      this.notifikacijaServis.notify('Maksimalna količina dostignuta', MatSnackBarKlase.Plava);
    }
  }

  dodajUKorpu(roba: Roba) {
    if (this.partner || roba.dozvoljenoZaAnonimusa) {
      this.loginServis.vratiUlogovanogKorisnika(false)
        .pipe(takeWhile(() => this.alive))
        .subscribe(partner => {
          if (partner == null && this.partner != null) {
            this.router.navigate(['/login']);
            this.loginServis.izbaciPartnerIzSesije();
          } else {
            const snackBarPoruka = this.utilsService.dodajUKorpu(roba);
            this.notifikacijaServis.notify(snackBarPoruka, MatSnackBarKlase.Zelena);
            this.utilsService.izbrisiRobuSaStanja(this.roba, roba);
          }
        });
    } else {
      this.dialog.open(ZabranjenaRobaModalComponent, {
        width: '700px'
      });
    }
  }

  uvelicajSliku(roba: Roba) {
    this.dialog.open(SlikaModalComponent, {
      width: '700px',
      data: { roba: roba }
    });
  }

  detaljiRobe(robaId: string) {
    const url = this.router.parseUrl(this.router.url);
    this.router.navigate(['/roba/' + robaId], { queryParams: { prosliUrl: url.root.children.primary.segments[0].path } });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
