import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PartnerComponent } from './partner.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedMagacinModule } from '../magacin/shared-components/shared-magacin.module';

const routes: Routes = [
  {
    path: '',
    component: PartnerComponent
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
  declarations: [PartnerComponent],
  exports: [PartnerComponent]
})
export class PartnerModule { }
