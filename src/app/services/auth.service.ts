import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Users } from '../interfaces/users';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afa: AngularFireAuth) { }

  login(user: Users) {
    return this.afa.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  loginGoogle() {
    return this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginFacebook() {
    return this.afa.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  register(user: Users) {
    return this.afa.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.afa.auth.signOut();
  }

  getAuth() {
    return this.afa.auth;
  }

  getUserId() {
    return this.afa.auth.currentUser.uid;
  }

  getUserEmail() {
    return this.afa.auth.currentUser.email;
  }
}
