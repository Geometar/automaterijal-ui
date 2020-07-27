import { Component, OnInit, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Partner } from '../e-shop/model/dto';
import { LoginService } from '../e-shop/service/login.service';
import { DataService } from '../e-shop/service/data/data.service';
import { LogoutModalComponent } from '../shared/modal/logout-modal/logout-modal.component';
import { takeWhile } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-navigacija',
  templateUrl: './navigacija.component.html',
  styleUrls: ['./navigacija.component.scss']
})
export class NavigacijaComponent implements OnInit, OnDestroy {

  public korpaBadge = 0;
  public partner: Partner;
  public partnerUlogovan = false;
  public openSideNav = false;

  // boolean za unistavanje observera
  private alive = true;

  constructor(
    private korpaServis: DataService,
    private loginServis: LoginService,
    @Inject(PLATFORM_ID) private platformId,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.openSideNav = window.innerWidth < 1150;
    }
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => this.partner = partner);
    this.loginServis.daLiJePartnerUlogovan
      .pipe(takeWhile(() => this.alive))
      .subscribe(bool => this.partnerUlogovan = bool);
    this.korpaServis.inicijalizujKorpu();
    this.korpaServis.trenutnaKorpa
      .pipe(takeWhile(() => this.alive))
      .subscribe(korpa => {
        this.korpaBadge = korpa.roba.length;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (isPlatformBrowser(this.platformId)) {
      this.openSideNav = window.innerWidth < 1150;
    }
  }

  otvoriDialog(): void {
    const dialogRef = this.dialog.open(LogoutModalComponent, {
      width: '400px'
    });
    dialogRef.afterClosed()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
