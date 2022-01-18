import {createNotification} from './services/notification.service';
import {connectDB} from './services/db.service';
import express, {Request, Response} from 'express';
import {devicesRouter} from './routes/devices.route';
import cors from 'cors';
import {notificationsRouter} from './routes/notifications.route';

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

app.get('/', async (req: Request, res: Response) => {
  createNotification({
    userId: 'fooBaz',
    type: 'critical',
    actions: {
      sentNotification: false,
    },
    resolved: false,
  });
  res.send('OK');
});

app.use('/devices', devicesRouter);
app.use('/notifications', notificationsRouter);

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
