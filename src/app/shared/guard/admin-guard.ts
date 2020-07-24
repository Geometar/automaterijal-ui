
import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/e-shop/service/login.service';
import { Partner } from 'src/app/e-shop/model/dto';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; // since RxJs 6
import { LocalStorageService } from 'src/app/e-shop/service/data/local-storage.service';
@Injectable()
export class AdminGuard implements CanActivate {

    constructor(
        private loginServis: LoginService,
        private router: Router,
        private storageServis: LocalStorageService) { }
    // ...
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.loginServis.vratiUlogovanogKorisnika(false).pipe(
            map((partner: Partner) => {
                if (partner != null && partner.ppid && partner.privilegije === 2047) {
                    return true;
                } else {
                    const partnerStorage = this.storageServis.procitajPartneraIzMemorije();
                    if (partnerStorage !== null && partnerStorage.ppid) {
                        this.loginServis.izbaciPartnerIzSesije();
                    }
                    this.router.navigate(['/naslovna']);
                    return false;
                }
            })
        );
    }
}
