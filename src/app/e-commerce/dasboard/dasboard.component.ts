import { OnInit, Component, OnDestroy, HostListener } from '@angular/core';
import { DashboardService } from 'src/app/e-shop/service/dashboard.service';
import { takeWhile } from 'rxjs/operators';
import { Dashboard, Roba, Partner } from 'src/app/e-shop/model/dto';
import { AppUtilsService } from 'src/app/e-shop/utils/app-utils.service';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { DataService } from 'src/app/e-shop/service/data/data.service';
import { Router } from '@angular/router';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { Kategorija, Konastante, Brend } from './kategorija';
import { MatDialog } from '@angular/material/dialog';
import { BrendoviModalComponent } from 'src/app/shared/modal/brendovi-modal/brendovi-modal.component';
import { DashboardPromenaRobeComponent } from 'src/app/shared/modal/dashboard-promena-robe/dashboard-promena-robe.component';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { ZabranjenaRobaModalComponent } from 'src/app/shared/modal/zabranjena-roba-modal/zabranjena-roba-modal.component';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent implements OnInit, OnDestroy {

  // boolean za unistavanje observera
  private alive = true;

  public brojArtikala: any = '-';
  public brojProizvodjaca: any = '-';
  public brojFakture: any = '-';
  public robaPonuda: Roba[] = [];
  public robaNajbolje: Roba[] = [];
  public kategorije: Kategorija[] = [];
  public grupe: Kategorija[] = [];
  public brendovi: Brend[] = [];
  public partner: Partner;
  public innerWidth: any;

  private IZDVAJAMO_IZ_PONUDE = 'IZDVAJAMO_IZ_PONUDE';
  private NAJBOLJE_PRODAVANO = 'NAJBOLJE_PRODAVANO';

  constructor(private servis: DashboardService,
    private utilsService: AppUtilsService,
    private notifikacijaServis: NotifikacijaService,
    private loginServis: LoginService,
    private dataService: DataService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
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
    this.inicijalniPodaci();
    this.izdvajamoIzPonude();
    this.najboljeProdavano();
    this.inijalizujKategorije();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  inijalizujKategorije() {
    const konstanteKategorija = new Konastante();
    this.kategorije = konstanteKategorija.kategorije;
    this.grupe = konstanteKategorija.grupe;
    this.brendovi = konstanteKategorija.brendovi;
  }

  inicijalniPodaci() {
    this.servis.vratiOsnovnePodatke()
      .pipe(takeWhile(() => this.alive))
      .subscribe((podaci: Dashboard) => {
        this.brojArtikala = podaci.brojArtikala;
        this.brojProizvodjaca = podaci.brojProizvodjaca;
        this.brojFakture = podaci.brojFaktura;
      });
  }

  izdvajamoIzPonude() {
    this.servis.vratiORobuIzdvojenuIzPonude(this.IZDVAJAMO_IZ_PONUDE)
      .pipe(takeWhile(() => this.alive))
      .subscribe((roba: Roba[]) => {
        this.robaPonuda = this.dataService.skiniSaStanjaUkolikoJeUKorpi(roba);
        if (this.innerWidth < 657 || (this.innerWidth < 1058 && this.innerWidth > 857)) {
          this.robaPonuda.splice(-1, 1);
        }
      });
  }

  najboljeProdavano() {
    this.servis.vratiORobuIzdvojenuIzPonude(this.NAJBOLJE_PRODAVANO)
      .pipe(takeWhile(() => this.alive))
      .subscribe((roba: Roba[]) => {
        this.robaNajbolje = this.dataService.skiniSaStanjaUkolikoJeUKorpi(roba);
        if (this.innerWidth < 657 || (this.innerWidth < 1058 && this.innerWidth > 857)) {
          this.robaNajbolje.splice(-1, 1);
        }
      });
  }

  detaljiRobe(robaId: string) {
    const url = this.router.parseUrl(this.router.url);
    this.router.navigate(['/roba/' + robaId], { queryParams: { prosliUrl: url.root.children.primary.segments[0].path } });
  }

  dodajUKorpuPonuda(roba: Roba) {
    if (this.partner || roba.dozvoljenoZaAnonimusa) {
      const snackBarPoruka = this.utilsService.dodajUKorpu(roba);
      this.notifikacijaServis.notify(snackBarPoruka, MatSnackBarKlase.Zelena);
      this.utilsService.izbrisiRobuSaStanja(this.robaPonuda, roba);
    } else {
      this.dialog.open(ZabranjenaRobaModalComponent, {
        width: '700px'
      });
    }
  }

  dodajUKorpuNajbolje(roba: Roba) {
    if (this.partner || roba.dozvoljenoZaAnonimusa) {
      const snackBarPoruka = this.utilsService.dodajUKorpu(roba);
      this.notifikacijaServis.notify(snackBarPoruka, MatSnackBarKlase.Zelena);
      this.utilsService.izbrisiRobuSaStanja(this.robaNajbolje, roba);
    } else {
      this.dialog.open(ZabranjenaRobaModalComponent, {
        width: '700px'
      });
    }
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

  idiNaKategoriju(kategorija: Kategorija) {
    if (!kategorija.param) {
      this.router.navigate([kategorija.url],  { queryParams: { prosliUrl: 'naslovna' }});
    } else {
      this.router.navigate([kategorija.url], { queryParams: { grupa: kategorija.param, prosliUrl: 'naslovna' } });
    }
  }


  otvoriDialog(brend: Brend) {
    this.dialog.open(BrendoviModalComponent, {
      width: '700px',
      data: brend
    });
  }

  otvoriDijalogPromeneRobePonuda(roba: Roba) {
    const dialogRef = this.dialog.open(DashboardPromenaRobeComponent, {
      width: '700px',
      data: { staraSifra: roba.robaid, novaSifra: null }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result && Number(result)) {
        const novaRobaId = Number(result);
        let robaIdPostoji = false;
        this.robaPonuda.forEach((ponuda: Roba) => {
          if (ponuda.robaid === novaRobaId) {
            robaIdPostoji = true;
          }
        });
        this.robaNajbolje.forEach((najbolje: Roba) => {
          if (najbolje.robaid === novaRobaId) {
            robaIdPostoji = true;
          }
        });
        if (robaIdPostoji) {
          this.notifikacijaServis.notify(novaRobaId + ' vec postoji na stranici', MatSnackBarKlase.Crvena);
        } else {
          this.servis.promeniDashboardRodbu(roba.robaid, novaRobaId, this.IZDVAJAMO_IZ_PONUDE)
            .pipe(takeWhile(() => this.alive))
            .subscribe(() => {
              this.notifikacijaServis.notify('Uspesna promena', MatSnackBarKlase.Zelena);
              this.izdvajamoIzPonude();
            });
        }
      }
    });
  }

  otvoriDijalogPromeneRobeNajbolje(roba: Roba) {
    const dialogRef = this.dialog.open(DashboardPromenaRobeComponent, {
      width: '700px',
      data: { staraSifra: roba.robaid, novaSifra: null }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result && Number(result)) {
        const novaRobaId = Number(result);
        let robaIdPostoji = false;
        this.robaPonuda.forEach((ponuda: Roba) => {
          if (ponuda.robaid === novaRobaId) {
            robaIdPostoji = true;
          }
        });
        this.robaNajbolje.forEach((najbolje: Roba) => {
          if (najbolje.robaid === novaRobaId) {
            robaIdPostoji = true;
          }
        });
        if (robaIdPostoji) {
          this.notifikacijaServis.notify(novaRobaId + ' vec postoji na stranici', MatSnackBarKlase.Crvena);
        } else {
          this.servis.promeniDashboardRodbu(roba.robaid, novaRobaId, this.NAJBOLJE_PRODAVANO)
            .pipe(takeWhile(() => this.alive))
            .subscribe(() => {
              this.notifikacijaServis.notify('Uspesna promena', MatSnackBarKlase.Zelena);
              this.najboljeProdavano();
            });
        }
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
