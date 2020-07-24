import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DasboardComponent } from './dasboard.component';
import { MaterialModule } from 'src/app/shared/material/material.module';

const routes: Routes = [
  {
    path: '',
    component: DasboardComponent
  }
];

@NgModule({
  imports: [
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DasboardComponent],
  exports: [DasboardComponent]
})
export class DasboardModule { }
