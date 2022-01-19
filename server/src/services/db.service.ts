import mongoose from 'mongoose';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const hostname = process.env.DB_HOSTNAME;
const dbname = process.env.DB_DBNAME;

export const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${hostname}/${dbname}`
    );
    console.log('📂 DB connection success!');
  } catch (error) {
    console.error(error);
  }
};
