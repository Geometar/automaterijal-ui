import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-slika-modal',
  templateUrl: './slika-modal.component.html',
  styleUrls: ['./slika-modal.component.scss']
})
export class SlikaModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SlikaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  
  zatvoriDialog() {
    this.dialogRef.close();
  }

}
