import { Router } from '@angular/router';
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
    private api: ApiService,
    private router: Router
    ) {
    if (swPush.isEnabled) {
      swPush.notificationClicks.subscribe(
        (raw: {
          action: string;
          notification: NotificationOptions & { title: string };
        }) => console.log(raw)
      );
      swPush.messages.subscribe((event: any) => {
        const castEvent = event as PushNotification;
        const eventTargetURL = castEvent.notification.data.onActionClick.default.url;
        const [targetURL,] = eventTargetURL.split('?');
        this.api.getEvents();

        // TODO: Only show modal when window is in focus
        // Disabled for testing, as DevTools takes away focus from the document
        // if (document.hasFocus()) {
          this.router.navigateByUrl(targetURL);
        // }

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

interface PushNotification {
  notification: {
    body: string;
    title: string;
    icon: string;
    data: {
      onActionClick: {
        default: {
          operation: string;
          url: string;
        }
      }
    }
  }
}
