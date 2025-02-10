/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as Joi from 'joi';
import { Environment } from 'src/common/types/environment.types';

// Define the expected structure of environment variables
interface EnvConfig {
  NODE_ENV: Environment;
  PORT: number;
  GLOBAL_PREFIX: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
  BCRYPT_SALT_ROUNDS: number;
}

// Joi validation schema with TypeScript safety
export const validationSchema: Joi.ObjectSchema<EnvConfig> =
  Joi.object<EnvConfig>({
    // Server
    NODE_ENV: Joi.string()
      .valid(...Object.values(Environment))
      .required(),
    PORT: Joi.number().default(3000),

    // Application
    GLOBAL_PREFIX: Joi.string().default('api'),
    DATABASE_URL: Joi.string().required(),

    // Authentication
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.number().integer().default(86400),
    BCRYPT_SALT_ROUNDS: Joi.number().integer().required(),
  });
