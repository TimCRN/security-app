import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    afAuth.authState.subscribe((user: unknown) => {
      console.log(user);
      if (!!user) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  async signInWithCredentials(email: string, password: string) {
    try {
      const loginRes = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log(loginRes);
    } catch (error) {
      console.error(error);
    }
  }

  async registerWithCredentials(email: string, password: string) {
    try {
      const registerRes = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log(registerRes);
    } catch (error) {
      console.error(error);
    }
  }

  async verifyEmail() {
    const user = await this.afAuth.currentUser;
    user?.sendEmailVerification()
      .then(() => console.log('Email sent'))
      .catch(() => console.error('Something went wrong while sending the verification email'));
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}
