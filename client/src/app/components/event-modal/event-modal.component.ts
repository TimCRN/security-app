import { INotification } from 'src/app/services/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.sass']
})
export class EventModalComponent implements OnInit {

  @Input() event!: INotification | null;

  cameFromPush = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    route.queryParamMap.subscribe(params => {
      if (params.has('src') && params.get('src') === 'push') {
        this.cameFromPush = true;
      }
    })
  }

  ngOnInit(): void {
    console.log(this.event);
  }

  onCloseModal() {
    if (this.cameFromPush) {
      this.router.navigate(['/']);
    } else {
      window.history.back();
    }
  }

}
