import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ISearchCriteriaDoc } from '../interfaces/search-criteria.interfaces';
import * as searchCriteriaService from '../services/search-criteria.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

/**
 * Creates a new SearchCriteria record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the new SearchCriteria record
 */
export const createSearchCriteria = catchAsync(async (req: Request, res: Response) => {
  const record = await searchCriteriaService.create(req.body);
  
  res.status(httpStatus.CREATED).send(record);
});

/**
 * Retrieves the specified SearchCriteria record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the specified SearchCriteria record
 */
export const getSearchCriteria = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['searchCriteriaId'] === 'string') {
    const record = await searchCriteriaService.getById(
      new Types.ObjectId(req.params['searchCriteriaId'])
    );
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Search criteria not found');
    }
    
    res.send(record);
  }
});

/**
 * Updates the specified SearchCriteria record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the updated SearchCriteria record
 */
export const updateSearchCriteria = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['searchCriteriaId'] === 'string') {
    const record = await searchCriteriaService.updateById(
      new Types.ObjectId(req.params['searchCriteriaId']), req.body
    );
    
    res.send(record);
  }
});

/**
 * Deletes the specified SearchCriteria record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteSearchCriteria = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['searchId'] === 'string') {
    await searchCriteriaService.deleteById(
      new Types.ObjectId(req.params['searchId'])
    );

    res.status(httpStatus.NO_CONTENT).send();
  }
});