import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {GithubAuthProvider, GoogleAuthProvider} from 'firebase/auth';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isSignedIn = new BehaviorSubject(false);

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    afAuth.authState.subscribe((user: unknown) => {
      if (!!user) {
        this.isSignedIn.next(true);
      } else {
        this.isSignedIn.next(false);
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
      this.router.navigate(['/']);
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
      this.router.navigate(['/']);
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

  /** Launch Google OAuth login flow */
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await this.signInWithProvider(provider);
    this.router.navigate(['/']);
  }

  /** Launch GitHub OAuth login flow */
  async signInWithGitHub() {
    const provider = new GithubAuthProvider();
    await this.signInWithProvider(provider);
    this.router.navigate(['/']);
  }

  /**
   * Launch auth flow for specified provider, either Google or GitHub
   * @param provider
   */
  private async signInWithProvider(provider: GoogleAuthProvider | GithubAuthProvider) {
    try {
      const loginRes = this.afAuth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  }
}
