export interface NotificationEvent {
  type: 'info' | 'warning' | 'alert';
  description: string;
  devices: 'all' | string;
  timestamp?: string;
}
