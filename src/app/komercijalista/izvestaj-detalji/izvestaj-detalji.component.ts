import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, takeWhile } from 'rxjs/operators';
import { Partner } from 'src/app/e-shop/model/dto';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { SEKTORI } from '../kreiranje-izvestaj/kreiranje-izvestaj.component';
import { Izvestaj } from '../model/dto';
import { IzvestajService } from '../service/izvestaj.service';

@Component({
  selector: 'app-izvestaj-detalji',
  templateUrl: './izvestaj-detalji.component.html',
  styleUrls: ['./izvestaj-detalji.component.scss']
})
export class IzvestajDetaljiComponent implements OnInit {
  public partner: Partner;

  private alive = true;
  izvestaj: Izvestaj;

  constructor(
    private loginServis: LoginService,
    private izvestajServis: IzvestajService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => {
        if (!partner || partner.privilegije < 2042) {
          this.router.navigate(['/naslovna']);
        }
        this.partner = partner
      });
    this.uzmiDetaljeIzvestaja();
  }

  uzmiDetaljeIzvestaja() {
    this.route.params.
      pipe(
        map(p => p.id),
        mergeMap(id => this.izvestajServis.vratiDetaljeIzvestaja(id))
      ).subscribe((izvestaj: Izvestaj) => {
        SEKTORI.forEach(sektor => {
          if (sektor.value === izvestaj.firmaDto.sektor) {
            izvestaj.firmaDto.sektor = sektor.viewValue;
          }
        })
        this.izvestaj = izvestaj;
      })
  }

  idiNazad() {
    this.location.back();
  }
}
