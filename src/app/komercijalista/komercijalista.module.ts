import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IzvestajComponent } from './izvestaj/izvestaj.component';
import { MaterialModule } from '../shared/material/material.module';
import { FooterModule } from '../footer/footer.module';
import { RouterModule, Routes } from '@angular/router';
import { KreiranjeIzvestajComponent } from './kreiranje-izvestaj/kreiranje-izvestaj.component';
import { IzvestajDetaljiComponent } from './izvestaj-detalji/izvestaj-detalji.component';

const routes: Routes = [
  {
    path: '',
    component: IzvestajComponent
  },
  {
    path: 'kreiraj',
    component: KreiranjeIzvestajComponent
  },
  {
    path: 'detalji/:id',
    component: IzvestajDetaljiComponent
  }
];

@NgModule({
  declarations: [IzvestajComponent, KreiranjeIzvestajComponent, IzvestajDetaljiComponent],
  imports: [
    CommonModule,
    RouterModule,
    FooterModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [IzvestajComponent]
})
export class KomercijalistaModule { }
