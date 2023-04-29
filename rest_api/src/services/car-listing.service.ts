import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { 
  NewCarListingBody, UpdateCarListingBody, ICarListingDoc 
} from '../interfaces/car-listing.interfaces';
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
 * Retrieves the specified CarListing record
 * 
 * @param {Types.ObjectId} id The identifier of the CarListing to retrieve
 * @returns {Promise<ICarListingDoc | null>} A promise containing the specified CarListing record
 */
export const getById = async (id: Types.ObjectId): Promise<ICarListingDoc | null> => {
  return CarListing.findById(id);
};

/**
 * Updates the CarListing record with the sought identifier.
 * 
 * @param {Types.ObjectId} carId The identifier of the CarListing to update
 * @param {UpdateCarListingBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarListingDoc | null>} A promise containing the updated CarListing record
 */
export const updateById = async (
  carId: Types.ObjectId, reqBody: UpdateCarListingBody
): Promise<ICarListingDoc | null> => {
  const record = await getById(carId);
  
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
 * @param {Types.ObjectId} carId The identifier of the CarListing to update
 * @returns {Promise<ICarListingDoc | null>} A promise containing the deleted CarListing record.
 */
export const deleteById = async (carId: Types.ObjectId): Promise<ICarListingDoc | null> => {
  const record = await getById(carId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car listing not found');
  }

  await record.deleteOne();
  return record;
};