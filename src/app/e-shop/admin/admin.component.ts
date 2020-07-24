import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminServiceService } from '../service/admin-service.service';
import { LogovanjaPage, Logovanja, Grupa } from '../model/dto';
import { takeWhile } from 'rxjs/operators';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';
import { MatDialog } from '@angular/material/dialog';
import { GrupeModalComponent } from 'src/app/shared/modal/grupe-modal/grupe-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public logovanja: Logovanja[];
  public dozvoljeneGrupe: Grupa[];
  public dataSource: any;

  public ucitavanjeLogovanja = false;
  public ucitavanjeSesija = false;

  // Paging and Sorting elements
  public displayedColumns: string[] = ['ppid', 'naziv', 'vreme'];
  public rowsPerPage = 10;
  public pageIndex = 0;
  public tableLength;

  // boolean za unistavanje observera
  private alive = true;

  constructor(private adminServis: AdminServiceService,
    private notifikacija: NotifikacijaService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.uzmiSveAdminPodatke();
  }

  uzmiSveAdminPodatke() {
    this.ucitavanjeLogovanja = true;
    this.adminServis.vratiSvaLogovanja(this.pageIndex, this.rowsPerPage)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: LogovanjaPage) => {
        this.logovanja = res.content;
        this.dataSource = this.logovanja;
        this.rowsPerPage = res.size;
        this.pageIndex = res.number;
        this.tableLength = res.totalElements;
        this.ucitavanjeLogovanja = false;
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
