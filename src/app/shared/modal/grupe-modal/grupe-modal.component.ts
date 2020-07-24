import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Grupa } from 'src/app/e-shop/model/dto';

@Component({
  selector: 'app-grupe-modal',
  templateUrl: './grupe-modal.component.html',
  styleUrls: ['./grupe-modal.component.scss']
})
export class GrupeModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GrupeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
