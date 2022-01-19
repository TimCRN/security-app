import { ApiService, INotification } from './../../services/api.service';
import { environment } from './../../../environments/environment';
import { NotificationEvent } from './../../interfaces/notification-event';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  events: {critical: INotification[], warning: INotification[], info: INotification[]} | undefined;
  time!: string;
  isChildRoute = false;
  modalEvent: INotification | null = null;
  showModal = false;

  constructor(
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  async ngOnInit(): Promise<void> {
    const d = new Date();
    const hours = `0${d.getHours()}`.slice(-2);
    const minutes = `0${d.getMinutes()}`.slice(-2);
    this.time = `${hours}:${minutes}`

    // this.route.url.pipe(first()).subscribe((segments: UrlSegment[]) => {
    //   console.log(segments);
    // });

    // this.route.params.subscribe(x => console.log(x))

    // this.events = await this.api.getEvents();
    const events = await this.api.getEvents();
    this.events = events;
  }

  onSubscribeToNotifications() {
    this.notifications.subscribeToNotifications();
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

  hideModal() {
    this.showModal = false;
  }

}
