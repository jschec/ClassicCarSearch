import { Router, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { ISearchCriteria, queryAutotempest } from '../services/autotempest';

export type SearchCriteriaBody = Partial<ISearchCriteria>;

const query = catchAsync(async (req: Request<SearchCriteriaBody>, res: Response) => {
    const result = await queryAutotempest(req.body);
    res.send(result);
});

const router = Router();
router.post("/query", query);

export default router;