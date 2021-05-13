import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedMagacinModule } from '../magacin/shared-components/shared-magacin.module';
import { RouterModule, Routes } from '@angular/router';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';
import { AdminComponent } from './admin.component';
import { LogPartneraComponent } from './log-partnera/log-partnera.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  },
  {
    path: 'logovi',
    component: LogPartneraComponent
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
  declarations: [AdminComponent, LogPartneraComponent],
  exports: [AdminComponent]
})
export class AdminModule { }
