import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { RobaKorpa } from 'src/app/e-shop/model/porudzbenica';

@Component({
  selector: 'app-izmena-kolicine-modal',
  templateUrl: './izmena-kolicine-modal.component.html',
  styleUrls: ['./izmena-kolicine-modal.component.scss']
})
export class IzmenaKolicineModalComponent implements OnInit {

  public stanje = [];
  public data: RobaKorpa;

  constructor(
    public dialogRef: MatDialogRef<IzmenaKolicineModalComponent>,
    @Inject(MAT_DIALOG_DATA) public roba: RobaKorpa) {}

  ngOnInit() {
    this.data = _.clone(this.roba);
    this.popuniSelectStanja();
  }

  popuniSelectStanja() {
    let index = 1;
    while (index <= this.data.stanje) {
      this.stanje[index - 1] = index;
      index++;
    }
  }

  sacuvajIzmene() {
    this.data.kolicina = _.toNumber(this.data.kolicina);
    this.data.cenaUkupno = this.data.kolicina * this.data.cenaKom;
    this.dialogRef.close(this.data);
  }

  bezIzmena() {
    this.dialogRef.close();
  }
}
