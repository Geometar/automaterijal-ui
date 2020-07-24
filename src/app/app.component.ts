import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // import Router and NavigationEnd

import { filter } from 'rxjs/operators';

declare var gtag

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Automaterijal';

  constructor(public router: Router) {
    const navEndEvent$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    );
    navEndEvent$.subscribe((e: NavigationEnd) => {
      gtag('config', 'UA-143220679-1', {'page_path': e.urlAfterRedirects});
    });
  }
}
