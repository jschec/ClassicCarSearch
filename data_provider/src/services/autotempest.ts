import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SHA256 } from 'crypto-js';

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

export interface ISearchCriteria {
    make: string;
    domesticonly: number;
    localization: Localization;
    minyear: number;
    maxyear: number;
    radius: number;
    showUnpaid: number;
    showPrivate: number;
    zip: number;
    sort: Sort;
    sites: string,
    deduplicationSites: string;
    rpp: number;
    page: number;
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

function makeRefererURL(criteria: ISearchCriteria): string {
    return `https://www.autotempest.com/results?make=${criteria.make}&zip=${criteria.zip}&localization=${criteria.localization}&domesticonly=${criteria.domesticonly}`;
}

async function sendRequest(criteria: ISearchCriteria): Promise<any> {
    const url = 'https://www.autotempest.com/queue-results?';

    var queryString = "";
    for (const key in criteria) {
        if (Object.prototype.hasOwnProperty.call(criteria, key)) {
            const value = criteria[key as keyof ISearchCriteria];
            if (queryString !== "") {
                queryString += "&";
            }
            queryString += `${key}=${value}`;
        }
    }

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

export const queryAutotempest = async (criteria: ISearchCriteria): Promise<any> => {
    const result = await sendRequest(criteria);
    return result;
};