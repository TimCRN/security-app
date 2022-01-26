import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  enabled$ = new BehaviorSubject(false);

  constructor(
    private swPush: SwPush,
    private api: ApiService,
    private router: Router
    ) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.enabled$.next(true);
      } else {
        this.enabled$.next(false);
      }
    }

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

        // TODO: Only show modal when window is in focus
        // TODO: Replace by hooking into WebSocket feed in api.service
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
      .then((sub: PushSubscription) => {
        this.enabled$.next(true);
        this.registerNotificationSubscription(sub)
      })
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
