import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './DatePipe';
import { EmptyPipe } from './EmptyPipe';
import { TranslatePipe } from './PrevodilacPipe';
import { KatalogVreme } from './KatalogVreme';
import { DugacakNaziv } from './DugacakNaziv';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DatePipe, EmptyPipe, TranslatePipe, KatalogVreme, DugacakNaziv],
  exports: [DatePipe, EmptyPipe, TranslatePipe, KatalogVreme, DugacakNaziv]
})
export class PipeModule { }
