import httpStatus from 'http-status';

import { 
  NewCarListingBody, UpdateCarListingBody, ICarListingDoc 
} from '../interfaces/car-listing.interfaces';
import { IPaginationResponse } from '../interfaces/pagination.interfaces';
import { 
  SearchCriteriaRequest, SearchCriteriaRequestPaginated
} from '../interfaces/search-criteria.interfaces';
import CarListing from '../models/car-listing.model';
import ApiError from '../utils/ApiError';
import { PipelineStage } from 'mongoose';

/**
 * Creates a new CarListing record
 * 
 * @param {NewCarListingBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarListingDoc>} A promise containing the new CarListing record
 */
export const create = async (reqBody: NewCarListingBody): Promise<ICarListingDoc> => {
  return CarListing.create(reqBody);
};

/**
 * Applies a query to retrieve populated CarListing records
 * 
 * @param {SearchCriteriaRequestPaginated} reqBody The request body supplied by the client
 * @param {boolean} isPaginated If true, the query will be paginated. Defaults to true.
 * @returns {Promise<IPaginationResponse<ICarListingDoc>>} A promise containing the matching CarListing records
 */
export const applyQuery = async (reqBody: SearchCriteriaRequestPaginated, isPaginated: boolean = true): Promise<IPaginationResponse<ICarListingDoc>> => {
  let { page, pageSize, region, ...carCriteria } = reqBody;

  console.log("page", page);
  console.log("pageSize", pageSize);
  console.log("region", region);
  console.log("carCriteria", carCriteria);
  
  // Ugly, but necessary to convert page to number
  if (typeof page === 'string') {
    page = parseInt(page);
  }

  // Ugly, but necessary to convert pageSize to number
  if (typeof pageSize === 'string') {
    pageSize = parseInt(pageSize);
  }

  // Create a MongoDB friendly query
  var searchCriteria: {[key: string]: any} = {};

  if (region) {
    searchCriteria["region"] = { "$in": (region as string).split(',') };
  }

  for (const [k, v] of Object.entries(carCriteria)) {
    if (k === 'exteriorCondition' || k === 'mechanicalCondition') {
      searchCriteria[`car.${k}`] = { "$in": (v as string).split(',') }
    } else if (k === 'startYear') {
      const startYear = typeof v === 'string' ? parseInt(v as string) : v;
      searchCriteria['car.year'] = { "$gte": startYear }
    } else if (k === 'endYear') {
      const endYear = typeof v === 'string' ? parseInt(v as string) : v;
      searchCriteria['car.year'] = { "$lte": endYear }
    } else {
      searchCriteria[`car.${k}`] = v;
    }
  }

  let transformations: PipelineStage[] = [
    { 
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'car'
      }
    },
    { 
      $lookup: {
        from: 'carsellers',
        localField: 'seller',
        foreignField: '_id',
        as: 'seller'
      }
    },
    {
      $unwind: '$car',
    },
    {
      $unwind: '$seller',
    },
    { 
      $match: searchCriteria
    },
    { 
      $sort: { createdAt: -1 } 
    },
  ];

  if (isPaginated) {
    transformations.push(
      {
        $facet: {
          records: [
            { $skip: page }, 
            { $limit: pageSize }
          ],
          numRecords: [
            {
              $count: 'count'
            }
          ]
        }
      }
    );
  } else {
    transformations.push(
      {
        $facet: {
          records: [
            { $skip: 0 }
          ],
          numRecords: [
            {
              $count: 'count'
            }
          ]
        }
      }
    );
  }

  const aggregation = await CarListing.aggregate(transformations);

  return {
    page: page,
    pageSize: pageSize,
    numRecords: aggregation[0].numRecords[0] ? aggregation[0].numRecords[0].count : 0, 
    records: aggregation[0].records ? aggregation[0].records : []
  }
};

/**
 * Retrieves all CarListing records
 * 
 * @returns {Promise<ICarListingDoc | null>} A promise containing the all CarListing records
 */
export const getAll = async (): Promise<ICarListingDoc[]> => {
  return CarListing.find();
};

/**
 * Retrieves the specified CarListing record
 * 
 * @param {string} carListingId The identifier of the CarListing to retrieve
 * @param {boolean} isPopulated Whether to populate the CarListing record. Defaults to false.
 * @returns {Promise<ICarListingDoc | null>} A promise containing the specified CarListing record
 */
export const getById = async (carListingId: string, isPopulated: boolean = false): Promise<ICarListingDoc | null> => {
  let record = await CarListing.findById(carListingId);
  if (record && isPopulated) {
    record = await record.populate([
      {
        path: 'car',
        select: '-createdAt -updatedAt -__v -_id',
      },
      {
        path: 'seller',
        select: '-createdAt -updatedAt -__v -_id',
      }
    ])
  }

  return record;
};

/**
 * Updates the CarListing record with the sought identifier.
 * 
 * @param {string} carListingId The identifier of the CarListing to update
 * @param {UpdateCarListingBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarListingDoc | null>} A promise containing the updated CarListing record
 */
export const updateById = async (
  carListingId: string, reqBody: UpdateCarListingBody
): Promise<ICarListingDoc | null> => {
  const record = await getById(carListingId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car listing not found');
  }
  
  Object.assign(record, reqBody);
  
  await record.save();
  
  return record;
};

/**
 * Deletes the CarListing record with the sought identifier.
 * 
 * @param {string} carListingId The identifier of the CarListing to update
 * @returns {Promise<ICarListingDoc | null>} A promise containing the deleted CarListing record.
 */
export const deleteById = async (carListingId: string): Promise<ICarListingDoc | null> => {
  const record = await getById(carListingId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car listing not found');
  }

  await record.deleteOne();
  return record;
};