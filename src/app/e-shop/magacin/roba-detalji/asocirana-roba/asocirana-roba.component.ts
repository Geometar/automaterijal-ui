import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { Partner, Roba } from 'src/app/e-shop/model/dto';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { AppUtilsService } from 'src/app/e-shop/utils/app-utils.service';
import { ZabranjenaRobaModalComponent } from 'src/app/shared/modal/zabranjena-roba-modal/zabranjena-roba-modal.component';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';

@Component({
  selector: 'asocirana-roba',
  templateUrl: './asocirana-roba.component.html',
  styleUrls: ['./asocirana-roba.component.scss']
})
export class AsociranaRobaComponent implements OnInit {

  @Input() asociraniArtikli: Roba[];
  public partner: Partner;
  public innerWidth: any;

  // boolean za unistavanje observera
  private alive = true;

  constructor(
    private router: Router,
    private notifikacijaServis: NotifikacijaService,
    private utilsService: AppUtilsService,
    public dialog: MatDialog,
    private loginServis: LoginService,
    @Inject(PLATFORM_ID) private platformId,
    ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth = window.innerWidth;
    }
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
      this.preispitajSlike();
  }

  preispitajSlike() {
    this.asociraniArtikli.forEach(roba => {
      if(roba.slika) {
        roba.slika.slikeByte = 'data:image/jpeg;base64,' + roba.slika.slikeByte;
      }
    })
  }

  detaljiRobe(robaId: string) {
    const url = this.router.parseUrl(this.router.url);
    this.router.navigate(['/roba/' + robaId], { queryParams: { prosliUrl: url.root.children.primary.segments[0].path } }).then(() => {
      window.location.reload();
   });
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
  dodajUKorpuPonuda(roba: Roba) {
    if (this.partner || roba.dozvoljenoZaAnonimusa) {
      const snackBarPoruka = this.utilsService.dodajUKorpu(roba);
      this.notifikacijaServis.notify(snackBarPoruka, MatSnackBarKlase.Zelena);
      this.utilsService.izbrisiRobuSaStanja(this.asociraniArtikli, roba);
    } else {
      this.dialog.open(ZabranjenaRobaModalComponent, {
        width: '700px'
      });
    }
  }

}
