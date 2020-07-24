import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Partner, FakturaDetalji, Fakutra } from '../../model/dto';
import { LoginService } from '../../service/login.service';
import { FakturaService } from '../../service/faktura.service';
import { Location } from '@angular/common';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-faktura-detalji',
  templateUrl: './faktura-detalji.component.html',
  styleUrls: ['./faktura-detalji.component.scss']
})
export class FakturaDetaljiComponent implements OnInit, OnDestroy {

  public partner: Partner;
  public faktura: Fakutra = new Fakutra();
  public fakturaDetalji: FakturaDetalji[];
  public dataSource: any;
  public ucitavanje = false;
  public error = false;

  // Paging and Sorting elements
  public rowsPerPage = 10;
  public pageIndex = 0;

  // boolean za unistavanje observera
  private alive = true;

  public displayedColumns: string[] = ['slika', 'opis', 'kolicina', 'cena'];

  constructor(
    private loginServis: LoginService,
    private route: ActivatedRoute,
    private fakturaServis: FakturaService,
    private location: Location) { }

  ngOnInit() {
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => this.partner = partner);
    this.ucitavanje = true;
    this.vratiFakturu();
  }

  vratiFakturu() {
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      this.fakturaServis.vratiFakturuPojedinacno(params.id, this.partner.ppid)
        .pipe(takeWhile(() => this.alive))
        .subscribe((res: Fakutra) => {
          this.error = false;
          this.faktura = res;
          this.fakturaDetalji = res.detalji;
          this.dataSource = this.fakturaDetalji;
          this.ucitavanje = false;
        },
          error => {
            this.error = true;
            this.ucitavanje = false;
          });
    });
  }

  idiNazad() {
    this.location.back();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
