import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistracijaModalComponent } from '../shared/modal/registracija-modal/registracija-modal.component';
import { ZaboravljenaSifraModalComponent } from '../shared/modal/zaboravljena-sifra-modal/zaboravljena-sifra-modal.component';
import { PorukaModalComponent } from '../shared/modal/poruka-modal/poruka-modal.component';
import { UpitModalComponent } from '../shared/modal/upit-modal/upit-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public img_logo = environment.baseUrl + '/assets/slike/logo/automaterijal.png';
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  otvoriPorukuDialog() {
    this.dialog.open(PorukaModalComponent, {
      width: '400px'
    });
  }

  otvoriResgracijaDialog() {
    this.dialog.open(RegistracijaModalComponent, {
      width: '400px'
    });
  }
  otvoriZaboravljenuSifruDialog() {
    this.dialog.open(ZaboravljenaSifraModalComponent, {
      width: '400px'
    });
  }

  otvoriUpitDialog() {
    this.dialog.open(UpitModalComponent, {
      width: '400px'
    });
  }
}
