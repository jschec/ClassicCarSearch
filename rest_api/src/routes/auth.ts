import { Router } from 'express';
import passport from 'passport';

import config from '../config';
import { IUser, ISafeUser } from '../interfaces/user.interfaces';

const router = Router();

router.get('/google', passport.authenticate('google', {scope: config.oauth.scope}));
router.get(
  '/google/callback', passport.authenticate('google', { 
    successRedirect: config.routes.landingUrl,
    failureRedirect: config.routes.loginUrl, 
  })
);

router.get("/session", (req, res) => {
  let userCopy: ISafeUser = Object.assign({}, req.user as IUser);

  // Remove sensitive data
  delete userCopy.ssoID;

  res.send({ user: req.user, isAuthenticated: req.isAuthenticated() });
});

router.delete("/session", (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
  });

  // Required, otherwise error will be thrown
  if(res.headersSent !== true) {
    res.send({ success: true });
  }
})

export default router;