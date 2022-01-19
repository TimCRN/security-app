import { INotification } from 'src/app/services/api.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.sass']
})
export class EventModalComponent implements OnInit {

  @Input() event!: INotification | null;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  onCloseModal() {
    // TODO: implement routing to home if source is push notification
    window.history.back();
  }

}
