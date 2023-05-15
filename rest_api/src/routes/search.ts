import { Router } from 'express';

import {
  applySearch,
  createSearch,
  deleteSearch,
  getSearch,
  getSearchByParam,
  getSearchForecasts,
  updateSearch
} from '../controllers/search.controller';

const router = Router();

router.get("/", (req, res, next) => applySearch(req, res, next));
router.post("/", (req, res, next) => createSearch(req, res, next));
router.post("/query", (req, res, next) => getSearchByParam(req, res, next));
router.get("/:searchId", (req, res, next) => getSearch(req, res, next));
router.put("/:searchId", (req, res, next) => updateSearch(req, res, next));
router.delete("/:searchId", (req, res, next) => deleteSearch(req, res, next));
router.get(
  "/:searchId/forecasts", (req, res, next) => getSearchForecasts(req, res, next)
);

export default router;