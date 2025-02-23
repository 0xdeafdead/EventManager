import { configDotenv } from 'dotenv';
import * as joi from 'joi';

configDotenv({ path: './.env' });

interface EnvVars {
  APP_ENV: string;
  PORT: number;
  MONGO_ATLAS_URI: string;
  JWT_SECRET: string;
  BASE_API_AUDIENCE: string;
  BASE_API_ISSUER: string;
}

const envsSchema = joi
  .object({
    APP_ENV: joi.string().required(),
    PORT: joi.number().required(),
    MONGO_ATLAS_URI: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    BASE_API_AUDIENCE: joi.string().required(),
    BASE_API_ISSUER: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value as EnvVars;

export const envs = {
  app_env: envVars.APP_ENV,
  port: envVars.PORT,
  mongoAtlasUri: envVars.MONGO_ATLAS_URI,
  jwtSecret: envVars.JWT_SECRET,
  audience: envVars.BASE_API_AUDIENCE,
  issuer: envVars.BASE_API_ISSUER,
};
