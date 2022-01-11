import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.sass']
})
export class EventItemComponent implements OnInit {

  type!: string;

  constructor() { }

  ngOnInit(): void {
    const types = ['info', 'warning', 'alert'];
    const idx = Math.floor(Math.random() * 3);
    this.type = types[idx];
  }

}
