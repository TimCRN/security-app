import { Sockets } from './models/sockets.model';
import {connectDB} from './services/db.service';
import {connectTuya, beginTuyaPoll} from './services/tuya.service';
import express, {Request, Response} from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {devicesRouter} from './routes/devices.route';
import cors from 'cors';
import {notificationsRouter} from './routes/notifications.route';
import {usersRouter} from './routes/users.route';
import {INotification, Notifications} from './models/notifications.model';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 8080;
const app = express();
const http = createServer(app);
const io = new Server(http, {cors: {origin: '*'}});

app.use(express.json());
app.use(cors());

connectTuya();

(async () => {
  await connectDB();
  await beginTuyaPoll();
})();

app.get('/', async (req: Request, res: Response) => {
  res.send('OK');
});

app.use('/devices', devicesRouter);
app.use('/notifications', notificationsRouter);
app.use('/users', usersRouter);

console.log(`🕑 Tuya poll rate has been set to ${process.env.TUYA_POLL_RATE}`);

// Notifications.watch().on('insert', data => console.log(data));
Notifications.watch().on('change', async data => {
  if (data.operationType === 'insert') {
    const notificationDocument = data.fullDocument as INotification;
    const userId = notificationDocument.userId;
    const sockets = await Sockets.find({userId}).exec();
    if (sockets.length === 0) return;

    const notifications = await Notifications.find({
      resolved: false,
      userId,
    }).exec();
    // TODO: Emit full notification list to socket(s)
  }
});

// Establish WebSocket listener
io.on('connection', socket => {
  console.log(`Connected socket ${socket.id}`);

  // Store socket ID with specific user ID
  socket.on('setSocketId', async (data: {userId: string; socketId: string}) => {
    try {
      await Sockets.create(data);
    } catch (error) {
      console.error((error as Error).message);
    }
  });

  socket.on('disconnect', async () => {
    await Sockets.deleteOne({socketId: 'bar'});
    console.log(`Disconnected socket ${socket.id}`);
  });
});

http.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
