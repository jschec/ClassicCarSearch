import { Router } from 'express';

import {
  createCarSeller, 
  deleteCarSeller,
  getCarSeller, 
  updateCarSeller, 
} from '../controllers/car-seller.controller';

const router = Router();

router.post("/", (req, res, next) => createCarSeller(req, res, next));
router.get("/:carSellerId", (req, res, next) => getCarSeller(req, res, next));
router.put("/:carSellerId", (req, res, next) => updateCarSeller(req, res, next));
router.delete("/:carSellerId", (req, res, next) => deleteCarSeller(req, res, next));

export default router;