import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Roba } from 'src/app/e-shop/model/dto';

@Component({
  selector: 'app-dashboard-promena-robe',
  templateUrl: './dashboard-promena-robe.component.html',
  styleUrls: ['./dashboard-promena-robe.component.scss']
})
export class DashboardPromenaRobeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DashboardPromenaRobeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
