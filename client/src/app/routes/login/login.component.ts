import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  credentials = {
    email: '',
    password: '',
  };

  constructor(
    public auth: AuthService,
  ) { }


  ngOnInit(): void {}

  async onLogin() {
    const { email, password } = this.credentials;
    const loginRes = await this.auth.signInWithCredentials(email, password);
  }

  async onRegister() {
    const { email, password } = this.credentials;
    await this.auth.registerWithCredentials(email, password);
  }

  async onLoginWithGoogle() {
    await this.auth.signInWithGoogle();
  }

}
