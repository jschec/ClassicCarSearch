import { Router } from 'express';
import passport from 'passport';

import config from '../config';

const router = Router();

router.get('/google', passport.authenticate('google', {scope: config.oauth.scope}));
router.get(
  '/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log("successfully authenticated user and returned to callback page.");
    console.log("redirecting to /#/list");
    res.redirect('/#/list');
  }
);
/*
router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})
*/

export default router;