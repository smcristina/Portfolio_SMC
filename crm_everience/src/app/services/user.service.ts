import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
} from '@angular/fire/auth';

export interface User {
  id: number;
  role: string;
  username: string;
  first_name: string;
  last_name: string;
  uid: string;
  user_status: boolean;
  user_role_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/';
  constructor(private auth: Auth, private http: HttpClient) {}

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  registerInDb(user: any) {
    return firstValueFrom(
      this.http.post(this.apiUrl + 'users/add-user-to-db', user)
    );
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  passwordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + 'users/getUsers');
  }

  getCurrentUser(uid: string) {
    return this.getUsers().pipe(
      map((users) => users.find((u) => u.uid === uid))
    );
  }
}
