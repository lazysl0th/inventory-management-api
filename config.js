import 'dotenv/config';

const {
  NODE_ENV,
  HOST,
  PORT,
  FPORT,
  JWT_SECRET,
  DATABASE_URL,
  DBHOST,
  DBPORT,
  DBNAME,
  DBUSER,
  DBPASS,
  /*EMAIL_USER,
  EMAIL_NAME,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  BACKEND,
  FRONTEND*/
} = process.env;

const config = {
  PORT: NODE_ENV === 'production' && PORT ? PORT : 3001,
  FPORT: NODE_ENV === 'production' && FPORT ? FPORT : 5173,
  HOST: NODE_ENV === 'production' && HOST ? HOST : 'localhost',
  JWT_SECRET: NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'JWT_SECRET_DEV',
  DBHOST: NODE_ENV === 'production' && DATABASE_URL ? DATABASE_URL : 'prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ',
  DBHOST: NODE_ENV === 'production' && DBHOST ? DBHOST : 'localhost',
  DBPORT: NODE_ENV === 'production' && DBPORT ? DBPORT : 5432,
  DBNAME: NODE_ENV === 'production' && DBNAME ? DBNAME : 'inventorytdb',
  DBUSER: NODE_ENV === 'production' && DBUSER ? DBUSER : 'inventoryadminuser',
  DBPASS: NODE_ENV === 'production' && DBPASS ? DBPASS : 'secret',
  /*EMAIL_USER: NODE_ENV === 'production' && EMAIL_USER ? EMAIL_USER : '',
  EMAIL_NAME: NODE_ENV === 'production' && EMAIL_NAME ? EMAIL_NAME : 'User manager',
  BACKEND: NODE_ENV === 'production' && BACKEND ? BACKEND : 'http://localhost:3001',
  FRONTEND: NODE_ENV === 'production' && FRONTEND ? FRONTEND : 'http://localhost:5174',
  CLIENT_ID: NODE_ENV === 'production' && CLIENT_ID ? CLIENT_ID : '',
  CLIENT_SECRET: NODE_ENV === 'production' && CLIENT_SECRET ? CLIENT_SECRET : '',
  REFRESH_TOKEN: NODE_ENV === 'production' && REFRESH_TOKEN ? REFRESH_TOKEN : '',*/
};

export default config