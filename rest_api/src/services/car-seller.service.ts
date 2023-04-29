import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { 
  NewCarSellerBody, UpdateCarSellerBody, ICarSellerDoc 
} from '../interfaces/car-seller.interfaces';
import CarSeller from '../models/car-seller.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new CarSeller record
 * 
 * @param {NewCarSellerBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarSellerDoc>} A promise containing the new CarSeller record
 */
export const create = async (reqBody: NewCarSellerBody): Promise<ICarSellerDoc> => {
  if (await CarSeller.isEmailTaken(reqBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  return CarSeller.create(reqBody);
};

/**
 * Retrieves the specified CarSeller record
 * 
 * @param {Types.ObjectId} carSellerId The identifier of the CarSeller to retrieve
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the specified CarSeller record
 */
export const getById = async (carSellerId: Types.ObjectId): Promise<ICarSellerDoc | null> => {
  return CarSeller.findById(carSellerId);
};

/**
 * Updates the CarSeller record with the sought identifier.
 * 
 * @param {Types.ObjectId} carSellerId The identifier of the CarSeller to update
 * @param {UpdateCarSellerBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the updated CarSeller record
 */
export const updateById = async (
  carSellerId: Types.ObjectId, reqBody: UpdateCarSellerBody
): Promise<ICarSellerDoc | null> => {
  const record = await getById(carSellerId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car seller not found');
  }

  if (reqBody.email && (await CarSeller.isEmailTaken(reqBody.email, carSellerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  Object.assign(record, reqBody);
  
  await record.save();
  
  return record;
};

/**
 * Deletes the CarSeller record with the sought identifier.
 * 
 * @param {Types.ObjectId} carSellerId The identifier of the CarSeller to update
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the deleted CarSeller record.
 */
export const deleteById = async (carSellerId: Types.ObjectId): Promise<ICarSellerDoc | null> => {
  const record = await getById(carSellerId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car seller not found');
  }

  await record.deleteOne();
  return record;
};