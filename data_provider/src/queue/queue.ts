import { v4 as uuidv4 } from 'uuid';
import Fastq from 'fastq';
import { promisify } from 'util';
import { SearchCriteriaBody } from '../interfaces/criteria';

export interface Job {
    id: string;
    type: string;
    data: any;
}

export interface ITaskHandler {
    getName(): string;
    processJob(job: Job): void;
}

enum JobStatus {
    READY  = 'READY',
    EXECUTING = 'EXECUTING',
    FINISHED = 'FINISHED',
}

class JobItem {
    job?: Job;
    status?: JobStatus;
}

class ProcessCenter {
    private handlers: Record<string, ITaskHandler>;
    private jobItems: Record<string, JobItem>;

    constructor() {
        this.handlers = {};
        this.jobItems = {};
    }

    registerHandler(handler: ITaskHandler): void {
        this.handlers[handler.getName()] = handler;
    }

    processJob(job: Job): void {
        this.updateJobStatus(job, JobStatus.EXECUTING);

        if (job.type in this.handlers) {
            this.handlers[job.type].processJob(job);
        } else {
            console.error(`type not exist, id: ${job.id} type: ${job.type}`);
        }
    }

    pushJob(type: string, data: any): Job {
        const job = this.initialJob(type, data);

        // push task
        queue.push(job, (error: Error | null, result?: any) => {
            this.completeJob(error, result! as Job);
        });

        return job;
    }

    getJobList(): Job[] {
        return Object.values(this.jobItems)
            .filter(item => item.job !== null)
            .map(item => item.job!);
    }

    private updateJobStatus(job: Job, status: JobStatus): void {
        if (job.id in this.jobItems) {
            if (status === JobStatus.FINISHED) {
                const { [job.id]: _, ...newJobItems } = this.jobItems;
                this.jobItems = newJobItems;
            } else {
                this.jobItems[job.id].status = status;
            }
        }
    }

    private initialJob(type: string, data: any): Job {
        const uuid: string = uuidv4();
        const job: Job = {
            id: uuid,
            type: type,
            data: data,
        };

        // add job
        const jobItem: JobItem = {
            job: job,
            status: JobStatus.READY,
        };
        this.jobItems[job.id] = jobItem;
        console.log(`Initial job finish. Total jobs: ${Object.keys(this.jobItems).length}`);

        return job;
    }

    private completeJob(error: Error | null, job: Job): void {
        this.updateJobStatus(job, JobStatus.FINISHED);
        console.log(`Job completed. Total jobs: ${Object.keys(this.jobItems).length}`);
    }
}

export const defaultCenter = new ProcessCenter();

const processTask = async (job: Job) => {
    defaultCenter.processJob(job);
};

const queue = Fastq(async (job: Job, callback: (error: Error | null, result?: any) => void) => {
    try {
        console.log(`Processing task: ${job.id}`);
        await processTask(job);
        console.log(`Task completed: ${job.id}`);
        callback(null, job);
    } catch (error) {
        console.log(`Task completed: ${job.id}, error: ${error}`);
        callback(error as Error, job);
    }
}, 1);


// export default queue;