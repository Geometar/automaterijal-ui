import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedMagacinModule } from '../magacin/shared-components/shared-magacin.module';
import { RouterModule, Routes } from '@angular/router';
import { FakturaDetaljiComponent } from './faktura-detalji/faktura-detalji.component';
import { FakturaComponent } from './faktura.component';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';

const routes: Routes = [
  {
    path: '',
    component: FakturaComponent
  },
  {
    path: ':id',
    component: FakturaDetaljiComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PipeModule,
    MaterialModule,
    SharedMagacinModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FakturaComponent, FakturaDetaljiComponent],
  exports: [FakturaComponent]
})
export class FaktureModule { }
