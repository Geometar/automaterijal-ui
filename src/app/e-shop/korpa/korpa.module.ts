import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KorpaComponent } from './korpa.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedMagacinModule } from '../magacin/shared-components/shared-magacin.module';
import { RouterModule, Routes } from '@angular/router';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';

const routes: Routes = [
  {
    path: '',
    component: KorpaComponent
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
  declarations: [KorpaComponent],
  exports: [KorpaComponent]
})
export class KorpaModule { }
