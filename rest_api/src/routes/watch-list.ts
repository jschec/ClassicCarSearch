import { Router } from 'express';

import {
  createWatchList, 
  deleteWatchList,
  getWatchList, 
  updateWatchList, 
} from '../controllers/watch-list.controller';

const router = Router();

router.post("/", (req, res, next) => createWatchList(req, res, next));
router.get(
  "/:watchListId", (req, res, next) => getWatchList(req, res, next)
);
router.put(
  "/:watchListId", (req, res, next) => updateWatchList(req, res, next)
);
router.delete(
  "/:watchListId", (req, res, next) => deleteWatchList(req, res, next)
);

export default router;