import express, { Express } from 'express';
import session from 'express-session';
import  morgan from 'morgan';
import mongoStore from "connect-mongo";
import cors from 'cors';
import httpStatus from 'http-status';
import passport from 'passport';

import config from './config';
import routes from './routes';
import ApiError from './utils/ApiError';
import { errorConverter, errorHandler } from './utils/errors';
import './utils/GoogleOAuth';

const app: Express = express();

// Enable cors
app.use(cors());
app.options('*', cors());

// Add logging middleware
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

// Enable user sessions
app.use(
  session({
    ...config.session, 
    store: mongoStore.create({ ...config.sessionStore })
  })
);

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Map application API routes
app.use('/api', routes);
app.use('/', express.static(`${__dirname}/static`));

// Send back a 404 error for any unknown API request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

export default app;