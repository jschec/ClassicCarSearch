import { Router, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { IAddJobResult, SearchCriteriaBody } from '../interfaces/criteria';
import { autotempestJobHandler, AUTOTEMPEST_JOB_HANDLER_NAME } from '../services/autotempest';
import { Job, defaultCenter } from '../queue/queue';

defaultCenter.registerHandler(autotempestJobHandler);

const getQueryTaskList = catchAsync(async (req: Request, res: Response) => {
    const list = defaultCenter.getJobList();
    res.send(list);
});

const getQueryTaskInfo = catchAsync(async (req: Request, res: Response) => {
    res.send({});
});

const createQueryTask = catchAsync(async (req: Request<SearchCriteriaBody>, res: Response) => {

    const job: Job = defaultCenter.pushJob(AUTOTEMPEST_JOB_HANDLER_NAME, req.body);

    const result: IAddJobResult = {
        jobId: job.id,
        criteria: job.data,
    };
    res.send(result);
});

const router = Router();
router.get("/query/list", getQueryTaskList);
router.get("/query/:id", getQueryTaskInfo);
router.post("/query", createQueryTask);

export default router;