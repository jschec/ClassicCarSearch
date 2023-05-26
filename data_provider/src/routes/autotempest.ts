import { Router, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import * as autotempestService from '../services/autotempest';

const query = catchAsync(async (req: Request, res: Response) => {
    await autotempestService.query("hi");
    res.send('hi');
});

const router = Router();
router.get("/query", query);

export default router;