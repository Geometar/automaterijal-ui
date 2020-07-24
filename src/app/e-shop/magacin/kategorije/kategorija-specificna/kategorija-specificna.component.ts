import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import {Location} from '@angular/common';
import { throwError, EMPTY } from 'rxjs';
import { Roba, Magacin } from 'src/app/e-shop/model/dto';
import { DataService } from 'src/app/e-shop/service/data/data.service';
import { RobaService } from 'src/app/e-shop/service/roba.service';
import { Filter } from 'src/app/e-shop/model/filter';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-kategorija-specificna',
  templateUrl: './kategorija-specificna.component.html',
  styleUrls: ['./kategorija-specificna.component.scss']
})
export class KategorijaSpecificnaComponent implements OnInit, OnDestroy {

  public roba: Roba[];
  // Paging and Sorting elements
  public rowsPerPage = 10;
  public pageIndex = 0;
  public sort = null;
  public tableLength;
  public naslov = '';

  public filter: Filter = new Filter();
  public filterGrupe = [];
  public proizvodjaci = [];

  public searchValue = '';

  public ucitavanje = false;
  public pronadjenaRoba = true;

  public otvoriFilter = false;
  public dataSource: any;

  private alive = true;
  private prosliUrl;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private robaServis: RobaService,
    private loginServis: LoginService,
    private router: Router,
    private loginService: LoginService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe((params: Params) => {
        this.prosliUrl = '/' + params.prosliUrl;
      });
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partnerFE => {
        this.loginServis.vratiUlogovanogKorisnika(false)
          .pipe(takeWhile(() => this.alive))
          .subscribe(partnerBE => {
            if (partnerFE != null && partnerBE == null) {
              this.loginServis.izbaciPartnerIzSesije();
              this.router.navigate(['/login']);
            }
          });
      });
    this.pronandjiRobu();
  }

  pronandjiRobu() {
    this.route.params
      .pipe(takeWhile(() => this.alive))
      .subscribe((params: Params) => {
        this.route.queryParams
          .pipe(takeWhile(() => this.alive))
          .subscribe(queryParams => {
            this.dataSource = null;
            this.ucitavanje = true;
            this.pronadjenaRoba = true;
            this.pageIndex = queryParams['strana'];
            this.rowsPerPage = queryParams['brojKolona'];
            this.filter.proizvodjacId = queryParams['proizvodjac'];
            this.filter.naStanju = queryParams['naStanju'];
            this.filter.grupa = queryParams['grupa'];
            this.searchValue = queryParams['pretraga'];
            this.naslov = '';
            const naslovArray: string[] = params.id.split('_');
            naslovArray.forEach(rec => this.naslov = this.naslov + rec + ' ');
            this.robaServis.pronadjiPoKategoriji(
              this.sort, this.rowsPerPage, this.pageIndex, this.searchValue, this.filter, params.id
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
              .pipe(takeWhile(() => this.alive))
              .subscribe(
                (response: HttpResponse<Magacin>) => {
                  this.loginService.obavesiPartneraAkoJeSesijaIstekla(response.headers.get('AuthenticatedUser'));
                  const body = response.body;
                  this.filterGrupe = body.podgrupe;
                  this.proizvodjaci = body.proizvodjaci;
                  this.pronadjenaRoba = true;
                  this.roba = body.robaDto.content;
                  this.roba = this.dataService.skiniSaStanjaUkolikoJeUKorpi(this.roba);
                  this.dataSource = this.roba;
                  this.rowsPerPage = body.robaDto.size;
                  this.pageIndex = body.robaDto.number;
                  this.tableLength = body.robaDto.totalElements;
                },
                error => {
                  this.roba = null;
                });

          });
      });
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
    this.route.params
      .pipe(takeWhile(() => this.alive))
      .subscribe((params: Params) => {
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
        if (this.searchValue) {
          parameterObject['pretraga'] = this.searchValue;
        }
        if (this.filter.grupa) {
          parameterObject['grupa'] = this.filter.grupa;
        }
        if (params.prosliUrl) {
          parameterObject['prosliUrl'] = params.prosliUrl;
        }
        parameterObject['prosliUrl'] = this.prosliUrl;
        const idUrl = params.id.toLowerCase();
        this.router.navigate(['/kategorije', idUrl], { queryParams: parameterObject });
      });
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

  idiNazad() {
    this.route.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe((params: Params) => {
        this.router.navigate([this.prosliUrl]);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
