import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private swPush: SwPush) {
    if (swPush.isEnabled) {
      swPush.notificationClicks.subscribe(
        (raw: {
          action: string;
          notification: NotificationOptions & { title: string };
        }) => console.log(raw)
      );
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

  // TODO: Send PushSubcription to backend and store in DB with user ID
  private registerNotificationSubscription(sub: PushSubscription) {}
}
