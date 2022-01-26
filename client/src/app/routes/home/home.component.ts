import { ApiService, INotification } from './../../services/api.service';
import { environment } from './../../../environments/environment';
import { NotificationEvent } from './../../interfaces/notification-event';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { first } from 'rxjs';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  events: {critical: INotification[], warning: INotification[], info: INotification[]} | undefined = undefined;
  time!: string;
  isChildRoute = false;
  modalEvent: INotification | null = null;
  showModal = false;
  // TODO: Move to notifications service and change to behaviorSubject
  notificationsEnabled = false;
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

  constructor(
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private api: ApiService,
    private swPush: SwPush
  ) {}

  /** Helper function to track ngFor components by the notification ID */
  trackById(index: number, notification: INotification) {
    return notification._id;
  }

  async ngOnInit(): Promise<void> {
    const d = new Date();
    const hours = `0${d.getHours()}`.slice(-2);
    const minutes = `0${d.getMinutes()}`.slice(-2);
    this.time = `${hours}:${minutes}`

    // Show event modal if user navigated to a specific event
    this.route.url.pipe(first()).subscribe((segments: UrlSegment[]) => {
      if (segments.length === 2) {
        this.prepareModal({eventId: segments[1].toString()});
      }
    });

    // this.route.params.subscribe(x => console.log(x))

    // this.events = await this.api.getEvents();
    const cachedEvents = this.api.events;
    if (cachedEvents === null) {
      this.events = await this.api.getEvents();
    } else {
      this.events = cachedEvents;
    }

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.notificationsEnabled = true;
      } else {
        this.notificationsEnabled = false;
      }
    }

    // TODO: Replace with behaviorSubject in service
    this.swPush.messages.subscribe(async (message: any) => {
      this.events = await this.api.getEvents();
    })
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

}
