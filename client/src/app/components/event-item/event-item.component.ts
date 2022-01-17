import { NotificationEvent } from './../../interfaces/notification-event';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.sass']
})
export class EventItemComponent implements OnInit {

  @Input() event!: NotificationEvent;

  constructor() { }

  ngOnInit(): void { }

}
