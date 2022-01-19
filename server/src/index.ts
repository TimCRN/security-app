import {createNotification} from './services/notification.service';
import {connectDB} from './services/db.service';
import express, {Request, Response} from 'express';
import {devicesRouter} from './routes/devices.route';
import cors from 'cors';
import {notificationsRouter} from './routes/notifications.route';
import {usersRouter} from './routes/users.route';
import {INotification} from './models/notifications.model';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());

(async () => {
  await connectDB();
})();

const events: INotification[] = [
  {
    userId: '9d0iLS8iuiUYsEPY3FIDPH8czKh2',
    type: 'critical',
    title: 'Fire detected',
    devices: [],
    sentNotification: false,
    resolved: false,
  },
  {
    userId: '9d0iLS8iuiUYsEPY3FIDPH8czKh2',
    type: 'info',
    title: 'Replace your battery soon',
    devices: [],
    sentNotification: false,
    resolved: false,
  },
  {
    userId: '9d0iLS8iuiUYsEPY3FIDPH8czKh2',
    type: 'critical',
    title: 'Flood detected',
    devices: [],
    sentNotification: false,
    resolved: false,
  },
  {
    userId: '9d0iLS8iuiUYsEPY3FIDPH8czKh2',
    type: 'warning',
    title: 'Battery level low',
    devices: [],
    sentNotification: false,
    resolved: false,
  },
  {
    userId: '9d0iLS8iuiUYsEPY3FIDPH8czKh2',
    type: 'warning',
    title: 'Battery level low',
    devices: [],
    sentNotification: false,
    resolved: false,
  },
  {
    userId: '9d0iLS8iuiUYsEPY3FIDPH8czKh2',
    type: 'critical',
    title: 'Fire detected',
    devices: [],
    sentNotification: false,
    resolved: false,
  },
];

app.get('/', async (req: Request, res: Response) => {
  for (const event of events) {
    createNotification(event);
  }

  res.send('OK');
});

app.use('/devices', devicesRouter);
app.use('/notifications', notificationsRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
