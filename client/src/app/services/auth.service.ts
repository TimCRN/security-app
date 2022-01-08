import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth
  ) {
    afAuth.authState.subscribe((user: unknown) => console.log(user))
  }

  async signInWithCredentials(email: string, password: string) {
    // const loginRes = await this.afAuth.auth.
  }

  async registerWithCredentials(email: string, password: string) {
    try {
      const registerRes = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log(registerRes);
    } catch (error) {
      console.log(error);
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
  }
}
