import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../http';
import { CreateUserRequest, UpdateUserRequest } from '../../../models/Users/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpService);

  private readonly endpoint = 'admin/Users';


  getAllUsers
  (
    params?: {
      filter?: string;
      orderBy?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<any> {
    return this.http.get<any>(
      `${this.endpoint}/GetAllUsers`,
      params
    );
  }


  getUserById
  (
    id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.endpoint}/GetUserById/${id}`
    );
  }


  createUser
  (
    request: CreateUserRequest
  ): Observable<any> {
    return this.http.post<any>(
      `${this.endpoint}/CreateUser`,
      request
    );
  }


  updateUser
  (
    request: UpdateUserRequest
  ): Observable<any> {
    return this.http.put<any>(
      `${this.endpoint}/UpdateUser`,
      request
    );
  }


  removeUser
  (
    id: number
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.endpoint}/RemoveUser/${id}`
    );
  }


  revokeUser
  (
    id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.endpoint}/RevokeUser/${id}`
    );
  }


  disableUser
  (
    userId: number
  ): Observable<any> {
    return this.http.post<any>(
      `${this.endpoint}/DisableUserById`,
      { userId }
    );
  }


  enableUser
  (
    userId: number
  ): Observable<any> {
    return this.http.post<any>(
      `${this.endpoint}/EnableUserById`,
      { userId }
    );
  }


  getUserWithRolePermissions(): Observable<any> {
    return this.http.get<any>(
      `${this.endpoint}/GetUserWithRolePermissions`
    );
  }


  getUserByIdWithRolePermissions
  (
    id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.endpoint}/GetUserByIdWithRolePermissions/${id}`
    );
  }

  revokeSession
  (
    refreshToken: string
  ): Observable<any> {
    return this.http.post<any>(
      `admin/UserSessions/RevokeSessionByRefreshToken`,
      { refreshToken }
    );
  }

  getUserSessionsByUserId
  (
    userId: number
  ): Observable<any> {
    return this.http.get<any>(
      `admin/UserSessions/GetUserSessionsByUserId/${userId}`
    );
  }
}
