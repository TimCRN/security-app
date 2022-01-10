import { AuthService } from './../../services/auth.service';
import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-signin',
  templateUrl: './quick-signin.component.html',
  styleUrls: ['./quick-signin.component.sass']
})
export class QuickSigninComponent implements OnInit {

  @Input() type!: 'google' | 'github';

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

}
