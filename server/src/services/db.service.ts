import {Sequelize} from 'sequelize';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

const DB_PASSWORD = process.env.DB_PASSWORD;
const sequelize = new Sequelize(
  // eslint-disable-next-line prettier/prettier
  `postgresql://test:${DB_PASSWORD!}@free-tier5.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert=./certs/root.crt&options=--cluster%3Dwhite-zebra-2524`
);

export const checkDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQL connection established');
  } catch (error) {
    console.error(error);
  }
};
