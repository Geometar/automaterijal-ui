import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sesija-istekla-modal',
  templateUrl: './sesija-istekla-modal.component.html',
  styleUrls: ['./sesija-istekla-modal.component.scss']
})
export class SesijaIsteklaModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SesijaIsteklaModalComponent>) { }

  ngOnInit() {
  }

  zatvoriDialog() {
    this.dialogRef.close();
  }

}
