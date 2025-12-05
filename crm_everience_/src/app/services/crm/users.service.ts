import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  id_user_role: number;
  username: string;
  first_name: string;
  last_name: string;
  uid: string;
  user_status: number;
}

export interface UserRole {
  id: number;
  user_role_name: string;
}

export interface ServiceManager {
  id: number;
  id_user_role: number;
  first_name: string;
  last_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users/';

  constructor(private http: HttpClient) {}

  // Get all Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + 'getUsers');
  }

  //Get inactive
  getDisabledUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + 'getDisabledUsers');
  }
  //Get active
  getEnabledUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + 'getEnabledUsers');
  }

  //get singolo user
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + `getUser/${id}`);
  }

  getServiceManagers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + `getServiceManagers`);
  }

  getServiceManagerById(id: number): Observable<ServiceManager> {
    return this.http.get<ServiceManager>(
      `${this.apiUrl}getServiceManager/${id}`
    );
  }

  getUserRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.apiUrl + 'getUserRoles');
  }

  activateUser(id: number, role: string): Observable<any> {
    return this.http.put(this.apiUrl + 'activateUser/' + id, { role });
  }

  deactivateUser(id: number): Observable<any> {
    return this.http.put(this.apiUrl + 'deactivateUser/' + id, {});
  }
}
