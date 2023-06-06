import { v4 as uuidv4 } from 'uuid';
import Fastq from 'fastq';
import { promisify } from 'util';
import { SearchCriteriaBody } from '../interface/criteria.interface';

export interface Job {
    id: string;
    type: string;
    data: any;
}

export interface ITaskHandler {
    getName(): string;
    processJob(job: Job): Promise<void>;
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

class JobQueue {
    private handlers: Record<string, ITaskHandler>;
    private jobItems: Record<string, JobItem>;
    private queue: Fastq.queue<Job, any>;

    constructor() {
        this.handlers = {};
        this.jobItems = {};
        this.queue = Fastq(async (job: Job, callback: (error: Error | null, result?: any) => void) => {
            try {
                console.log(`Processing task: ${job.id}`);
                await this.processJob(job);
                console.log(`Task completed: ${job.id}`);
                callback(null, job);
            } catch (error) {
                console.log(`Task completed: ${job.id}, error: ${error}`);
                callback(error as Error, job);
            }
        }, 1);
    }

    registerHandler(handler: ITaskHandler): void {
        this.handlers[handler.getName()] = handler;
    }

    pushJob(type: string, data: any): Job {
        const job = this.initialJob(type, data);

        // push task
        this.queue.push(job, (error: Error | null, result?: any) => {
            this.completeJob(error, result! as Job);
        });

        return job;
    }

    getJobList(): Job[] {
        return Object.values(this.jobItems)
            .filter(item => item.job !== null)
            .map(item => item.job!);
    }

    getJobById(jobId: string): JobItem | null {
        if (jobId in this.jobItems) {
            this.jobItems[jobId]
        }
        return null;
    }

    private async processJob(job: Job): Promise<void> {
        this.updateJobStatus(job, JobStatus.EXECUTING);

        if (job.type in this.handlers) {
            await this.handlers[job.type].processJob(job);
        } else {
            console.error(`type not exist, id: ${job.id} type: ${job.type}`);
        }
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

export const jobQueue = new JobQueue();