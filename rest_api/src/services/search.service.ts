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
 * Retrieves the specified search record by its identifier.
 *
 * @param {Types.ObjectId} searchId The identifier of the Search to retrieve
 * @returns {Promise<ISearchDoc | null>} A promise containing the specified Search record
 */
export const getFullDocById = async (searchId: Types.ObjectId): Promise<ISearchDoc | null> => {
  let searchDoc = await Search.findById(searchId);
  if (searchDoc) {
    searchDoc = await searchDoc.populate([
      {
        path: 'criterias',
        select: '-createdAt -updatedAt -__v -_id',
      },
      {
        path: 'results',
        select: '-createdAt -updatedAt -__v -_id',
        populate: [
          {
            path: 'car',
            select: '-createdAt -updatedAt -__v -_id',
          },
          {
            path: 'seller',
            select: '-createdAt -updatedAt -__v -_id',
          },
        ],
      },
    ]);
  }
  return searchDoc;
};

/**
 * Retrieves the specified search record by its identifier.
 *
 * @param {Types.ObjectId} searchIds The identifier of the Search to retrieve
 * @returns {Promise<ISearchDoc[]>} A promise containing the specified Search record
 */
export const getFullDocByIds = async (searchIds: Types.ObjectId[]): Promise<ISearchDoc[]> => {
  const result = await Search.find({ _id: { $in: searchIds } }).populate([
      {
        path: 'criterias',
        select: '-createdAt -updatedAt -__v -_id',
      },
      {
        path: 'results',
        select: '-createdAt -updatedAt -__v -_id',
        populate: [
          {
            path: 'car',
            select: '-createdAt -updatedAt -__v -_id',
          },
          {
            path: 'seller',
            select: '-createdAt -updatedAt -__v -_id',
          },
        ],
      },
    ]);
  return result;
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

  await record.deleteOne();
  return record;
};