import httpStatus from 'http-status';

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
 * Retrieves all CarSeller records
 * 
 * @returns {Promise<ICarSellerDoc[]>} A promise containing the all CarSeller records
 */
export const getAll = async (): Promise<ICarSellerDoc[]> => {
  return CarSeller.find();
};

/**
 * Retrieves the specified CarSeller record
 * 
 * @param {string} carSellerId The identifier of the CarSeller to retrieve
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the specified CarSeller record
 */
export const getById = async (carSellerId: string): Promise<ICarSellerDoc | null> => {
  return CarSeller.findById(carSellerId);
};

/**
 * Updates the CarSeller record with the sought identifier.
 * 
 * @param {string} carSellerId The identifier of the CarSeller to update
 * @param {UpdateCarSellerBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the updated CarSeller record
 */
export const updateById = async (
  carSellerId: string, reqBody: UpdateCarSellerBody
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
 * @param {string} carSellerId The identifier of the CarSeller to update
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the deleted CarSeller record.
 */
export const deleteById = async (carSellerId: string): Promise<ICarSellerDoc | null> => {
  const record = await getById(carSellerId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car seller not found');
  }

  await record.deleteOne();
  return record;
};