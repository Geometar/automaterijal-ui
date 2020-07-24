import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Poruka } from 'src/app/e-commerce/model/dto';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { EmailService } from 'src/app/shared/service/email.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NotifikacijaService } from '../../service/notifikacija.service';
import { MatSnackBarKlase } from '../../model/konstante';

@Component({
  selector: 'app-poruka-modal',
  templateUrl: './poruka-modal.component.html',
  styleUrls: ['./poruka-modal.component.scss']
})
export class PorukaModalComponent implements OnInit, OnDestroy {
  public porukaForm: FormGroup;
  public porukaSubmited = false;
  public porukaPoslata = false;

  private alive = true;
  public ucitavanje = false;

  constructor(
    public dialogRef: MatDialogRef<PorukaModalComponent>,
    private formBuilder: FormBuilder,
    private emailServis: EmailService,
    private notifikacijaServis: NotifikacijaService
  ) { }

  ngOnInit() {
    this.inicijalizujForme();
  }

  inicijalizujForme() {
    this.porukaForm = this.formBuilder.group({
      ime: [''],
      prezime: [''],
      firma: [''],
      telefon: [''],
      posta: ['', [Validators.required, Validators.email]],
      poruka: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  posaljiPoruku() {
    this.porukaSubmited = true;
    if (this.porukaForm.invalid) {
      return;
    }
    const poruka = this.popuniPoruku();
    this.ucitavanje = true;
    this.emailServis.posaljiPoruku(poruka)
      .pipe(
        takeWhile(() => this.alive),
        catchError((error: Response) => throwError(error)),
        finalize(() => this.ucitavanje = false)
      ).subscribe(res => {
        this.porukaPoslata = true;
        this.porukaForm.reset();
        this.porukaSubmited = false;
        this.notifikacijaServis.notify('Poruka je uspešno poslata', MatSnackBarKlase.Zelena);
      }, error => {
        this.notifikacijaServis.notify('Došlo je do greške, poruka nije poslata', MatSnackBarKlase.Crvena);
        this.dialogRef.close();
      });
  }

  popuniPoruku(): Poruka {
    const poruka = new Poruka();
    poruka.ime = this.p.ime.value;
    poruka.prezime = this.p.prezime.value;
    poruka.firma = this.p.firma.value;
    poruka.telefon = this.p.telefon.value;
    poruka.posta = this.p.posta.value;
    poruka.poruka = this.p.poruka.value;
    return poruka;
  }
  // convenience getter for easy access to form fields
  get p() { return this.porukaForm.controls; }

  zatvoriDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
