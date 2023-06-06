import Joi from 'joi';

const envVarsSchema = Joi.object()
  .keys({
    APP_ENV: Joi.string().valid('production', 'development', 'test', 'marketResearch', 'marketResearch2').required(),
    APP_PORT: Joi.number().default(3000),
    MONGODB_USER: Joi.string().required().description('Mongo DB username'),
    MONGODB_PASSWORD: Joi.string().required().description('Mongo DB password'),
    MONGODB_HOST: Joi.string().required().description('Mongo DB host'),
    OAUTH_CLIENT_ID: Joi.string().required().description('OAuth client ID'),
    OAUTH_CLIENT_SECRET: Joi.string().required().description('OAuth client secret'),
    OAUTH_CALLBACK_URL: Joi.string().default('Oath callback URL'),
    OAUTH_SCOPE: Joi.array<string>().default(['profile', 'email']),
    SESSION_SECRET: Joi.string().required().description('Session secret key'),
    TTL: Joi.number().default(60 * 60 * 1000),
    LOGIN_URL: Joi.string().required().description('Login URL'),
    LANDING_URL: Joi.string().required().description('Landing URL'),
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
  callbackUrl: string;
  scope: string[];
}

interface CookieConfig {
  maxAge: number;
}

interface SessionConfig {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: CookieConfig;
}

interface RoutesConfig {
  loginUrl: string;
  landingUrl: string;
}

interface SessionStoreConfig {
  mongoUrl: string;
  ttl: number;
}

interface AppConfig {
  env: string;
  port: number;
  mongo: MongoConfig;
  oauth: OAuthConfig;
  session: SessionConfig;
  sessionStore: SessionStoreConfig;
  routes: RoutesConfig;
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
    callbackUrl: envVars.OAUTH_CALLBACK_URL,
    scope: envVars.OAUTH_SCOPE,
  },
  session: {
    secret: envVars.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: envVars.TTL,
    },
  },
  sessionStore: {
    mongoUrl: `mongodb+srv://${envVars.MONGODB_USER}:${envVars.MONGODB_PASSWORD}@${envVars.MONGODB_HOST}/${envVars.APP_ENV}-sessions`,
    ttl: envVars.TTL,
  },
  routes: {
    loginUrl: envVars.LOGIN_URL,
    landingUrl: envVars.LANDING_URL,
  }
};

export default config;