import Joi from 'joi';

const envVarsSchema = Joi.object()
  .keys({
    APP_ENV: Joi.string().valid('production', 'development', 'test').required(),
    APP_PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
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
    url: envVars.MONGODB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};

export default config;