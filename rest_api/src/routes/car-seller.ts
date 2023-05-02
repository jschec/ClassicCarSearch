import { Router } from 'express';

import {
  createCarSeller, 
  deleteCarSeller,
  getCarSeller,
  getCarSellers, 
  updateCarSeller, 
} from '../controllers/car-seller.controller';

const router = Router();

router.get("/", (req, res, next) => getCarSellers(req, res, next));
router.post("/", (req, res, next) => createCarSeller(req, res, next));
router.get("/:carSellerId", (req, res, next) => getCarSeller(req, res, next));
router.put(
  "/:carSellerId", (req, res, next) => updateCarSeller(req, res, next)
);
router.delete(
  "/:carSellerId", (req, res, next) => deleteCarSeller(req, res, next)
);

export default router;