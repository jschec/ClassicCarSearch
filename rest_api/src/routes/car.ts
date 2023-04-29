import { Router } from 'express';

import {
  createCar, getCar, updateCar, deleteCar
} from '../controllers/car.controller';

const router = Router();

router.post("/", (req, res, next) => createCar(req, res, next));
router.get("/:carId", (req, res, next) => getCar(req, res, next));
router.put("/:carId", (req, res, next) => updateCar(req, res, next));
router.delete("/:carId", (req, res, next) => deleteCar(req, res, next));

export default router;