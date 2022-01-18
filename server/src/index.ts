import {connectDB} from './services/db.service';
import {connectTuya} from './services/tuya.service';
import express, {Request, Response} from 'express';
import {devicesRouter} from './routes/devices.route';
import cors from 'cors';

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());

(async () => {
  await connectDB();
})();

(async () => {
  await connectTuya();
})();

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

app.get('/', async (req: Request, res: Response) => {
  res.send('OK');
});

app.use('/devices', devicesRouter);

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
