import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from './shared/modal/modal.module';
import { NavigacijaModule } from './navigacija/navigacija.module';
import { AuthGuard } from './shared/guard/auth-guard';
import { HttpErrorInterceptor } from './shared/interceptor/error-interceptor';
import { AdminGuard } from './shared/guard/admin-guard';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { AppRoutingModule } from './app-routing.module';
import { authInterceptorProviders } from './shared/interceptor/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ModalModule,
    StorageServiceModule,
    HttpClientModule,
    NavigacijaModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    authInterceptorProviders,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
