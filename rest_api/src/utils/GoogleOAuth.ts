import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import config from '../config';
import User from '../models/user.model';
import { NewUserBody } from '../interfaces/user.interfaces';

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

    let refUser: NewUserBody = {
      ssoID: profile.id,
      firstName: profile.name!.givenName,
      lastName: profile.name!.familyName,
      email: profile.emails?.[0].value!,
      pictureUri: profile.photos?.[0].value!,
    };

    User.findOrCreate(refUser).then((user) => {
      return done(null, user);
    });
  }
));