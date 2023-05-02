import { Router } from 'express';

import {
  createCar, getCar, getCars, updateCar, deleteCar
} from '../controllers/car.controller';

const router = Router();

router.get("/", (req, res, next) => getCars(req, res, next));
router.post("/", (req, res, next) => createCar(req, res, next));
router.get("/:carId", (req, res, next) => getCar(req, res, next));
router.put("/:carId", (req, res, next) => updateCar(req, res, next));
router.delete("/:carId", (req, res, next) => deleteCar(req, res, next));

export default router;