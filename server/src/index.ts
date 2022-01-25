import {connectDB} from './services/db.service';
import {connectTuya, beginTuyaPoll} from './services/tuya.service';
import express, {Request, Response} from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {devicesRouter} from './routes/devices.route';
import cors from 'cors';
import {notificationsRouter} from './routes/notifications.route';
import {usersRouter} from './routes/users.route';

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

io.on('connection', socket => {
  console.log('Connection established');
  socket.on('disconnect', () => console.log('Disconnected'));
});

http.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
