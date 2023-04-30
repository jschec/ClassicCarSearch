import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { 
  NewSearchBody, UpdateSearchBody, ISearchDoc 
} from '../interfaces/search.interfaces';
import Search from '../models/search.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new Search record
 * 
 * @param {NewSearchBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchDoc>} A promise containing the new Search record
 */
export const create = async (reqBody: NewSearchBody): Promise<ISearchDoc> => {
  return Search.create(reqBody);
};

/**
 * Retrieves the specified Search record
 * 
 * @param {Types.ObjectId} searchId The identifier of the Search to retrieve
 * @returns {Promise<ISearchDoc | null>} A promise containing the specified Search record
 */
export const getById = async (searchId: Types.ObjectId): Promise<ISearchDoc | null> => {
  return Search.findById(searchId);
};

/**
 * Updates the Search record with the sought identifier.
 * 
 * @param {Types.ObjectId} searchId The identifier of the Search to update
 * @param {UpdateSearchBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchDoc | null>} A promise containing the updated Search record
 */
export const updateById = async (
  searchId: Types.ObjectId, reqBody: UpdateSearchBody
): Promise<ISearchDoc | null> => {
  const record = await getById(searchId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Search not found');
  }
  
  Object.assign(record, reqBody);
  
  await record.save();
  
  return record;
};

/**
 * Deletes the Search record with the sought identifier.
 * 
 * @param {Types.ObjectId} searchId The identifier of the Search to update
 * @returns {Promise<ISearchDoc | null>} A promise containing the deleted Search record.
 */
export const deleteById = async (searchId: Types.ObjectId): Promise<ISearchDoc | null> => {
  const record = await getById(searchId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Search not found');
  }

  // TODO - remove all associated records

  await record.deleteOne();
  return record;
};