import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-uspesno-porucivanje-modal',
  templateUrl: './uspesno-porucivanje-modal.component.html',
  styleUrls: ['./uspesno-porucivanje-modal.component.scss']
})
export class UspesnoPorucivanjeModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UspesnoPorucivanjeModalComponent>) {}

  ngOnInit() {
  }

  zatvori() {
    this.dialogRef.close();
  }

}
