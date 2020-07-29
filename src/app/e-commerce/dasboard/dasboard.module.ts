import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DasboardComponent } from './dasboard.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ProizvodjaciComponent } from './proizvodjaci/proizvodjaci.component';

const routes: Routes = [
  {
    path: '',
    component: DasboardComponent
  },
  {
    path: ':id',
    component: ProizvodjaciComponent
  }
];

@NgModule({
  imports: [
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DasboardComponent, ProizvodjaciComponent],
  exports: [DasboardComponent, ProizvodjaciComponent]
})
export class DasboardModule { }
