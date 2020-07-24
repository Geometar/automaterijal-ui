import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';
import { HtmlService } from 'src/app/e-commerce/servis/html.service';

@Component({
  selector: 'app-brendovi-modal',
  templateUrl: './brendovi-modal.component.html',
  styleUrls: ['./brendovi-modal.component.scss']
})
export class BrendoviModalComponent implements OnInit {

  private alive = true;
  public opis: any;


  constructor(
    public dialogRef: MatDialogRef<BrendoviModalComponent>,
    private htmlServis: HtmlService,
    @Inject(MAT_DIALOG_DATA) public brend: any) { }

  ngOnInit() {
    this.htmlServis.pronadjiDetaljeRobe(this.brend.url)
    .pipe(takeWhile(() => this.alive))
    .subscribe(text => {
      this.opis = text.body;
    });
  }

  zatvoriDialog() {
    this.dialogRef.close();
  }

}
