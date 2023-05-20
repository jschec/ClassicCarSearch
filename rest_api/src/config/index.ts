import Joi from 'joi';

const envVarsSchema = Joi.object()
  .keys({
    APP_ENV: Joi.string().valid('production', 'development', 'test').required(),
    APP_PORT: Joi.number().default(3000),
    MONGODB_USER: Joi.string().required().description('Mongo DB username'),
    MONGODB_PASSWORD: Joi.string().required().description('Mongo DB password'),
    MONGODB_HOST: Joi.string().required().description('Mongo DB host'),
    OAUTH_CLIENT_ID: Joi.string().required().description('OAuth client ID'),
    OAUTH_CLIENT_SECRET: Joi.string().required().description('OAuth client secret'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Configuration validation error: ${error.message}`);
}

interface MongoConfig {
  url: string;
}

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
}

interface AppConfig {
  env: string;
  port: number;
  mongo: MongoConfig;
  oauth: OAuthConfig;
}

const config: AppConfig = {
  env: envVars.APP_ENV,
  port: envVars.APP_PORT,
  mongo: {
    url: `mongodb+srv://${envVars.MONGODB_USER}:${envVars.MONGODB_PASSWORD}@${envVars.MONGODB_HOST}/${envVars.APP_ENV}`,
  },
  oauth: {
    clientId: envVars.OAUTH_CLIENT_ID,
    clientSecret: envVars.OAUTH_CLIENT_SECRET,
  }
};

export default config;