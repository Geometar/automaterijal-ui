import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminServiceService } from '../service/admin-service.service';
import { LogovanjaPage, Logovanja, Grupa, Partner } from '../model/dto';
import { takeWhile } from 'rxjs/operators';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { MatDialog } from '@angular/material/dialog';
import { GrupeModalComponent } from 'src/app/shared/modal/grupe-modal/grupe-modal.component';
import { Router } from '@angular/router';
import { PartnerService } from '../service/partner.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public logovanja: Logovanja[];
  public dozvoljeneGrupe: Grupa[];
  public dataSource: any;
  public komercijalistiPpid: number[] = [];

  public ucitavanje = false;
  public ucitavanjeSesija = false;

  // Paging and Sorting elements
  public displayedColumns: string[] = ['ppid', 'naziv', 'vreme', 'akcije'];
  public rowsPerPage = 10;
  public pageIndex = 0;
  public tableLength;

  // boolean za unistavanje observera
  private alive = true;

  constructor(
    private partnerServis: PartnerService,
    private adminServis: AdminServiceService,
    private notifikacija: NotifikacijaService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.vratiSveKomercijaliste();
    this.uzmiSveAdminPodatke();
  }

  vratiSveKomercijaliste() {
    this.partnerServis.vratiSveKomercijaliste().subscribe((komercijalisti: Partner[]) => {
      this.komercijalistiPpid = komercijalisti.map(komercijalista => komercijalista.ppid);
    })
  }

  uzmiSveAdminPodatke() {
    this.ucitavanje = true;
    this.adminServis.vratiSvaLogovanja(this.pageIndex, this.rowsPerPage)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: LogovanjaPage) => {
        this.logovanja = res.content;
        this.dataSource = this.logovanja;
        this.rowsPerPage = res.size;
        this.pageIndex = res.number;
        this.tableLength = res.totalElements;
        this.ucitavanje = false;
      });

    this.ucitavanjeSesija = true;
    this.adminServis.vratiSveDozvoljeneGrupe()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: Grupa[]) => {
        this.dozvoljeneGrupe = res;
        this.ucitavanjeSesija = false;
      });
  }

  izbrisiGrupu(grupa: Grupa) {
    this.adminServis.izbrisiDozvoljenuGrupu(grupa.grupaid)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: Grupa[]) => {
        this.dozvoljeneGrupe = res;
        this.ucitavanjeSesija = false;
        this.notifikacija.notify('Grupa izbrisana', MatSnackBarKlase.Plava);
      });
  }

  dodajGrupu() {
    this.adminServis.vratiSveGrupe()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: Grupa[]) => {
        const dialogRef = this.dialog.open(GrupeModalComponent, {
          width: '700px',
          data: { svaGrupa: res, dodajGrupu: null }
        });
        dialogRef.afterClosed().subscribe((grupa: Grupa) => {
          this.adminServis.dodajGrupu(grupa)
            .pipe(takeWhile(() => this.alive))
            .subscribe((grupe: Grupa[]) => {
              this.dozvoljeneGrupe = grupe;
              this.notifikacija.notify('Grupa dodata', MatSnackBarKlase.Plava);
            });
        });
      });
  }

  idiULogove(ppid: number) {
    const parameterObject = {};
    parameterObject['ppid'] = ppid;
    this.router.navigate(['/admin/logovi'], { queryParams: parameterObject })
  }

  paginatorEvent(pageEvent) {
    this.dataSource = [];
    this.rowsPerPage = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.uzmiSveAdminPodatke();
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
