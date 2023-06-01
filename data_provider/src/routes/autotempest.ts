import { Router, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { IAddJobResult, SearchCriteriaBody } from '../interface/criteria.interface';
import { autotempestJobHandler, AUTOTEMPEST_JOB_HANDLER_NAME } from '../services/autotempest';
import { Job, jobQueue } from '../queue/queue';

jobQueue.registerHandler(autotempestJobHandler);

const getQueryTaskList = catchAsync(async (req: Request, res: Response) => {
    const list = jobQueue.getJobList();
    res.send(list);
});

const getQueryTaskInfo = catchAsync(async (req: Request, res: Response) => {
    if (req.params['jobid']) {
        const jobId = req.params['jobid'];
        const jobItem = jobQueue.getJobById(jobId);
        if (jobItem)  {
            res.send(jobItem);
        } else {
            res.send({});
        }
    } else {
        res.send({});
    }
});

const createQueryTask = catchAsync(async (req: Request<SearchCriteriaBody>, res: Response) => {

    const job: Job = jobQueue.pushJob(AUTOTEMPEST_JOB_HANDLER_NAME, req.body);

    const result: IAddJobResult = {
        jobId: job.id,
        criteria: job.data,
    };
    res.send(result);
});

const router = Router();
router.get("/query/list", getQueryTaskList);
router.get("/query/:jobid", getQueryTaskInfo);
router.post("/query", createQueryTask);

export default router;