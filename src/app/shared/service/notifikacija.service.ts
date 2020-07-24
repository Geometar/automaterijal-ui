import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifikacijaService {

  constructor(public snackBar: MatSnackBar) { }

  public notify(poruka: string, klasaBoja: string) {
    this.snackBar.open(poruka, '', {
      duration: 2000,
      panelClass: [klasaBoja]
    });
  }
}
