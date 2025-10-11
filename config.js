import 'dotenv/config';

const {
  NODE_ENV,
  HOST,
  PORT,
  FPORT,
  JWT_SECRET,
  SALT_ROUNDS,
  /*EMAIL_USER,
  EMAIL_NAME,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  BACKEND,
  FRONTEND*/
} = process.env;

const config = {
  HOST: NODE_ENV === 'production' && HOST ? HOST : 'localhost',
  PORT: NODE_ENV === 'production' && PORT ? PORT : 3001,
  FPORT: NODE_ENV === 'production' && FPORT ? FPORT : 5173,
  JWT_SECRET: NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'JWT_SECRET_DEV',
  SALT_ROUNDS: NODE_ENV === 'production' && SALT_ROUNDS ? SALT_ROUNDS : 10,
  /*EMAIL_USER: NODE_ENV === 'production' && EMAIL_USER ? EMAIL_USER : '',
  EMAIL_NAME: NODE_ENV === 'production' && EMAIL_NAME ? EMAIL_NAME : 'User manager',
  BACKEND: NODE_ENV === 'production' && BACKEND ? BACKEND : 'http://localhost:3001',
  FRONTEND: NODE_ENV === 'production' && FRONTEND ? FRONTEND : 'http://localhost:5174',
  CLIENT_ID: NODE_ENV === 'production' && CLIENT_ID ? CLIENT_ID : '',
  CLIENT_SECRET: NODE_ENV === 'production' && CLIENT_SECRET ? CLIENT_SECRET : '',
  REFRESH_TOKEN: NODE_ENV === 'production' && REFRESH_TOKEN ? REFRESH_TOKEN : '',*/
};

export default config