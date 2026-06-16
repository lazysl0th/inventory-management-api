import "dotenv/config";

const { NODE_ENV, SALT_ROUNDS, JWT_SECRET } = process.env;

const isProd = NODE_ENV === "production";

export const CRYPTO = {
  EXPIRES: {
    TOKENS: "15m",
    REMEMBER: "7d",
    DEFAULT: "2h",
  } as const,
  SALT_ROUNDS: isProd && !Number.isNaN(SALT_ROUNDS) ? Number(SALT_ROUNDS) : 10,
  JWT_SECRET: isProd && JWT_SECRET ? JWT_SECRET : "JWT_SECRET_DEV",
};
