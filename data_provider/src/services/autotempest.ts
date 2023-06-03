import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SHA256 } from 'crypto-js';
import { SearchCriteriaBody } from '../interface/criteria.interface';
import { ICar, ICarDoc, NewCarBody, UpdateCarBody } from '../interface/car.interface';
import { ITaskHandler, Job } from '../queue/queue';
import Car from '../model/car.model';
import CarSeller from '../model/car-seller.model';
import CarListing from '../model/car-listing.model';
import { Condition } from '../interface/condition.interfaces';
import { ICarSeller, ICarSellerDoc, NewCarSellerBody, UpdateCarSellerBody } from '../interface/car-seller.interface';
import { ICarListing, ICarListingDoc, NewCarListingBody, UpdateCarListingBody } from '../interface/car-listing.interface';
import { Region } from '../interface/region.interfaces';
import { faker } from '@faker-js/faker';

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
    domesticonly?: number;
    localization?: Localization;
    minyear?: number;
    maxyear?: number;
    radius?: number;
    minradius?: number;
    showUnpaid?: number;
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

interface IAutoTempestResultItem {
    id: string;
    vin: string;
    externalId: string;
    location: string;
    locationCode: string;
    title: string;
    mileage: string;
    distance: number;
    details: string;
    make: string;
    model: string;
    backendModel: string;
    price: string;
    year: string;
    imgFallback: string;

    pendingSale: boolean;
    sellerType: string;
    date: string;
    ctime: number;
    phone: string;
    detailsShort: string;
    detailsMid: string;
    detailsLong: string;

    url: string;
    sourceName: string;
}

interface IAutoTempestResult {
    status: number;
    placeholder_img: string;
    lastPage: boolean;
    results: IAutoTempestResultItem[];
}

const defaultAutoTempestResult: IAutoTempestResult = {
    status: 0,
    placeholder_img: '',
    lastPage: true,
    results: [],
}

const defaultAutoTempestResultItem: IAutoTempestResultItem = {
    id: '',
    vin: '',
    externalId: '',
    location: '',
    locationCode: '',
    title: '',
    mileage: '',
    distance: 0,
    details: '',
    make: '',
    model: '',
    backendModel: '',
    price: '',
    year: '',
    imgFallback: '',

    pendingSale: false,
    sellerType: '',
    date: '',
    ctime: 0,
    phone: '',
    detailsShort: '',
    detailsMid: '',
    detailsLong: '',

    url: '',
    sourceName: '',
}

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

const buildQueryString = (criteria: AutoTempestCriteria, filterFields?: string[]): string => {
    var queryString = "";
    for (const key in criteria) {
        if (Object.prototype.hasOwnProperty.call(criteria, key)) {
            const value = criteria[key as keyof AutoTempestCriteria];
            if (filterFields) {
                if (key in filterFields) {
                    continue;
                }
            }
            if (queryString !== "") {
                queryString += "&";
            }
            queryString += `${key}=${value}`;
        }
    }
    return queryString;
}

const makeRefererURL = (criteria: AutoTempestCriteria): string => {
    const queryString = buildQueryString(criteria, ['page']);
    return `https://www.autotempest.com/results?${queryString}`;
}

const sendRequest = async (criteria: AutoTempestCriteria): Promise<any> => {
    const url = 'https://www.autotempest.com/queue-results?';

    var queryString = buildQueryString(criteria);
    const token = "d8007486d73c168684860aae427ea1f9d74e502b06d94609691f5f4f2704a07f";
    const hashToken = SHA256(queryString + token).toString();

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Referer': makeRefererURL(criteria),
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            // 'Dnt': '1',
            // 'Pragma': 'no-cache',
            // 'Sec-Ch-Ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            // 'Sec-Ch-Ua-Mobile': '?0',
            // 'Sec-Ch-Ua-Platform': 'macOS',
            // 'Sec-Fetch-Dest': 'empty',
            // 'Sec-Fetch-Mode': 'cors',
            // 'Sec-Fetch-Site': 'same-origin',
        };

        const options: AxiosRequestConfig = {
            url: url + queryString + '&token=' + hashToken,
            method: 'GET',
            headers: headers,
            timeout: 10000, // 10s
        };

        const response: AxiosResponse = await axios(options);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}


const convertSearchCriteriaToAutoTempestCriteria = (criteria: SearchCriteriaBody): AutoTempestCriteria => {
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
    result.localization = Localization.Any;
    result.domesticonly = 0;
    result.radius = 12999;
    result.minradius = 500;
    result.showUnpaid = 0;
    return result;
}

const decodeResponse = (resp: Record<string, any>): IAutoTempestResult => {
    const keys = Object.keys(defaultAutoTempestResult);
    const itemKeys = Object.keys(defaultAutoTempestResultItem);
    let convertedResult: Record<string, any> = {};

    keys.forEach((key) => {
        if (key in resp) {
            if (key === "results") {
                const originalResults = resp[key] as Record<string, any>[];
                let convertedResults: any[] = [];
                originalResults.forEach((eachResult) => {
                    let convertedResultItem: Record<string, any> = {};
                    itemKeys.forEach((itemKey) => {
                        if (itemKey in eachResult) {
                            convertedResultItem[itemKey] = eachResult[itemKey];
                        }
                    });
                    convertedResults.push(convertedResultItem);
                });
                convertedResult[key] = convertedResults;
            } else {
                convertedResult[key] = resp[key];
            }
        }
    });
    // console.log(convertedResult);
    return convertedResult as IAutoTempestResult;
}

const randomCondition = () => {
    const conditions: string[] = Object.values(Condition);
    const randCondition = conditions[faker.datatype.number({ min: 0, max: conditions.length - 1 })] as Condition;

    return randCondition;
};

const randomRegion = () => {
    const regions: string[] = Object.values(Region);
    const randRegion = regions[faker.datatype.number({ min: 0, max: regions.length - 1 })] as Region;

    return randRegion;
};

const writeItemToDatabase = async (item: IAutoTempestResultItem): Promise<void> => {
    console.log(`write item start: ${item.id}`);

    // Car
    const externalId = item.id + ":" + item.externalId + ":" + item.vin;
    let model = (item.model) ? item.model : item.backendModel;
    if (model == null || model === "") {
        // TODO: Missing fields
        model = "Unknow";
    }
    const newCar: NewCarBody | UpdateCarBody = {
        make: (item.make) ? item.make : "Unknow",
        model: model,
        year: Number.parseInt(item.year),
        mileage: (item.mileage) ? Number.parseInt(item.mileage.replace(",", "")) : 0,
        img: item.imgFallback,
        externalId: externalId,
        // TODO: Missing field.
        color: 'Unknow',
        exteriorCondition: randomCondition(),
        mechanicalCondition: randomCondition(),
    };

    let car = await Car.findOne({ 'externalId': externalId });
    if (car == null) {
        car = await Car.create(newCar);
        console.log(`Write Car finish. ExternalID: ${externalId}`);
    } else {
        await Object.assign(car, newCar);
        await car.save();
        console.log(`Update Car finish. ExternalID: ${externalId}`);
    }

    // TODO: Missing field, Car Seller
    const newCarSeller: NewCarSellerBody = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email()
    };

    // Car Listing
    let newCarListing: NewCarListingBody = {
        externalId: externalId,
        price: (item.price) ? Number.parseInt(item.price.replace(",", "").replace("$", "")) : 0,
        car: car._id,
        listDate: (item.ctime) ? new Date(item.ctime * 1000) : new Date(),
        saleDate: null, // (item.ctime) ? new Date(item.ctime * 1000) : undefined,
        // TODO: missing fields
        region: randomRegion(),
        seller: '',
    }

    // Find carlisting from externalid
    let carListing = await CarListing.findOne({ 'externalId': externalId });
    if (carListing) {
        // Get the existen carSeller info
        const carSeller = await CarSeller.findOne({ _id: carListing.seller });
        newCarListing.seller = carSeller?._id;
    }

    if (newCarListing.seller === '') {
        const carSeller = await CarSeller.create(newCarSeller);
        newCarListing.seller = carSeller._id;
        console.log(`Write CarSeller finish. ExternalID: ${externalId}`);
    } else {
        console.log(`CarSeller Exists. ExternalID: ${externalId}`);
    }

    // Write CarListing
    if (carListing == null) {
        carListing = await CarListing.create(newCarListing);
        console.log(`Write CarListing finish. ExternalID: ${externalId}`);
    } else {
        await Object.assign(carListing, newCarListing as UpdateCarListingBody);
        await carListing.save();
        console.log(`Update CarListing finish. ExternalID: ${externalId}`);
    }

}

const writeDatabase = async (result: IAutoTempestResult): Promise<void> => {
    for (const item of result.results) {
        try {
            await writeItemToDatabase(item);
        } catch (error) {
            console.error(error);
        }
    }
}

const wait = async (duration: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export const queryAutotempest = async (criteria: SearchCriteriaBody): Promise<any> => {
    console.log('start query...');
    // step 1: convert parameters
    const autotempestCriteria = convertSearchCriteriaToAutoTempestCriteria(criteria);

    // step 2: request data
    const maxPage: number = 10;
    for (var i=1; i<=maxPage; i++) {
        console.log(`Query page ${i}`);
        autotempestCriteria.page = i;
        const eachResult = await sendRequest(autotempestCriteria);
        // step 3: convert data
        try {
            const eachItem = decodeResponse(eachResult);
            // step 4: write db
            await writeDatabase(eachItem);

            if (eachItem.lastPage) {
                break;
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            break;
        }
        // step 5: wait 5s
        await wait(5000);
    }

    console.log('Finish query.');

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