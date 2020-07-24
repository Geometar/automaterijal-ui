import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PromenaSifre } from '../model/dto';
import { takeWhile, finalize, catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PartnerService } from '../service/partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifikacijaService } from 'src/app/shared/service/notifikacija.service';
import { MatSnackBarKlase } from 'src/app/shared/model/konstante';

@Component({
  selector: 'app-resetovanje-sfire',
  templateUrl: './resetovanje-sfire.component.html',
  styleUrls: ['./resetovanje-sfire.component.scss']
})
export class ResetovanjeSfireComponent implements OnInit, OnDestroy {
  public promenaSifreForm: FormGroup;
  public submitted = false;
  public uspesnoLogovanje = true;
  private staraSifra: string;
  private ppid: number;

  public ucitavanje = false;
  private alive = true;
  public uspesnaPromena = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private partnerServis: PartnerService,
    private notifikacijaServis: NotifikacijaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.promenaSifreForm = this.formBuilder.group({
      pass1: ['', [Validators.required, Validators.minLength(3)]],
      pass2: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.route.params
      .pipe(takeWhile(() => this.alive))
      .subscribe((params: Params) => {
        this.staraSifra = params.id;
      });
    this.route.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe((params: Params) => {
        this.ppid = params.id;
      });
  }

  // convenience getter for easy access to form fields
  get r() { return this.promenaSifreForm.controls; }

  promeniSifru() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.promenaSifreForm.invalid || this.r.pass1.value !== this.r.pass2.value) {
      return;
    }
    const dto = this.napraviDto();
    this.partnerServis.promeniSifru(dto, false).pipe(
      takeWhile(() => this.alive),
      catchError((error: Response) => {
        if (error.status === 400) {
          this.uspesnaPromena = false;
          return EMPTY;
        }
        return throwError(error);
      }),
      finalize(() => this.ucitavanje = false)
    )
      .subscribe(
        res => {
          this.uspesnaPromena = true;
          this.notifikacijaServis.notify('Šifra uspešno promenjena', MatSnackBarKlase.Zelena);
          this.router.navigate(['/login']);
        },
        error => {
          this.uspesnaPromena = false;
        });
  }

  private napraviDto(): PromenaSifre {
    const dto = new PromenaSifre();
    dto.sifra = this.r.pass1.value;
    dto.ponovljenjaSifra = this.r.pass2.value;
    dto.ppid = this.ppid;
    dto.staraSifra = this.staraSifra;
    return dto;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
