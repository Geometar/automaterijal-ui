import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { LogoviService } from '../../service/logovi.service';
import { WebLogPage, WebLog, Partner } from '../../model/dto'
import { PartnerService } from '../../service/partner.service';
import { Page } from '../../model/page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-log-partnera',
  templateUrl: './log-partnera.component.html',
  styleUrls: ['./log-partnera.component.scss']
})
export class LogPartneraComponent implements OnInit, OnDestroy {

  log: WebLog[];
  ppid; number;
  partnerKojegGledam: Partner;
  danas: Date = new Date();

  pronadjenLog = true;
  public ucitavanje = false;
  private alive = true;

  // Paging and Sorting elements
  public rowsPerPage = 10;
  public pageIndex = 0;
  public sort = null;
  public tableLength;
  public dataSource: any;

  public displayedColumns: string[] = ['vremePretrage', 'pretraga', 'filter', 'proizvodjac'];
  constructor(
    private logoviService: LogoviService,
    private route: ActivatedRoute,
    private location: Location,
    private partnerServis: PartnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.danas.getMonth());
    this.route.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe((params: Params) => {
        this.ppid = params['ppid'];
        this.partnerServis.vratiPartnera(this.ppid).subscribe((partner: Partner) => {
          this.partnerKojegGledam = partner;
        })
        this.pretragaLogova();
      });
  }

  pretragaLogova() {
    this.ucitavanje = true;
    this.pronadjenLog = true;
    this.logoviService.vratiLogove(this.pageIndex, this.rowsPerPage, this.ppid)
      .subscribe((log: WebLogPage) => {
        this.pageIndex = log.number;
        this.tableLength = log.totalElements;
        this.rowsPerPage = log.size;
        this.log = log.content;
        if (this.log.length === 0) {
          this.pronadjenLog = false;
        }
        this.dataSource = this.log;
        this.ucitavanje = false;
      })
  }

  paginatorEvent(pageEvent) {
    this.dataSource = [];
    this.rowsPerPage = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.pretragaLogova();
  }


  traziPoBroju(katBr) {
    const url = '/roba';
    this.router.navigate([url], { queryParams: { pretraga: katBr } });
  }

  idiNazad() {
    this.location.back();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
