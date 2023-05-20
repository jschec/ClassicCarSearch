import { Router } from 'express';
import { authenticate } from 'passport';

import config from '../config';

const router = Router();

router.get('/auth/google', authenticate('google', {scope: config.oauth.scope}));
router.get(
  '/auth/google/callback', 
  authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log("successfully authenticated user and returned to callback page.");
    console.log("redirecting to /#/list");
    res.redirect('/#/list');
  }
);

export default router;