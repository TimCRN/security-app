import mongoose from 'mongoose';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
const DB_HOSTNAME = process.env.DB_HOSTNAME;

export const checkDBConnection = async () => {
  try {
    mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOSTNAME}`);
    console.log('DB connection success!');
  } catch(error) {
    console.error(error);
  }
};
