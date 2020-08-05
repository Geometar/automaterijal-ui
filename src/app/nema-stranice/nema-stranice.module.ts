import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StraniceNijeNadjenaComponent } from './stranice-nije-nadjena.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StraniceNijeNadjenaComponent
  }
];

@NgModule({
  declarations: [
    StraniceNijeNadjenaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [StraniceNijeNadjenaComponent]
})
export class NemaStraniceModule { }
