import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss']
})
export class LogoutModalComponent implements OnInit, OnDestroy {

  // boolean za unistavanje observera
  private alive = true;

  constructor(
    public dialogRef: MatDialogRef<LogoutModalComponent>,
    private router: Router,
    private loginServis: LoginService) { }

  ngOnInit() {
    this.loginServis.vratiUlogovanogKorisnika(false)
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => {
        if (partner === null) {
          this.dialogRef.close();
          this.router.navigateByUrl('naslovna');
          this.loginServis.izbaciPartnerIzSesije();
        }
      });
  }

  logout() {
    this.loginServis.logout();
    this.router.navigateByUrl('naslovna');
    this.dialogRef.close();
  }

  ostaniUlogovan() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
