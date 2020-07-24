import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { Registracija } from 'src/app/e-shop/model/dto';
import { EmailService } from 'src/app/shared/service/email.service';

@Component({
  selector: 'app-registracija-modal',
  templateUrl: './registracija-modal.component.html',
  styleUrls: ['./registracija-modal.component.scss']
})
export class RegistracijaModalComponent implements OnInit, OnDestroy {

  registracije: string[] = ['Fizičko lice', 'Pravno lice'];
  public vrstaRegistracije: string;

  // forme
  public privatnoLiceForm: FormGroup;
  public parvnoLiceForm: FormGroup;
  public odredjenaForma: FormGroup;
  public formaSubmited = false;

  private registracija: Registracija = new Registracija();

  private alive = true;
  public ucitavanje = false;
  constructor(
    public dialogRef: MatDialogRef<RegistracijaModalComponent>,
    private formBuilder: FormBuilder,
    private emailService: EmailService) { }

  ngOnInit() {
    this.vrstaRegistracije = this.registracije[0];
    this.inicijalizujSveRegistracioneForme();
  }

  inicijalizujSveRegistracioneForme() {
    this.privatnoLiceForm = this.formBuilder.group({
      imeIPrezime: ['', [Validators.required, Validators.minLength(3)]],
      grad: ['', [Validators.required, Validators.minLength(2)]],
      adresa: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      kontaktTelefon: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.parvnoLiceForm = this.formBuilder.group({
      nazivFirme: ['', [Validators.required, Validators.minLength(3)]],
      pib: ['', [Validators.required, Validators.minLength(3)]],
      grad: ['', [Validators.required, Validators.minLength(2)]],
      adresa: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      kontaktTelefon: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.odredjenaForma = this.parvnoLiceForm;
  }

  registracijaKorisnika() {
    this.formaSubmited = true;
    if (this.vrstaRegistracije === this.registracije[0]) {
      if (this.privatnoLiceForm.invalid) {
        return;
      } else {
        this.registracija = new Registracija();
        this.popuniRegistracijuZaPrivatnaLica();
      }
    } else {
      if (this.parvnoLiceForm.invalid) {
        return;
      } else {
        this.registracija = new Registracija();
        this.popuniRegistracijuZaPravnaLica();
      }
    }
    this.emailService.posaljiMailZaRegistraciju(this.registracija).pipe(
      takeWhile(() => this.alive),
      catchError((error: Response) => throwError(error)),
      finalize(() => this.ucitavanje = false)
    ).subscribe(res => {
    }, error => {
    });
  }

  public odrediFormu() {
    if (this.vrstaRegistracije === this.registracije[0]) {
      this.odredjenaForma = this.privatnoLiceForm;
    } else {
      this.odredjenaForma = this.parvnoLiceForm;
    }
  }

  private popuniRegistracijuZaPrivatnaLica() {
    this.registracija.imeIPrezime = this.privatno.imeIPrezime.value;
    this.registracija.grad = this.privatno.grad.value;
    this.registracija.adresa = this.privatno.adresa.value;
    this.registracija.email = this.privatno.email.value;
    this.registracija.kontaktTelefon = this.privatno.kontaktTelefon.value;
    this.registracija.daLiJePravnoLice = false;
  }

  private popuniRegistracijuZaPravnaLica() {
    this.registracija.nazivFirme = this.pravno.nazivFirme.value;
    this.registracija.pib = this.pravno.pib.value;
    this.registracija.grad = this.pravno.grad.value;
    this.registracija.adresa = this.pravno.adresa.value;
    this.registracija.email = this.pravno.email.value;
    this.registracija.kontaktTelefon = this.pravno.kontaktTelefon.value;
    this.registracija.daLiJePravnoLice = true;
  }

  zatvoriDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.alive = false;
  }
  
  // convenience getter for easy access to form fields
  get privatno() { return this.privatnoLiceForm.controls; }
  get pravno() { return this.parvnoLiceForm.controls; }

}
