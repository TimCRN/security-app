import { NotificationEvent } from './../../interfaces/notification-event';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import {INotification} from 'src/app/services/api.service';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.sass']
})
export class EventItemComponent implements OnInit {

  @Input() event!: INotification;

  constructor(
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void { }

  onEnableNotifications() {
    console.log('Enabling notifications...')
    this.notifications.subscribeToNotifications();
  }

}
