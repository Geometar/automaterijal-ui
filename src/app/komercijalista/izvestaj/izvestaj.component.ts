import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransitionCheckState } from '@angular/material/checkbox';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { Partner } from 'src/app/e-shop/model/dto';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { PartnerService } from 'src/app/e-shop/service/partner.service';
import { Izvestaj, IzvestajPage } from 'src/app/komercijalista/model/dto'
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { IzvestajService } from '../service/izvestaj.service';

@Component({
  selector: 'app-izvestaj',
  templateUrl: './izvestaj.component.html',
  styleUrls: ['./izvestaj.component.scss']
})
export class IzvestajComponent implements OnInit, OnDestroy {
  public partner: Partner;
  public izvestaji: Izvestaj[];
  public dataSource: any;
  public komercijalisti: Partner[];
  public izabraniKomercijalista: number;

  public error = false;
  public ucitavanje = false;
  public pronadjenIzvestaj = true;

  // Paging and Sorting elements
  public rowsPerPage = 10;
  public pageIndex = 0;
  public sort = null;
  public tableLength;

  // Vremena
  public datumOd: Date = null;
  public datumDo: Date = null;
  private prosliDatumOd: Date = null;
  private prosliDatumDo: Date = null;

  searchValue;
  pocetnoPretrazivanje = true;

  // boolean za unistavanje observera
  private alive = true;

  constructor(
    private loginServis: LoginService,
    private izvestajServis: IzvestajService,
    private adapter: DateAdapter<any>,
    private notifikacijaServis: NotifikacijaService,
    private partnerServis: PartnerService,
    private aktivnaRuta: ActivatedRoute,
    private router: Router) { }

  public displayedColumns: string[] = ['datum', 'mesto', 'firma', 'adresa', 'ackije'];


  ngOnInit(): void {
    this.adapter.setLocale('sr');
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => {
        if(!partner || partner.privilegije < 2042) {
          this.router.navigate(['/naslovna']);
        }
        this.partner = partner
        if (this.partner.privilegije === 2047) {
          this.displayedColumns = ['datum', 'komercijalista', 'mesto', 'firma', 'adresa', 'ackije']
        }
        if (this.partner.privilegije === 2047) {
          this.partnerServis.vratiSveKomercijaliste()
            .pipe(takeWhile(() => this.alive))
            .subscribe((partneri: Partner[]) => {
              this.komercijalisti = partneri;
            });
        }
      });
    this.uzmiParametreIzUrla();
  }

  uzmiParametreIzUrla() {
    this.dataSource = null;
    this.ucitavanje = true;
    this.pronadjenIzvestaj = true;
    this.aktivnaRuta.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe(params => {
        this.pageIndex = params['strana'];
        this.rowsPerPage = params['brojKolona'];
        if (!isNaN(params['od'])) {
          // tslint:disable-next-line:radix
          this.datumOd = new Date(parseInt(params['od']));
          // tslint:disable-next-line:radix
          this.prosliDatumOd = new Date(parseInt(params['od']));
        }
        if (!isNaN(params['do'])) {
          // tslint:disable-next-line:radix
          this.datumDo = new Date(parseInt(params['do']));
          // tslint:disable-next-line:radix
          this.prosliDatumDo = new Date(parseInt(params['do']));
        }
        this.searchValue = params['pretraga'];
        this.izabraniKomercijalista = params['komercijalista']
        this.vratiSveIzvestaje();
      });
  }

  vratiSveIzvestaje() {
    this.ucitavanje = true;
    this.pronadjenIzvestaj = true;
    this.izvestajServis.vratiIzvestaje(this.searchValue, this.pageIndex, this.rowsPerPage, this.partner.ppid, this.datumOd, this.datumDo, this.izabraniKomercijalista)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: IzvestajPage) => {
        this.error = false;
        this.izvestaji = res.content;
        if (this.izvestaji.length === 0) {
          this.pronadjenIzvestaj = false;
        }
        this.dataSource = this.izvestaji;
        this.ucitavanje = false;
        this.rowsPerPage = res.size;
        if (res.number > res.totalPages) {
          this.pageIndex = 0;
          this.dodajParametreUURL();
          return;
        }
        this.pageIndex = res.number;
        this.tableLength = res.totalElements;
      },
        error => {
          this.ucitavanje = false;
          this.error = true;
        });
  }


  pronaciPoTrazenojReci(searchValue) {
    if (this.dataSource) {
      this.pageIndex = 0;
    }
    this.searchValue = searchValue;
    this.dodajParametreUURL();
  }

  periodPromenjen(type: string, event: MatDatepickerInputEvent<Date>) {
    if (this.datumDo && type === 'datumOd' && event.value.getTime() > this.datumDo.getTime()) {
      this.notifikacijaServis.notify('Period nije validan', MatSnackBarKlase.Crvena);
      if (this.prosliDatumOd) {
        this.datumOd = new Date(this.prosliDatumOd.getTime());
      } else {
        this.datumOd = new Date(this.prosliDatumDo.getTime());
      }
      return;
    } else if (this.datumOd && type === 'datumDo' && this.datumOd.getTime() > event.value.getTime()) {
      this.notifikacijaServis.notify('Period nije validan', MatSnackBarKlase.Crvena);
      if (this.prosliDatumDo) {
        this.datumDo = new Date(this.prosliDatumDo.getTime());
      } else {
        this.datumDo = new Date(this.prosliDatumOd.getTime());
      }
      return;
    }

    if (type === 'datumOd') {
      this.prosliDatumOd = event.value;
    } else {
      this.prosliDatumDo = event.value;
    }

    this.pageIndex = 0;
    this.dodajParametreUURL();
  }

  dodajParametreUURL() {
    const parameterObject = {};
    parameterObject['strana'] = this.pageIndex;
    parameterObject['brojKolona'] = this.rowsPerPage;

    if (this.datumOd) {
      parameterObject['od'] = this.datumOd.getTime();
    }
    if (this.datumDo) {
      parameterObject['do'] = this.datumDo.getTime();
    }
    if (this.searchValue) {
      parameterObject['pretraga'] = this.searchValue;
    }
    if (this.izabraniKomercijalista) {
      parameterObject['komercijalista'] = this.izabraniKomercijalista;
    }

    this.router.navigate(['/izvestaj'], { queryParams: parameterObject });
  }

  promenaKomercijaliste(partner) {
    if(partner.value) {
      this.izabraniKomercijalista = partner.value.ppid;
    } else {
      this.izabraniKomercijalista = null;
    }
    this.dodajParametreUURL();
  }

  izvestajDetalji(izvestaj: Izvestaj) {
    console.log('izvestaj ', izvestaj);
    const URL = '/izvestaj/detalji/' + izvestaj.komentarDto.id;
    this.router.navigate([URL]);
  }

  paginatorEvent(pageEvent) {
    this.dataSource = [];
    this.rowsPerPage = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.dodajParametreUURL();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  idiNaKreiranje() {
    this.router.navigate(['/izvestaj/kreiraj']);
  }

}
