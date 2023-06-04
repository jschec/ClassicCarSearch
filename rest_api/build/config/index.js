"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const envVarsSchema = joi_1.default.object()
    .keys({
    APP_ENV: joi_1.default.string().valid('production', 'development', 'test', 'marketResearch', 'marketResearch2').required(),
    APP_PORT: joi_1.default.number().default(3000),
    MONGODB_USER: joi_1.default.string().required().description('Mongo DB username'),
    MONGODB_PASSWORD: joi_1.default.string().required().description('Mongo DB password'),
    MONGODB_HOST: joi_1.default.string().required().description('Mongo DB host'),
    OAUTH_CLIENT_ID: joi_1.default.string().required().description('OAuth client ID'),
    OAUTH_CLIENT_SECRET: joi_1.default.string().required().description('OAuth client secret'),
    OAUTH_CALLBACK_URL: joi_1.default.string().default('Oath callback URL'),
    OAUTH_SCOPE: joi_1.default.array().default(['profile', 'email']),
    SESSION_SECRET: joi_1.default.string().required().description('Session secret key'),
    TTL: joi_1.default.number().default(60 * 60 * 1000),
    LOGIN_URL: joi_1.default.string().required().description('Login URL'),
    LANDING_URL: joi_1.default.string().required().description('Landing URL'),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Configuration validation error: ${error.message}`);
}
const config = {
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
exports.default = config;
