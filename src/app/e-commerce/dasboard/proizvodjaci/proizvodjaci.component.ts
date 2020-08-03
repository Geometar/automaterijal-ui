import { Component, OnInit } from '@angular/core';
import { Konastante, Brend } from '../kategorija';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { HtmlService } from '../../servis/html.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-proizvodjaci',
  templateUrl: './proizvodjaci.component.html',
  styleUrls: ['./proizvodjaci.component.scss']
})
export class ProizvodjaciComponent implements OnInit {

  public brend: Brend;
  private alive = true;
  public opis: any;

  constructor(
    private route: ActivatedRoute,
    private htmlServis: HtmlService) { }

  ngOnInit(): void {
    const konstanteKategorija = new Konastante();
    this.route.params
    .pipe(takeWhile(() => this.alive))
    .subscribe((params: Params) => {
      konstanteKategorija.brendovi.forEach((brend: Brend) => {
        if (brend.ime === params.id) {
          this.brend = brend;
          this.htmlServis.pronadjiDetaljeRobe(this.brend.url)
          .pipe(takeWhile(() => this.alive))
          .subscribe(text => {
            this.opis = text.body;
          });
        }
      });
    });
  }

}
