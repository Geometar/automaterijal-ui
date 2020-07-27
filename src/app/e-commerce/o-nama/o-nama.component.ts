import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrendoviModalComponent } from 'src/app/shared/modal/brendovi-modal/brendovi-modal.component';
import { Brend, Konastante } from '../dasboard/kategorija';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-o-nama',
  templateUrl: './o-nama.component.html',
  styleUrls: ['./o-nama.component.scss']
})
export class ONamaComponent implements OnInit {
  innerWidth;
  public mySlideBrands = [];

  public mySlideLargeOptions = {
    items: 7, margin: 20,
    dots: true, nav: false, autoplay: true,
    autoplayTimeout: 2500, rewind: true
  };

  public mySlideSmallOptions = {
    items: 3, margin: 5,
    dots: true, nav: false, autoplay: true,
    autoplayTimeout: 2500, rewind: true
  };

  public isLargeDiv = true;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLargeDiv = window.innerWidth > 750;
      this.innerWidth = window.innerWidth;
    }
    const konstante = new Konastante();
    this.mySlideBrands = konstante.brendovi;
    this.changeSlideConfiguration();
  }

  changeSlideConfiguration() {
    if (this.innerWidth < 750) {
      this.isLargeDiv = false;
    } else {
      this.isLargeDiv = true;
    }
  }

  otvoriDialog(brend: Brend) {
    this.dialog.open(BrendoviModalComponent, {
      width: '700px',
      data: brend
    });
  }
}
