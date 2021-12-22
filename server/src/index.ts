import express, {Request, Response} from 'express';

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

app.get('/', async (req: Request, res: Response) => {
  res.send('OK');
});

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
