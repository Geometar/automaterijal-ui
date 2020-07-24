import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Partner } from '../model/dto';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartnerService } from '../service/partner.service';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit, OnDestroy {

  public partner: Partner;
  public daLiDuguje = false;
  public korisnickoImeMetod = 'novo';
  public losaSifra = false;
  public korisnickoImeJeZauzeto = false;

  public ucitavanje = false;
  private alive = true;

  // sve forme
  public adresaForm: FormGroup;
  public adresaSubmited = false;
  public emailForm: FormGroup;
  public emailSubmited = false;
  public usernameForm: FormGroup;
  public usernameSubmited = false;
  public passwordForm: FormGroup;
  public passwordSubmited = false;

  constructor(
    private formBuilder: FormBuilder,
    private partnerServis: PartnerService,
    private notifikacijaServis: NotifikacijaService,
    private loginServis: LoginService) { }

  ngOnInit() {
    this.loginServis.ulogovaniPartner
      .pipe(takeWhile(() => this.alive))
      .subscribe(partner => this.partner = partner);
    this.daLiDuguje = this.partner.stanje < 0;
    this.inicijalizujSveRegistracioneForme();
  }
  inicijalizujSveRegistracioneForme() {
    this.adresaForm = this.formBuilder.group({
      ulica: ['', [Validators.required, Validators.minLength(3)]],
      grad: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.usernameForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.passwordForm = this.formBuilder.group({
      staraSifra: ['', [Validators.required, Validators.minLength(3)]],
      novaSifra: ['', [Validators.required, Validators.minLength(3)]],
      novaSifra2: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  public daLiKorisnickoImeTrebaDaBudeEmail() {
    return this.korisnickoImeMetod === 'email';
  }

  promeniAdresu(ulica: string, grad: string) {
    const poruka = 'Adresa uspesno promenjena.';
    this.adresaSubmited = true;
    if (this.adresaForm.invalid) {
      return;
    }
    const partner = new Partner();
    partner.ppid = this.partner.ppid;
    partner.adresa = ulica + ', ' + grad;
    this.updejtPartnera(partner, poruka, 'PROMENA_ADRESE');
  }

  promeniLEmail(email: string) {
    const poruka = 'Email je uspesno promenjen.';
    this.emailSubmited = true;
    if (this.emailForm.invalid) {
      return;
    }
    const partner = new Partner();
    partner.ppid = this.partner.ppid;
    partner.email = email;
    this.updejtPartnera(partner, poruka, 'PROMENA_MEJLA');
  }

  promeniUsername() {
    let username = '';
    this.usernameSubmited = true;
    if (this.usernameForm.invalid) {
      return;
    } else if (this.usernameForm.controls.username.value) {
      username = this.usernameForm.controls.username.value;
    }
    const poruka = 'Vaše novo korisničko ime je: ' + username;
    const partner = new Partner();
    partner.ppid = this.partner.ppid;
    partner.webKorisnik = username;
    this.partnerServis.updejtujPartnera(partner, 'PROMENA_IMENA')
      .pipe(
        takeWhile(() => this.alive),
        catchError((error: Response) => {
          if (error.status === 400) {
            this.korisnickoImeJeZauzeto = true;
            return EMPTY;
          }
          return throwError(error);
        }),
        finalize(() => this.ucitavanje = false)
      )
      .subscribe(
        res => {
          this.korisnickoImeJeZauzeto = false;
          this.partner = res;
          this.notifikacijaServis.notify(poruka, MatSnackBarKlase.Zelena);
        },
        error => {
        });
  }

  promeniSifru(staraSifra: string, novaSifra: string, novaSifra2: string) {
    this.passwordSubmited = true;
    if (this.passwordForm.invalid) {
      const a = this.s.staraSifra.errors.minLength;
      return;
    } else if (novaSifra !== novaSifra2) {
      return;
    }

    const partner = new Partner();
    partner.ppid = this.partner.ppid;
    partner.noviPassword = novaSifra;
    partner.stariPassword = staraSifra;

    const poruka = 'Vaša šifra je uspeno promenjena';
    this.partnerServis.updejtujPartnera(partner, 'PROMENA_SIFRE')
      .pipe(
        takeWhile(() => this.alive),
        catchError((error: Response) => {
          if (error.status === 400) {
            this.losaSifra = true;
            return EMPTY;
          }
          return throwError(error);
        }),
        finalize(() => this.ucitavanje = false)
      )
      .subscribe(
        res => {
          this.partner = res;
          this.losaSifra = false;
          this.notifikacijaServis.notify(poruka, MatSnackBarKlase.Zelena);
        },
        error => {
        });
  }

  updejtPartnera(partner: Partner, poruka: string, vrstaPromene: string) {
    this.partnerServis.updejtujPartnera(partner, vrstaPromene)
      .pipe(
        takeWhile(() => this.alive),
        catchError((error: Response) => throwError(error)),
        finalize(() => this.ucitavanje = false)
      )
      .subscribe(
        res => {
          this.partner = res;
          this.notifikacijaServis.notify(poruka, MatSnackBarKlase.Zelena);
        },
        error => {
        });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  // convenience getter for easy access to form fields
  get a() { return this.adresaForm.controls; }
  get e() { return this.emailForm.controls; }
  get u() { return this.usernameForm.controls; }
  get s() { return this.passwordForm.controls; }
}
