import httpStatus from 'http-status';

import { 
  NewCarBody, UpdateCarBody, ICarDoc 
} from '../interfaces/car.interfaces';
import Car from '../models/car.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new Car record
 * 
 * @param {NewCarBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarDoc>} A promise containing the new Car record
 */
export const create = async (reqBody: NewCarBody): Promise<ICarDoc> => {
  return Car.create(reqBody);
};

/**
 * Retrieves all Car records
 * 
 * @returns {Promise<ICarDoc[]>} A promise containing the all Car records
 */
export const getAll = async (): Promise<ICarDoc[]> => {
  return Car.find();
};

/**
 * Retrieves the specified Car record
 * 
 * @param {string} carId The identifier of the Car to retrieve
 * @returns {Promise<ICarDoc | null>} A promise containing the specified Car record
 */
export const getById = async (carId: string): Promise<ICarDoc | null> => {
  return Car.findById(carId);
};

/**
 * Gets a Car record, with the forecast populated
 * 
 * @param {string} carId The identifier of the Car to update
 * @param {UpdateCarBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarDoc | null>} A promise containing the updated Car record
 */

export const getFullDocById = async (carId: string): Promise<ICarDoc | null> => {
  let carDoc = await Car.findById(carId);
  if (carDoc) {
    carDoc = await carDoc.populate({path: 'forecastId', select: '-createdAt -updatedAt -__v -_id'});
  }
  return carDoc;
}
/**
 * Updates the Car record with the sought identifier.
 * 
 * @param {string} carId The identifier of the Car to update
 * @param {UpdateCarBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarDoc | null>} A promise containing the updated Car record
 */

export const updateById = async (
  carId: string, reqBody: UpdateCarBody
): Promise<ICarDoc | null> => {
  const record = await getById(carId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }
  
  Object.assign(record, reqBody);
  
  await record.save();
  
  return record;
};

/**
 * Deletes the Car record with the sought identifier.
 * 
 * @param {string} carId The identifier of the Car to update
 * @returns {Promise<ICarDoc | null>} A promise containing the deleted Car record.
 */
export const deleteById = async (carId: string): Promise<ICarDoc | null> => {
  const record = await getById(carId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
  }

  await record.deleteOne();
  return record;
};