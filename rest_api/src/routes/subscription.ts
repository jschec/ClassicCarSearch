import { Router } from 'express';

import {
  createSubscription, 
  getSubscription, 
  updateSubscription, 
  deleteSubscription
} from '../controllers/subscription.controller';

const router = Router();

router.post("/", (req, res, next) => createSubscription(req, res, next));
router.get(
  "/:subscriptionId", (req, res, next) => getSubscription(req, res, next)
);
router.put(
  "/:subscriptionId", (req, res, next) => updateSubscription(req, res, next)
);
router.delete(
  "/:subscriptionId", (req, res, next) => deleteSubscription(req, res, next)
);

export default router;