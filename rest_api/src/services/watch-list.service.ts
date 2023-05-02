import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { 
  NewWatchListBody, UpdateWatchListBody, IWatchListDoc 
} from '../interfaces/watch-list.interfaces';
import WatchList from '../models/watch-list.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new WatchList record
 * 
 * @param {NewWatchListBody} reqBody The request body supplied by the client
 * @returns {Promise<IWatchListDoc>} A promise containing the new WatchList record
 */
export const create = async (reqBody: NewWatchListBody): Promise<IWatchListDoc> => {
  return WatchList.create(reqBody);
};

/**
 * Retrieves the specified WatchList record
 * 
 * @param {Types.ObjectId} watchListId The identifier of the WatchList to retrieve
 * @returns {Promise<IWatchListDoc | null>} A promise containing the specified WatchList record
 */
export const getById = async (watchListId: Types.ObjectId): Promise<IWatchListDoc | null> => {
  return WatchList.findById(watchListId);
};

/**
 * Updates the WatchList record with the sought identifier.
 * 
 * @param {Types.ObjectId} watchListId The identifier of the WatchList to update
 * @param {UpdateWatchListBody} reqBody The request body supplied by the client
 * @returns {Promise<IWatchListDoc | null>} A promise containing the updated WatchList record
 */
export const updateById = async (
  watchListId: Types.ObjectId, reqBody: UpdateWatchListBody
): Promise<IWatchListDoc | null> => {
  const record = await getById(watchListId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Watch list not found');
  }
  
  Object.assign(record, reqBody);
  
  await record.save();
  
  return record;
};

/**
 * Deletes the WatchList record with the sought identifier.
 * 
 * @param {Types.ObjectId} watchListId The identifier of the WatchList to update
 * @returns {Promise<IWatchListDoc | null>} A promise containing the deleted WatchList record.
 */
export const deleteById = async (watchListId: Types.ObjectId): Promise<IWatchListDoc | null> => {
  const record = await getById(watchListId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Watch list not found');
  }

  await record.deleteOne();
  return record;
};