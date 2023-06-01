import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SHA256 } from 'crypto-js';
import { ISearchCrtieria, SearchCriteriaBody } from '../interface/criteria.interface';
import { ITaskHandler, Job } from '../queue/queue';

enum Localization {
    Any = 'any',
}
enum Sort {
    BestMatch = 'best_match',
}
enum Site {
    TE = "te",
    CM = "cm",
    CS = "cs",
    CV = "CV",
    EB = "eb",
    TC = "tc",
    OT = "ot",
    ST = "st",
    FBM = "fbm",
}

export class AutoTempestCriteria {
    zip!: number;
    sort!: Sort;
    page!: number;
    make?: string;
    // domesticonly: number;
    // localization: Localization;
    minyear?: number;
    maxyear?: number;
    radius?: number;
    // showUnpaid: number;
    // showPrivate: number;
    // sites: string,
    // deduplicationSites: string;
    rpp?: number;

    constructor(zip: number, page?: number) {
        this.zip = zip;
        this.sort = Sort.BestMatch;
        if (page == null) {
            this.page = 1;
        } else {
            this.page = page as number;
        }
    }
};

export interface ISearchResult {
    page: number;
};

// QUERY_PARAMETER = {
//     "domesticonly": 0,
//     "localization": "any",
//     "minyear": 1900,
//     "maxyear": 1980,
//     "radius": 12999,
//     "minradius": 500,
//     "showUnpaid": 0,
//     "showPrivate": 0,
//     "zip": 98007,
//     "sort": "best_match",
//     "sites": "cm",
//     "deduplicationSites": "te|cm|cs|cv|eb|tc|ot|st|fbm",
//     "rpp": 50,
//     "page": 1,
// }

function buildQueryString(criteria: AutoTempestCriteria): string {
    var queryString = "";
    for (const key in criteria) {
        if (Object.prototype.hasOwnProperty.call(criteria, key)) {
            const value = criteria[key as keyof AutoTempestCriteria];
            if (queryString !== "") {
                queryString += "&";
            }
            queryString += `${key}=${value}`;
        }
    }
    return queryString;
}

function makeRefererURL(criteria: AutoTempestCriteria): string {
    const queryString = buildQueryString(criteria);
    return `https://www.autotempest.com/results?${queryString}`;
}

async function sendRequest(criteria: AutoTempestCriteria): Promise<any> {
    const url = 'https://www.autotempest.com/queue-results?';

    var queryString = buildQueryString(criteria);
    const token = "d8007486d73c168684860aae427ea1f9d74e502b06d94609691f5f4f2704a07f";
    const hashToken = SHA256(queryString + token).toString();

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Referer': makeRefererURL(criteria),
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        };

        const options: AxiosRequestConfig = {
            url: url + queryString + '&token=' + hashToken,
            method: 'GET',
            headers: headers,
        };

        const response: AxiosResponse = await axios(options);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}


function convertSearchCriteriaToAutoTempestCriteria(criteria: SearchCriteriaBody): AutoTempestCriteria {
    var result: AutoTempestCriteria = new AutoTempestCriteria(98122);
    if (criteria.make) {
        result.make = criteria.make;
    }
    if (criteria.startYear) {
        result.minyear = criteria.startYear;
    }
    if (criteria.endYear) {
        result.maxyear = criteria.endYear;
    }
    return result;
}

function decodeResponse(resp: Record<string, any>): Record<string, any> {
    console.log(resp);
    return {};
}

export const queryAutotempest = async (criteria: SearchCriteriaBody): Promise<any> => {
    console.log('start query...');
    // step 1: convert parameters
    const autotempestCriteria = convertSearchCriteriaToAutoTempestCriteria(criteria);

    // step 2: request data
    const maxPage: number = 1;
    for (var i=1; i<=maxPage; i++) {
        console.log(`Query page ${i}`);
        autotempestCriteria.page = i;
        const eachResult = await sendRequest(autotempestCriteria);
        // step 3: convert data
        decodeResponse(eachResult);
    }

    // step 4: write db

    return {};
};

export const AUTOTEMPEST_JOB_HANDLER_NAME = "AUTOTEMPEST";

class AutotempestJobHandler implements ITaskHandler {

    constructor() {
        //
    }

    getName(): string {
        return AUTOTEMPEST_JOB_HANDLER_NAME;
    }

    async processJob(job: Job): Promise<void> {
        const criteria = convertSearchCriteriaToAutoTempestCriteria(job.data);
        await queryAutotempest(criteria);
    }
};

export const autotempestJobHandler = new AutotempestJobHandler();