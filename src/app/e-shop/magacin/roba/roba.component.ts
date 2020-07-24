import { Component, OnInit, OnDestroy } from '@angular/core';
import { RobaService } from '../../service/roba.service';
import { Roba, RobaPage, Magacin } from '../../model/dto';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { DataService } from '../../service/data/data.service';
import { Filter } from '../../model/filter';
import { LoginService } from '../../service/login.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-roba',
  templateUrl: './roba.component.html',
  styleUrls: ['./roba.component.css']
})
export class RobaComponent implements OnInit, OnDestroy {

  public roba: Roba[];
  // Paging and Sorting elements
  public rowsPerPage = 10;
  public pageIndex = 0;
  public sort = null;
  public tableLength;

  public filter: Filter = new Filter();
  public filterGrupe = [];
  public proizvodjaci = [];

  public searchValue = '';

  public ucitavanje = false;
  public pronadjenaRoba = true;
  public otvoriFilter = false;
  public dataSource: any;
  private treutniParametri = {};

  private alive = true;

  constructor(private robaService: RobaService,
    private dataService: DataService,
    private loginService: LoginService,
    private aktivnaRuta: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginService.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partnerFE => {
        this.loginService.vratiUlogovanogKorisnika(false)
          .pipe(takeWhile(() => this.alive))
          .subscribe(partnerBE => {
            if (partnerFE != null && partnerBE == null) {
              this.loginService.izbaciPartnerIzSesije();
              this.router.navigate(['/login']);
            }
          });
      });
    this.uzmiParametreIzUrla();
  }

  uzmiParametreIzUrla() {
    this.aktivnaRuta.queryParams
    .pipe(takeWhile(() => this.alive))
    .subscribe(params => {
      this.treutniParametri = params;
      this.pageIndex = params['strana'];
      this.rowsPerPage = params['brojKolona'];
      this.filter.proizvodjacId = params['proizvodjac'];
      this.filter.naStanju = params['naStanju'];
      this.filter.grupa = params['grupa'];
      if (this.searchValue && this.searchValue !== params['pretraga']) {
        this.filter.pretrazitiGrupe = true;
      }
      this.searchValue = params['pretraga'];
      this.pronadjiSvuRobu();
    });
  }

  pronadjiSvuRobu() {
    this.dataSource = null;
    this.ucitavanje = true;
    this.pronadjenaRoba = true;
    this.robaService.pronadjiSvuRobu(
      this.sort, this.rowsPerPage, this.pageIndex, this.searchValue, this.filter
    )
      .pipe(
        takeWhile(() => this.alive),
        catchError((error: Response) => {
          if (error.status === 404) {
            this.pronadjenaRoba = false;
            this.loginService.obavesiPartneraAkoJeSesijaIstekla(error.headers.get('AuthenticatedUser'));
            return EMPTY;
          }
          return throwError(error);
        }),
        finalize(() => this.ucitavanje = false)
      )
      .subscribe(
        (response: HttpResponse<Magacin>) => {
          this.loginService.obavesiPartneraAkoJeSesijaIstekla(response.headers.get('AuthenticatedUser'));
          const body = response.body;
          this.filterGrupe = body.podgrupe;
          this.proizvodjaci = body.proizvodjaci;
          this.roba = body.robaDto.content;
          if (this.roba && this.roba.length > 0) {
            this.pronadjenaRoba = true;
          } else {
            this.pronadjenaRoba = false;
          }
          this.roba = this.dataService.skiniSaStanjaUkolikoJeUKorpi(this.roba);
          this.dataSource = this.roba;
          this.rowsPerPage = body.robaDto.size;
          this.pageIndex = body.robaDto.number;
          this.tableLength = body.robaDto.totalElements;
        },
        error => {
          this.roba = null;
        });
  }

  podesiFiltereNaDefaultVrednost() {
    if (this.filter.grupa) {
    }
  }

  pronaciPoTrazenojReci(searchValue) {
    if (this.dataSource) {
      this.pageIndex = 0;
    }
    this.searchValue = searchValue;
    this.dodajParametreUURL();
  }

  paginatorEvent(pageEvent) {
    this.dataSource = [];
    this.rowsPerPage = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.dodajParametreUURL();
  }

  dodajParametreUURL() {
    const parameterObject = {};
    if (this.pageIndex) {
      parameterObject['strana'] = this.pageIndex;
    }
    if (this.rowsPerPage) {
      parameterObject['brojKolona'] = this.rowsPerPage;
    }
    if (this.filter.proizvodjacId) {
      parameterObject['proizvodjac'] = this.filter.proizvodjacId;
    }
    if (this.filter.naStanju) {
      parameterObject['naStanju'] = this.filter.naStanju;
    }
    if (this.filter.grupa) {
      parameterObject['grupa'] = this.filter.grupa;
    }
    if (this.searchValue) {
      parameterObject['pretraga'] = this.searchValue;
    }
      this.router.navigate(['/roba'], { queryParams: parameterObject });
  }

  toogleFilterDiv(otvoriFilter: boolean) {
    this.otvoriFilter = otvoriFilter;
  }

  filtriraj(filter: Filter) {
    if (this.dataSource) {
      this.pageIndex = 0;
    }
    this.filter = filter;
    this.dodajParametreUURL();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
