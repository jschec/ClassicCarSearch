import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { 
  NewCarListingBody, UpdateCarListingBody, ICarListingDoc 
} from '../interfaces/car-listing.interfaces';
import { IPaginationResponse } from '../interfaces/pagination.interfaces';
import { 
  SearchCriteriaRequest, SearchCriteriaRequestPaginated
} from '../interfaces/search-criteria.interfaces';
import CarListing from '../models/car-listing.model';
import ApiError from '../utils/ApiError';

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
 * Applies a query to retrieve CarListing records
 * 
 * @param {NewCarListingBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarListingDoc[] | null>} A promise containing the matching CarListing records
 */
export const applyQuery = async (reqBody: SearchCriteriaRequest): Promise<ICarListingDoc[]> => {
  return CarListing.find({...reqBody});
};

/**
 * Applies a query to retrieve populated CarListing records
 * 
 * @param {SearchCriteriaRequestPaginated} reqBody The request body supplied by the client
 * @returns {Promise<IPaginationResponse<ICarListingDoc>>} A promise containing the matching CarListing records
 */
export const applyQueryFullDoc = async (reqBody: SearchCriteriaRequestPaginated): Promise<IPaginationResponse<ICarListingDoc>> => {
  let { page, pageSize, region, ...carCriteria } = reqBody;
  
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
    searchCriteria["region"] = region;
  }

  for (const [k, v] of Object.entries(carCriteria)) {
    searchCriteria[`car.${k}`] = v;
  }

  let aggregation = await CarListing.aggregate([
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
  ]);

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
 * @param {Types.ObjectId} carListingId The identifier of the CarListing to retrieve
 * @returns {Promise<ICarListingDoc | null>} A promise containing the specified CarListing record
 */
export const getById = async (carListingId: Types.ObjectId): Promise<ICarListingDoc | null> => {
  return CarListing.findById(carListingId);
};

/**
 * Updates the CarListing record with the sought identifier.
 * 
 * @param {Types.ObjectId} carListingId The identifier of the CarListing to update
 * @param {UpdateCarListingBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarListingDoc | null>} A promise containing the updated CarListing record
 */
export const updateById = async (
  carListingId: Types.ObjectId, reqBody: UpdateCarListingBody
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
 * @param {Types.ObjectId} carListingId The identifier of the CarListing to update
 * @returns {Promise<ICarListingDoc | null>} A promise containing the deleted CarListing record.
 */
export const deleteById = async (carListingId: Types.ObjectId): Promise<ICarListingDoc | null> => {
  const record = await getById(carListingId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car listing not found');
  }

  await record.deleteOne();
  return record;
};