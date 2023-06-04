// Import env variables
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.join(__dirname, '..', '.env')});

import mongoose from 'mongoose';

import app from './app';
import config from './config';

let server: any;

mongoose.connect(config.mongo.url).then(() => {
  console.log('Connected to MongoDB');
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`); // TODO - replace with logger
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed'); // TODO - replace with logger
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  console.log(error); // TODO - replace with logger
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received'); // TODO - replace with logger
  if (server) {
    server.close();
  }
});