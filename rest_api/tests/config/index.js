const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    HOST_NAME: Joi.string().default("localhost"),
    HOST_PORT: Joi.number().default(8000)
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Configuration validation error: ${error.message}`);
}

const config = {
  hostName: envVars.HOST_NAME,
  hostPort: envVars.HOST_PORT
};

module.exports = config;