import { ApiService, INotification } from './../../services/api.service';
import { environment } from './../../../environments/environment';
import { NotificationEvent } from './../../interfaces/notification-event';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { first, Observable } from 'rxjs';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  isChildRoute = false;
  modalEvent: INotification | null = null;
  showModal = false;
  enableNotificationsEvent: INotification = {
    userId: '',
    _id: '',
    title: 'Enable notifications',
    type: 'info',
    devices: ['All devices'],
    sentNotification: false,
    resolved: false,
    createdAt: Date.now().toString(),
    updatedAt: ''
  }

  events$ = this.api.events$;
  notificationsEnabled$ = this.notifications.enabled$;

  constructor(
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private api: ApiService,
    private swPush: SwPush
  ) {}

  async ngOnInit(): Promise<void> {
    // Show event modal if user navigated to a specific event
    this.route.url.pipe(first()).subscribe((segments: UrlSegment[]) => {
      if (segments.length === 2) {
        this.prepareModal({eventId: segments[1].toString()});
      }
    });
    this.api.requestEvents();
  }

  async prepareModal(args: {event?: INotification, eventId?: string}) {
    if (args.event) {
      this.modalEvent = args.event;
    } else {
      if (!args.eventId) throw Error('Pass either an event or an event ID');
      const eventRes = await this.api.getEvent(args.eventId);
      this.modalEvent = eventRes;
    }
    this.showModal = true;
  }

  /** Helper function to track ngFor components by the notification ID */
  trackById(index: number, notification: INotification) {
    return notification._id;
  }

}
