import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RobaComponent } from './roba.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedMagacinModule } from '../shared-components/shared-magacin.module';
import { RobaDetaljiComponent } from '../roba-detalji/roba-detalji.component';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';

const routes: Routes = [
  {
    path: '',
    component: RobaComponent
  },
  {
    path: ':id',
    component: RobaDetaljiComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedMagacinModule,
    PipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RobaComponent, RobaDetaljiComponent],
  exports: [RobaComponent]
})
export class RobaModule { }
