import * as Joi from '@hapi/joi';

export const envConfiguration = Joi.object({
  // Node
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  SERVER_PORT: Joi.number().default(5000),

  // Database
  DATABASE_URL: Joi.string().required(),
  ENABLE_DB_LOGS: Joi.number().valid(0, 1).default(1),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string(),
  REDIS_TTL: Joi.number().default(300000),

  // Swagger
  SWAGGER_URL_PATH: Joi.string().default('docs'),

  // JWT
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),

  // B2 Storage
  B2_BUCKET_ID: Joi.string().required(),
  B2_APPLICATION_KEY_ID: Joi.string().required(),
  B2_APPLICATION_KEY: Joi.string().required(),
  B2_DOMAIN: Joi.string().required(),

  // Pino Logger
  PINO_LOG_LEVEL: Joi.string().valid('trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent').default('debug'),
  PINO_HIDE_OBJECTS: Joi.number().valid(0, 1).default(1),
  PINO_MESSAGE_KEY: Joi.string().default('msg'),
  PINO_IGNORE: Joi.string(),

  // GOOGLE AUTH
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
});
