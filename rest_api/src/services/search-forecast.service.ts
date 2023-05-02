import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { 
  NewSearchForecastBody, UpdateSearchForecastBody, ISearchForecastDoc 
} from '../interfaces/search-forecast.interfaces';
import SearchForecast from '../models/search-forecast.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new SearchForecast record
 * 
 * @param {NewSearchForecastBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the new SearchForecast record
 */
export const create = async (reqBody: NewSearchForecastBody): Promise<ISearchForecastDoc> => {
  return SearchForecast.create(reqBody);
};

/**
 * Retrieves the specified SearchForecast record
 * 
 * @param {Types.ObjectId} searchForecastId The identifier of the SearchForecast to retrieve
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the specified SearchForecast record
 */
export const getById = async (searchForecastId: Types.ObjectId): Promise<ISearchForecastDoc | null> => {
  return SearchForecast.findById(searchForecastId);
};

/**
 * Retrieves the specified SearchForecast record by searchId
 * 
 * @param {Types.ObjectId} searchId The identifier of the Search to retrieve SearchForecast for
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the specified SearchForecast record
 */
export const getBySearchId = async (searchId: Types.ObjectId): Promise<ISearchForecastDoc[]> => {
  return SearchForecast.find({ searchId: searchId });
};

/**
 * Updates the SearchForecast record with the sought identifier.
 * 
 * @param {Types.ObjectId} searchForecastId The identifier of the SearchForecast to update
 * @param {UpdateSearchForecastBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the updated SearchForecast record
 */
export const updateById = async (
  searchForecastId: Types.ObjectId, reqBody: UpdateSearchForecastBody
): Promise<ISearchForecastDoc | null> => {
  const record = await getById(searchForecastId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Search forecast not found');
  }
  
  Object.assign(record, reqBody);
  
  await record.save();
  
  return record;
};

/**
 * Deletes the SearchForecast record with the sought identifier.
 * 
 * @param {Types.ObjectId} searchForecastId The identifier of the SearchForecast to update
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the deleted SearchForecast record.
 */
export const deleteById = async (searchForecastId: Types.ObjectId): Promise<ISearchForecastDoc | null> => {
  const record = await getById(searchForecastId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Search forecast not found');
  }

  await record.deleteOne();
  return record;
};