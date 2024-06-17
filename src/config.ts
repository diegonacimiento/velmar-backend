import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtSecretRecovery: process.env.JWT_SECRET_RECOVERY,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    ggEmail: process.env.GG_EMAIL,
    ggKey: process.env.GG_KEY,
    tokenName: process.env.TOKEN_NAME,
    frontendUrl: process.env.FRONTEND_URL,
  };
});
