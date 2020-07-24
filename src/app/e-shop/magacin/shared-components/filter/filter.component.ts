import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Filter } from 'src/app/e-shop/model/filter';
import { AppUtilsService } from 'src/app/e-shop/utils/app-utils.service';
import { Proizvodjac } from 'src/app/e-shop/model/dto';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy, OnChanges {

  @Input() vrstaUlja;
  @Input() filterGrupe: string[];
  @Input() proizvodjaci;
  @Input() filter: Filter;
  @Output() filterEvent = new EventEmitter<any>();

  public raspolozivost: string[] = ['Svi artikli', 'Ima na stanju'];

  private alive = true;
  public pokaziKategorije = false;
  public izborProizvodjaca: string[] = [];

  constructor(
    private utilsService: AppUtilsService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proizvodjaci && changes.proizvodjaci.currentValue) {
      this.izborProizvodjaca = [];
      changes.proizvodjaci.currentValue.forEach((proizvodjac: Proizvodjac) => {
        if (proizvodjac.proid === this.filter.proizvodjacId) {
          this.filter.proizvodjac = proizvodjac.naziv;
        }
        this.izborProizvodjaca.push(proizvodjac.naziv);
      });
      if (this.filter) {
        if (!this.filter.grupa) {
          this.filter.grupa = 'Sve Kategorije';
        }
        if (!this.filter.proizvodjacId) {
          this.filter.proizvodjac = 'Svi proizvodjači';
        }
        if (!this.filter.naStanju) {
          this.filter.raspolozivost = this.raspolozivost[0];
        }
      }
    }

    if (changes.filter && changes.filter.currentValue) {
      if (changes.filter.currentValue.grupa && changes.filter.currentValue.grupa !== 'Sve Kategorije') {
        this.filter.grupa = changes.filter.currentValue.grupa.toUpperCase();
      }
    }

    if ((changes.filterGrupe && changes.filterGrupe.currentValue && changes.filterGrupe.currentValue.length > 1)
      || (this.filter.grupa && this.filter.grupa !== 'Sve Kategorije')) {
      this.pokaziKategorije = true;
    }
  }

  ngOnInit() {

    if (this.filter) {
      if (this.filter.naStanju) {
        this.filter.raspolozivost = this.raspolozivost[1];
        if (!this.filter.proizvodjac) {
          this.filter.proizvodjac = 'Svi proizvodjači';
        }
        if (!this.filter.grupa) {
          this.filter.grupa = 'Sve Kategorije';
        }
      } else {
        if (!this.filter.proizvodjac) {
          this.filter.proizvodjac = 'Svi proizvodjači';
        }
        if (!this.filter.grupa) {
          this.filter.grupa = 'Sve Kategorije';
        }
        this.filter.raspolozivost = this.raspolozivost[0];
      }
    } else {
      this.filter = new Filter();
      this.filter.raspolozivost = this.raspolozivost[0];
      this.filter.proizvodjac = 'Svi proizvodjači';
      this.filter.grupa = 'Sve Kategorije';
    }
  }

  filtriraj() {
    this.filter.naStanju = this.utilsService.daLiRobaTrebaDaBudeNaStanju(this.raspolozivost, this.filter.raspolozivost);
    this.filter.proizvodjacId = this.utilsService.vratiIdProizvodjacaAkoPostoji(this.filter.proizvodjac, this.proizvodjaci);
    this.filterEvent.emit(this.filter);
  }

  resetujFilter() {
    this.filter.raspolozivost = this.raspolozivost[0];
    this.filter.proizvodjac = this.proizvodjaci[0].naziv;
    this.filter.naStanju = this.utilsService.daLiRobaTrebaDaBudeNaStanju(this.raspolozivost, this.filter.raspolozivost);
    this.filter.proizvodjacId = this.utilsService.vratiIdProizvodjacaAkoPostoji(this.filter.proizvodjac, this.proizvodjaci);

    this.filterEvent.emit(this.filter);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
