import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import config from '../config';
import User from '../models/user.model';
import { IUser } from '../interfaces/user.interfaces';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user as any);
});

passport.use(new GoogleStrategy({
    clientID: config.oauth.clientId,
    clientSecret: config.oauth.clientSecret,
    callbackURL: config.oauth.callbackUrl,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {

    User.findOne({ ssoID: profile.id }).then((user) => {
      
      // If user is not found, create a new user
      if (!user) {
        User.create({
          ssoID: profile.id,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          email: profile.emails?.[0].value,
          pictureUri: profile.photos?.[0].value,
          age: -1
        });
      }
    
    });

    done(null, profile);
  }
));