import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpService } from './http';
import { ApiResponse } from '../../models/api-response';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpService: HttpService) {
    //
  }

  login(phone: string, password: string): Observable<ApiResponse<User>> {
    return this.httpService.post<ApiResponse<User>>('admin/Authentication/LoginWithPassword', { phone, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
        })
      );
  }
    isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }




}
