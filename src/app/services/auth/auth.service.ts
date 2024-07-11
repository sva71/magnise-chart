import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import * as Routes from '../apiRoutes';
import { Observable, of, Subject, switchMap, tap } from 'rxjs';

export type TokenData = Routes.getToken.Resp | null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _tokenData: TokenData = null;
  private _lastUpdated: Date | null = null;

  private httpClient: HttpClient;

  public gotToken$: Subject<TokenData | null> = new Subject<TokenData>();

  isTokenRequestPending = false;

  constructor(private httpBackend: HttpBackend) {
    this.httpClient = new HttpClient(this.httpBackend);
  }

  get tokenData(): TokenData {
    return this._tokenData;
  }

  set tokenData(value: TokenData | null) {
    this._tokenData = value;
    this.gotToken$.next(value);
  }

  get lastUpdated() {
    return this._lastUpdated;
  }

  set lastUpdated(value) {
    this._lastUpdated = value;
  }

  isTokenExpired(lastUpdated: Date, expiresIn: number): boolean {
    const now = new Date();
    const expirationTime = lastUpdated.getTime() + expiresIn * 1000;
    return now.getTime() >= expirationTime;
  }

  isTokenValid(): boolean {
    return (
      !!this.tokenData &&
      !!this.lastUpdated &&
      !this.isTokenExpired(this.lastUpdated, this.tokenData.expires_in)
    );
  }

  getNewToken(): Observable<TokenData | null> {
    if (this.isTokenRequestPending) {
      return this.gotToken$.pipe(switchMap((token) => of(token)));
    }
    this.isTokenRequestPending = true;
    return this.httpClient
      .request<Routes.getToken.Resp>(
        Routes.getToken.method,
        Routes.getToken.route,
        Routes.getToken.options,
      )
      .pipe(
        tap({
          next: (res) => {
            this.tokenData = res;
            this.lastUpdated = new Date();
          },
          error: () => {
            this.tokenData = null;
            this.lastUpdated = null;
          },
          complete: () => (this.isTokenRequestPending = false),
        }),
      );
  }
}
