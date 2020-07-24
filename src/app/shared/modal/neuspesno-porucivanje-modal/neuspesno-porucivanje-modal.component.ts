import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Roba, Fakutra, FakturaDetalji } from 'src/app/e-shop/model/dto';
import { RobaPromena } from 'src/app/e-shop/model/porudzbenica';

@Component({
  selector: 'app-neuspesno-porucivanje-modal',
  templateUrl: './neuspesno-porucivanje-modal.component.html',
  styleUrls: ['./neuspesno-porucivanje-modal.component.scss']
})
export class NeuspesnoPorucivanjeModalComponent implements OnInit {
  public fakturaModal: Fakutra;
  public robaModal: Roba[];
  public robaPromena: RobaPromena[] = [];
  
  displayedColumns: string[] = ['katBr', 'trazeno', 'raspolozivo'];
  dataSource = [];

  constructor(
    public dialogRef: MatDialogRef<NeuspesnoPorucivanjeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    this.fakturaModal = this.data.faktura;
    this.robaModal = this.data.roba;
    this.popuniPromene();
  }

  popuniPromene() {
    this.robaModal.forEach((roba: Roba) => {
      this.fakturaModal.detalji.forEach((detalji: FakturaDetalji) => {
        if (detalji.robaId === roba.robaid) {
          const robaPromena = new RobaPromena();
          robaPromena.katbr = roba.katbr;
          robaPromena.opis = roba.naziv;
          robaPromena.rapolozivaKolicina = roba.stanje;
          robaPromena.trazenaKolicina = detalji.kolicina;
          this.robaPromena.push(robaPromena);
        }
      });
    });
    this.dataSource = this.robaPromena;
  }

  zatvoriDialog() {
    this.dialogRef.close();
  }
}
