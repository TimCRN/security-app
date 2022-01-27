import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  rootUrl = 'http://localhost:8080';
  events: {
    critical: INotification[];
    warning: INotification[];
    info: INotification[];
  } | null = null;

  events$ = this.socket.fromEvent<{
    critical: INotification[];
    warning: INotification[];
    info: INotification[];
    total: number;
  }>('events');

  private uid: string | null = null;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private socket: Socket
  ) {
    afAuth.authState.subscribe(async user => {
      if (!!user) {
        this.uid = user.uid;
        const socketId = await this.connectSocketAndWaitForId();
        this.socket.emit('setSocketId', {userId: user.uid, socketId});
      } else {
        socket.disconnect();
      }
    })
  }

  // ! Deprecated
  // Superseded by WebSocket feed
  async getEvents() {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;
    // TODO: Error handling
    const endpoint = `${this.rootUrl}/notifications/all/${userId}`;
    const res = await firstValueFrom(
      this.http.get<{
        success: boolean;
        notifications?: {
          critical: INotification[];
          warning: INotification[];
          info: INotification[];
        };
      }>(endpoint)
    );
    if (res.success) {
      this.events = res.notifications!;
      return res.notifications;
    }
    throw Error('Unable to retrieve events');
  }

  async getEvent(eventId: string) {
    const endpoint = `${this.rootUrl}/notifications/${eventId}`;
    const res = await firstValueFrom(
      this.http.get<{ success: boolean; notification: INotification }>(endpoint)
    );
    if (res.success) return res.notification;
    throw Error('Unable to retrieve event');
  }

  async registerPushSubscription(sub: PushSubscription) {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;
    const endpoint = `${this.rootUrl}/users/${userId}/registerPush`;
    const res = await firstValueFrom(
      this.http.post(endpoint, {name: null, sub})
    )
  }

  async resolveEvent(eventId: string) {
    const endpoint = `${this.rootUrl}/notifications/resolve/${eventId}`;
    const res = await firstValueFrom(
      this.http.patch(endpoint, {})
    )
  }

  async requestEvents() {
    if (this.uid === null) throw Error('No user ID');
    this.socket.emit('requestEvents', {userId: this.uid});
  }

  /**
   * Create a new WebSocket connection and wait until the connection ID is defined
   *
   * ! This function sucks
   * ! socket.connect is not async, meaning the connection variable can be read before it is defined
   * ! (Possibly) infinite loop to check for ID definition should be fixed!
   *
   * @returns the connection ID
   */
  private async connectSocketAndWaitForId(): Promise<string> {
    const connection = this.socket.connect();

    while (connection.id === undefined) {
      await this.sleep(100);
    }

    return connection.id;
  }

  /**
   * Timeout for specific amount of time
   * @param duration duration of timeout in ms
   * @returns a promise that resolves at the end of the set duration
   */
  private sleep(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }
}

export interface INotification {
  _id: string;
  userId: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description?: string;
  devices?: string[];
  sentNotification: boolean;
  circleOfTrust?: [ICircleOfTrustNotificationItem[]];
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ICircleOfTrustNotificationItem extends ICircleOfTrustItem {
  contacted: boolean;
}

interface ICircleOfTrustItem {
  name: string;
  number: string;
}
