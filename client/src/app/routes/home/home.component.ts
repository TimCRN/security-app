import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'app/services/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {}

  onSubscribeToNotifications() {
    this.notifications.subscribeToNotifications();
  }

}
