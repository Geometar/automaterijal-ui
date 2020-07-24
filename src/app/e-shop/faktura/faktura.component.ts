import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Partner, Fakutra, FakturaPage } from '../model/dto';
import { FakturaService } from '../service/faktura.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-faktura',
  templateUrl: './faktura.component.html',
  styleUrls: ['./faktura.component.scss']
})
export class FakturaComponent implements OnInit, OnDestroy {

  public partner: Partner;
  public fakure: Fakutra[];
  public dataSource: any;

  public error = false;
  public ucitavanje = false;

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

  // boolean za unistavanje observera
  private alive = true;

  public displayedColumns: string[] = ['orderId', 'brojStavki', 'iznosNarucen', 'iznosPotvrdjen', 'vremePorucivanja', 'status', 'ackije'];

  constructor(
    private loginServis: LoginService,
    private fakturaService: FakturaService,
    private aktivnaRuta: ActivatedRoute,
    private adapter: DateAdapter<any>,
    private notifikacijaServis: NotifikacijaService,
    private router: Router) { }

  ngOnInit() {
    this.adapter.setLocale('sr');
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => this.partner = partner);
    this.uzmiParametreIzUrla();
  }

  uzmiParametreIzUrla() {
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
        this.vratiFaktureKorisnika();
      });
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

  vratiFaktureKorisnika() {
    this.ucitavanje = true;
    this.fakturaService.vratiFaktureKorisnika(this.pageIndex, this.rowsPerPage, this.partner.ppid, this.datumOd, this.datumDo)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: FakturaPage) => {
        this.error = false;
        this.fakure = res.content;
        this.dataSource = this.fakure;
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

    this.router.navigate(['/porudzbenice'], { queryParams: parameterObject });
  }

  paginatorEvent(pageEvent) {
    this.dataSource = [];
    this.rowsPerPage = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.dodajParametreUURL();
  }

  detaljiFakture(id: number) {
    this.router.navigate(['/porudzbenice/' + id]);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
