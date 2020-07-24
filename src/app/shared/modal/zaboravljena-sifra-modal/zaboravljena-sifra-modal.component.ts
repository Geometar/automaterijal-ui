import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { EmailService } from 'src/app/shared/service/email.service';
import { ResetSifre } from 'src/app/e-shop/model/dto';
import { NotifikacijaService } from '../../service/notifikacija.service';
import { MatSnackBarKlase } from '../../model/konstante';

@Component({
  selector: 'app-zaboravljena-sifra-modal',
  templateUrl: './zaboravljena-sifra-modal.component.html',
  styleUrls: ['./zaboravljena-sifra-modal.component.scss']
})
export class ZaboravljenaSifraModalComponent implements OnInit, OnDestroy {

  public resetSifre: ResetSifre = new ResetSifre();
  public mailUspesnoPoslat = false;
  public mailPoslatPartneru = false;

  // forme
  public zaboravljeSifraForma: FormGroup;
  public formaSubmited = false;

  private alive = true;
  public ucitavanje = false;
  constructor(
    public dialogRef: MatDialogRef<ZaboravljenaSifraModalComponent>,
    private formBuilder: FormBuilder,
    private emailService: EmailService,
    private notifikacijaServis: NotifikacijaService) { }

  ngOnInit() {
    this.inicijalizujSveRegistracioneForme();
  }
  inicijalizujSveRegistracioneForme() {
    this.zaboravljeSifraForma = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  posaljiMailZaboravljenaSifra() {
    this.formaSubmited = true;
    if (this.zaboravljeSifraForma.invalid) {
      return;
    }
    this.ucitavanje = true;
    this.resetSifre.email = this.zaboravljeno.email.value;
    this.emailService
    .posaljiMailZaResetovanjeSifre(this.resetSifre)
    .pipe(
      takeWhile(() => this.alive),
      catchError((error: Response) => {
        if (error.status === 400 || error.status === 404) {
          const snackPoruka = 'E-mail ili korisničko ime ne postoji u našoj bazi.';
          this.notifikacijaServis.notify(snackPoruka, MatSnackBarKlase.Crvena);
          return EMPTY;
        } else if (error.status === 503) {
          this.mailUspesnoPoslat = true;
          return EMPTY;
        }
        throwError(error);
      }),
      finalize(() => this.ucitavanje = false)
    ).subscribe(res => {
      this.mailUspesnoPoslat = true;
      this.mailPoslatPartneru = true;
    }, error => {
      this.mailPoslatPartneru = false;
    });
  }

  zatvoriDialog() {
    this.dialogRef.close();
  }
  
  ngOnDestroy() {
    this.alive = false;
  }

  // convenience getter for easy access to form fields
  get zaboravljeno() { return this.zaboravljeSifraForma.controls; }
}
