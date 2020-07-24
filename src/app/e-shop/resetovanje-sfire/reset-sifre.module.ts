import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedMagacinModule } from '../magacin/shared-components/shared-magacin.module';
import { Routes, RouterModule } from '@angular/router';
import { ResetovanjeSfireComponent } from './resetovanje-sfire.component';

const routes: Routes = [
  {
    path: '',
    component: ResetovanjeSfireComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedMagacinModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResetovanjeSfireComponent],
  exports: [ResetovanjeSfireComponent]
})
export class ResetSifreModule { }
