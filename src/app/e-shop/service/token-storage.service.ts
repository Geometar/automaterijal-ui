import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from './data/local-storage.service';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  signOut(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(USER_KEY);
  }

  public saveToken(token: string): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.set(TOKEN_KEY, token);
  }

  public getToken(): string {
    return this.storage.get(TOKEN_KEY);
  }

  public saveUser(user): void {
    this.storage.remove(USER_KEY);
    this.storage.set(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }
}
