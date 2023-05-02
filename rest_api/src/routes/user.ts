import { Router } from 'express';

import {
  createUser, getUser, updateUser, deleteUser
} from '../controllers/user.controller';

const router = Router();

router.post("/", (req, res, next) => createUser(req, res, next));
router.get("/:userId", (req, res, next) => getUser(req, res, next));
router.put("/:userId", (req, res, next) => updateUser(req, res, next));
router.delete("/:userId", (req, res, next) => deleteUser(req, res, next));

export default router;