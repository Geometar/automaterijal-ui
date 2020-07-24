import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';
import { KategorijeComponent } from './kategorije.component';
import { SharedMagacinModule } from '../shared-components/shared-magacin.module';
import { KategorijaSpecificnaComponent } from './kategorija-specificna/kategorija-specificna.component';


const routes: Routes = [
  {
    path: '',
    component: KategorijeComponent
  },
  {
    path: ':id',
    component: KategorijaSpecificnaComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedMagacinModule,
    PipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KategorijeComponent, KategorijaSpecificnaComponent],
  exports: [KategorijeComponent, KategorijaSpecificnaComponent]
})
export class KategorijeModule { }
