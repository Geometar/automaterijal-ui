import { Component, OnInit, OnDestroy } from '@angular/core';
import { Credentials, Partner } from '../model/dto';
import { LoginService } from '../service/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegistracijaModalComponent } from 'src/app/shared/modal/registracija-modal/registracija-modal.component';
import { ZaboravljenaSifraModalComponent } from 'src/app/shared/modal/zaboravljena-sifra-modal/zaboravljena-sifra-modal.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/data/local-storage.service';
import { PrvoLogovanjeModalComponent } from 'src/app/shared/modal/prvo-logovanje-modal/prvo-logovanje-modal.component';
import { DataService } from '../service/data/data.service';
import { takeWhile } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { TokenStorageService } from '../service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public registerForm: FormGroup;
  public submitted = false;
  public credentials: Credentials = {};
  public partner: Partner;
  public uspesnoLogovanje = true;

  // boolean za unistavanje observera
  private alive = true;

  constructor(
    private loginServis: LoginService,
    private formBuilder: FormBuilder,
    public dataService: LocalStorageService,
    public router: Router,
    private korpaServis: DataService,
    private authServis: AuthService,
    private tokenStorage: TokenStorageService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.uspesnoLogovanje = true;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  login() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.authServis.login(this.credentials)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);
        this.vratiKorisnika();
      });
  }

  vratiKorisnika() {
    this.loginServis.vratiUlogovanogKorisnika(true)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: Partner) => {
        if (res !== null) {
          this.partner = res;
          this.uspesnoLogovanje = true;
          if (this.partner.webStatus !== 4) {
            this.router.navigateByUrl('naslovna');
            this.loginServis.setDaLiJeUserLogovan(true);
            this.loginServis.setUlogovanogPartner(this.partner);
            this.korpaServis.inicijalizujKorpu();
          } else {
            this.loginServis.setDaLiJeUserLogovan(false);
            this.dataService.logout();
          }
          if (this.partner.loginCount === 0 && this.dialog.openDialogs.length === 0) {
            this.dialog.open(PrvoLogovanjeModalComponent, {
              width: '600px',
              data: this.partner,
              disableClose: true
            });
          }
        } else {
          this.uspesnoLogovanje = false;
          this.loginServis.setDaLiJeUserLogovan(false);
          this.dataService.logout();
        }
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

  enterNaFormi(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
