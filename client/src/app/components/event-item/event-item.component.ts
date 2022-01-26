import { ApiService } from './../../services/api.service';
import { NotificationEvent } from './../../interfaces/notification-event';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { INotification } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { format } from 'timeago.js';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.sass']
})
export class EventItemComponent implements OnInit {

  @Input() event!: INotification;
  @Input() pauseAnimation: boolean = false;
  @Input() isNotificationPermissionEvent = false;

  constructor(
    private notifications: NotificationsService,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit(): void { }

  onRequestPermission() {
    this.notifications.subscribeToNotifications();
  }

  onShowEventModal() {
    this.router.navigate(['event', this.event._id]);
  }

  formatDate(timestamp: string) {
    return format(timestamp, 'en_US');
  }

  async onResolve() {
    this.api.resolveEvent(this.event._id);
  }

}
