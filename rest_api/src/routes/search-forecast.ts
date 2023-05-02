import { Router } from 'express';

import {
  createSearchForecast,
  deleteSearchForecast,
  getSearchForecast,
  updateSearchForecast 
} from '../controllers/search-forecast.controller';

const router = Router();

router.post(
  "/", (req, res, next) => createSearchForecast(req, res, next)
);
router.get(
  "/:searchForecastId", (req, res, next) => getSearchForecast(req, res, next)
);
router.put(
  "/:searchForecastId", (req, res, next) => updateSearchForecast(req, res, next)
);
router.delete(
  "/:searchForecastId", (req, res, next) => deleteSearchForecast(req, res, next)
);

export default router;