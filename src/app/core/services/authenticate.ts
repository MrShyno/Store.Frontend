import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, switchMap } from 'rxjs';
import { HttpService } from './http';
import { TokenStorageService } from './TokenStorage/token-storage';
import { UserInfo, UserFullData } from '../../models/Users/user';
import { CaptchaResponse } from '../../models/Captcha/CaptchaResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private httpService = inject(HttpService);
  private tokenStorage = inject(TokenStorageService);

  private currentUserSubject = new BehaviorSubject<UserFullData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentUser = signal<UserInfo | null>(null);
  public userName = signal('');

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  private userPermissions = signal<string[]>([]);
  constructor() {
    this.loadUserFromStorage();
  }
  private loadUserFromStorage(): void {
    const storedUser = sessionStorage.getItem('user_info');
    if (storedUser) {
      try {
        const userInfo: UserInfo = JSON.parse(storedUser);
        this.currentUser.set(userInfo);
        this.userName.set(`${userInfo.firstName} ${userInfo.lastName}`);
      } catch {
        sessionStorage.removeItem('user_info');
      }
    }
  }

  generateCaptcha(): Observable<CaptchaResponse> {
    return this.httpService.post<CaptchaResponse>(
      'admin/Authentication/GenerateCaptcha', null
    );
  }
  register(
    firstName: string,
    lastName: string,
    phone: string,
    password: string,
    captchaId: string,
    captchaAnswer: string
  ) {
    return this.httpService.post<any>(
      "admin/Authentication/Register",
      {
        firstName,
        lastName,
        phone,
        password,
        captchaId,
        captchaAnswer
      }
    );
  }
  login
    (
      phone: string,
      password: string,
      rememberMe: boolean,
      captchaId: string,
      captchaAnswer: string
    ): Observable<UserFullDataResponse> {

    return this.httpService
      .post<LoginResponse>(
        'admin/Authentication/LoginWithPassword',
        {
          phone,
          password,
          rememberMe,
          captchaId,
          captchaAnswer
        }
      )
      .pipe(
        switchMap(response => {

          if (response.isSuccess && response.data) {

            this.tokenStorage.setTokens(
              response.data.accessToken,
              response.data.refreshToken
            );

            return this.fetchUserWithRolePermissions();
          }

          throw new Error('Login failed');
        })
      );
  }

  fetchUserWithRolePermissions(): Observable<UserFullDataResponse> {
    return this.httpService
      .get<UserFullDataResponse>('admin/Users/GetUserWithRolePermissions')
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            const userData = response.data;

            this.currentUserSubject.next(userData);

            const userInfo: UserInfo = {
              userId: userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName
            };

            this.currentUser.set(userInfo);
            this.userName.set(`${userInfo.firstName} ${userInfo.lastName}`);

            const permissions = userData.roles.flatMap(role => role.permissions);
            this.userPermissions.set(permissions);

            sessionStorage.setItem('user_info', JSON.stringify(userInfo));
          }
        })
      );
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  restoreSession(): Observable<UserFullDataResponse> {
    if (this.currentUserSubject.value) {
      return of(this.currentUserSubject.value as unknown as UserFullDataResponse);
    }

    return this.fetchUserWithRolePermissions();
  }

  logout(): Observable<any> {
    sessionStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.userName.set('');
    this.userPermissions.set([]);
    this.tokenStorage.clearTokens();
    return this.httpService.post('admin/Authentication/Logout', {});
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.httpService.post<RefreshTokenResponse>('admin/Authentication/RefreshToken', {});
  }

  getCurrentUser(): UserFullData | null {
    return this.currentUserSubject.value;
  }

  getRefreshTokenSubject(): BehaviorSubject<any> {
    return this.refreshTokenSubject;
  }

  getIsRefreshing(): boolean {
    return this.isRefreshing;
  }

  setIsRefreshing(value: boolean): void {
    this.isRefreshing = value;
  }
}

interface LoginResponse {
  data: {
    userId: number;
    firstName: string;
    lastName: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
  };
  isSuccess: boolean;
  status: string;
  message: string;
  errors: any[];
}


interface RefreshTokenResponse {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  isSuccess: boolean;
  message: string;
}

interface UserFullDataResponse {
  data: UserFullData;
  isSuccess: boolean;
  status: string;
  message: string;
  errors: any[];
}
