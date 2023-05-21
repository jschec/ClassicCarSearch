import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import config from '../config';

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
    console.log("profile", profile);

    done(null, profile);
    
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //  return done(err, user);
    //});
  }
));