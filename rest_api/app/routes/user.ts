import { Router } from 'express';

import {
  createUser, getUser, updateUser, deleteUser
} from '../controllers/user.controller';

const router = Router();

router.post("/", (req, res, next) => createUser(req, res, next));
router.get("/:id", (req, res, next) => getUser(req, res, next));
router.put("/:id", (req, res, next) => updateUser(req, res, next));
router.delete("/:id", (req, res, next) => deleteUser(req, res, next));

export default router;