import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigacijaComponent } from './navigacija.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material/material.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FooterModule,
    MaterialModule
  ],
  declarations: [NavigacijaComponent],
  exports: [NavigacijaComponent]
})
export class NavigacijaModule { }
