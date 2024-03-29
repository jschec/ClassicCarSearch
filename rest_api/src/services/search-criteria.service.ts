import httpStatus from 'http-status';

import { 
  NewSearchCriteriaBody, UpdateSearchCriteriaBody, ISearchCriteriaDoc 
} from '../interfaces/search-criteria.interfaces';
import SearchCriteria from '../models/search-criteria.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new SearchCriteria record
 * 
 * @param {NewSearchCriteriaBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the new SearchCriteria record
 */
export const create = async (reqBody: NewSearchCriteriaBody): Promise<ISearchCriteriaDoc> => {
  return SearchCriteria.create(reqBody);
};

/**
 * Retrieves the specified SearchCriteria record
 * 
 * @param {string} searchCriteriaId The identifier of the SearchCriteria to retrieve
 * @returns {Promise<ISearchCriteriaDoc | null>} A promise containing the specified SearchCriteria record
 */
export const getById = async (searchCriteriaId: string): Promise<ISearchCriteriaDoc | null> => {
  return SearchCriteria.findById(searchCriteriaId);
};

/**
 * Updates the SearchCriteria record with the sought identifier.
 * 
 * @param {string} searchCriteriaId The identifier of the SearchCriteria to update
 * @param {UpdateSearchCriteriaBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchCriteriaDoc | null>} A promise containing the updated SearchCriteria record
 */
export const updateById = async (
  searchCriteriaId: string, reqBody: UpdateSearchCriteriaBody
): Promise<ISearchCriteriaDoc | null> => {
  const record = await getById(searchCriteriaId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Search criteria not found');
  }
  
  Object.assign(record, reqBody);
  
  await record.save();
  
  return record;
};

/**
 * Deletes the SearchCriteria record with the sought identifier.
 * 
 * @param {string} searchCriteriaId The identifier of the SearchCriteria to update
 * @returns {Promise<ISearchCriteriaDoc | null>} A promise containing the deleted SearchCriteria record.
 */
export const deleteById = async (searchCriteriaId: string): Promise<ISearchCriteriaDoc | null> => {
  const record = await getById(searchCriteriaId);
  
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Search criteria not found');
  }

  await record.deleteOne();
  return record;
};