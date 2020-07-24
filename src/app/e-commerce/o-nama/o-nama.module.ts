import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ONamaComponent } from './o-nama.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OwlModule } from 'ngx-owl-carousel';

const routes: Routes = [
  {
    path: '',
    component: ONamaComponent
  }
];

@NgModule({
  imports: [
    CarouselModule,
    CommonModule,
    OwlModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ONamaComponent],
  exports: [ONamaComponent]
})
export class ONamaModule { }
