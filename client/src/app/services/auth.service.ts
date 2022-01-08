import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {GoogleAuthProvider} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    afAuth.authState.subscribe((user: unknown) => {
      if (!!user) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  /**
   * Sign in user with credentials
   * @param email user email
   * @param password user password
   */
  async signInWithCredentials(email: string, password: string) {
    try {
      const loginRes = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log(loginRes);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Register user with credentials
   * @param email user email
   * @param password user password
   */
  async registerWithCredentials(email: string, password: string) {
    try {
      const registerRes = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log(registerRes);
    } catch (error) {
      console.error(error);
    }
  }

  /** Send verification email to the currently logged in user */
  async verifyEmail() {
    const user = await this.afAuth.currentUser;
    user?.sendEmailVerification()
      .then(() => console.log('Email sent'))
      .catch(() => console.error('Something went wrong while sending the verification email'));
  }

  /**
   * Sign out user
   * - Redirects to /login
   */
  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const loginRes = this.afAuth.signInWithPopup(provider);
      console.log(loginRes);
    } catch (error) {
      console.error(error);
    }
  }
}
