import { Router } from 'express';

import {
  createCarListing, 
  deleteCarListing,
  getCarListing, 
  updateCarListing, 
} from '../controllers/car-listing.controller';

const router = Router();

router.post("/", (req, res, next) => createCarListing(req, res, next));
router.get("/:carListingId", (req, res, next) => getCarListing(req, res, next));
router.put("/:carListingId", (req, res, next) => updateCarListing(req, res, next));
router.delete("/:carListingId", (req, res, next) => deleteCarListing(req, res, next));

export default router;