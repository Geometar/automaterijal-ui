import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './shared/guard/auth-guard';
import { AdminGuard } from './shared/guard/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: '/naslovna', pathMatch: 'full' },
  { path: 'naslovna', loadChildren: () => import('./e-commerce/dasboard/dasboard.module').then(m => m.DasboardModule) },
  { path: 'naslovna/:id', loadChildren: () => import('./e-commerce/dasboard/dasboard.module').then(m => m.DasboardModule) },
  { path: 'o-nama', loadChildren: () => import('./e-commerce/o-nama/o-nama.module').then(m => m.ONamaModule) },
  { path: 'kontakt', loadChildren: () => import('./e-commerce/kontakt/kontakt.module').then(m => m.KontaktModule) },
  { path: 'roba', loadChildren: () => import('./e-shop/magacin/roba/roba.module').then(m => m.RobaModule) },
  { path: 'roba/:id', loadChildren: () => import('./e-shop/magacin/roba/roba.module').then(m => m.RobaModule) },
  { path: 'login', loadChildren: () => import('./e-shop/login/login.module').then(m => m.LoginModule) },
  { path: 'admin', loadChildren: () => import('./e-shop/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard] },
  { path: 'reset-sifre/:id', loadChildren: () => import('./e-shop/resetovanje-sfire/reset-sifre.module').then(m => m.ResetSifreModule) },
  {
    path: 'licni-podaci',
    loadChildren: () => import('./e-shop/partner/partner.module').then(m => m.PartnerModule), canActivate: [AuthGuard]
  },
  {
    path: 'porudzbenice',
    loadChildren: () => import('./e-shop/faktura/fakture.module').then(m => m.FaktureModule), canActivate: [AuthGuard]
  },
  {
    path: 'porudzbenice/:id',
    loadChildren: () => import('./e-shop/faktura/fakture.module').then(m => m.FaktureModule), canActivate: [AuthGuard]
  },
  { path: 'korpa', loadChildren: () => import('./e-shop/korpa/korpa.module').then(m => m.KorpaModule)},
  { path: 'kategorije', loadChildren: () => import('./e-shop/magacin/kategorije/kategorije.module').then(m => m.KategorijeModule) },
  { path: 'kategorije/:id', loadChildren: () => import('./e-shop/magacin/kategorije/kategorije.module').then(m => m.KategorijeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
