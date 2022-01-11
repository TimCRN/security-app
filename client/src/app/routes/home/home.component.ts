import { NotificationEvent } from './../../interfaces/notification-event';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  events: NotificationEvent[] = [
    {
      type: 'alert',
      description: 'Your house is on fire',
      devices: 'All devices',
      timestamp: '16:25'
    },
    {
      type: 'alert',
      description: 'Your house is on fire',
      devices: 'All devices',
      timestamp: '16:20'
    },
    {
      type: 'warning',
      description: 'Battery level low',
      devices: 'Hallway smoke detector',
      timestamp: '12:10'
    },
    {
      type: 'warning',
      description: 'Battery level low',
      devices: 'Kitchen smoke detector',
      timestamp: 'Yesterday, 22:40'
    },
    {
      type: 'info',
      description: 'Enable notificions',
      devices: 'All devices',
    },
  ]

  constructor(
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {}

  onSubscribeToNotifications() {
    this.notifications.subscribeToNotifications();
  }

}
