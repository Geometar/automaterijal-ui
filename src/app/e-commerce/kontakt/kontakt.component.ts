import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/shared/service/email.service';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Poruka } from '../model/dto';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';

@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.scss']
})
export class KontaktComponent implements OnInit, OnDestroy {
  public porukaForm: FormGroup;
  public porukaSubmited = false;

  // boolean za unistavanje observera
  private alive = true;

  public ucitavanje = false;

  ngOnInit() {
    this.inicijalizujForme();
    }

  constructor(
    private formBuilder: FormBuilder,
    private emailServis: EmailService,
    private notifikacijaServis: NotifikacijaService
  ) {}

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
    this.emailServis.posaljiPoruku(poruka)
    .pipe(
      takeWhile(() => this.alive),
      catchError((error: Response) =>  throwError(error)),
      finalize(() => this.ucitavanje = false)
    ).subscribe(res => {
    }, error => {
      this.notifikacijaServis.notify('Poruka nije poslata, pokusajte kasnije.', MatSnackBarKlase.Crvena);
    });
    this.notifikacijaServis.notify('Poruka uspešno poslatata', MatSnackBarKlase.Plava);
    this.porukaForm.reset();
    this.porukaSubmited = false;
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

  ngOnDestroy() {
    this.alive = false;
  }
}
