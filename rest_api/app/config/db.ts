const config = {
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