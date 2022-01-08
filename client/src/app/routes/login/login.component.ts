import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  onLogin() {
    // this.auth.verifyEmail();
    this.auth.signOut();
  }

  async onRegister(email: string, password: string) {
    const registerRes = await this.auth.registerWithCredentials(email, password);
    console.log(registerRes)
  }
}
