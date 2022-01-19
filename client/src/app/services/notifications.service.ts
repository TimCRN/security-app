import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private swPush: SwPush,
    private api: ApiService
    ) {
    if (swPush.isEnabled) {
      swPush.notificationClicks.subscribe(
        (raw: {
          action: string;
          notification: NotificationOptions & { title: string };
        }) => console.log(raw)
      );
      swPush.messages.subscribe((event: any) => {
        console.log(event);
        this.api.getEvents();
      });
    }
  }

  /**
   * Request notification permissions from user and create PushSubscription
   * - User notification prompt is launched
   * - On permission, the PushSubscription is sent to backend via `registerNotificationSubscription()`
   */
  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: environment.vapidPublicKey,
      })
      .then((sub: PushSubscription) =>
        this.registerNotificationSubscription(sub)
      )
      .catch((error: Error) =>
        console.error('Failed to subscribe to notifications', error)
      );
  }

  private registerNotificationSubscription(sub: PushSubscription) {
    this.api.registerPushSubscription(sub);
  }
}
