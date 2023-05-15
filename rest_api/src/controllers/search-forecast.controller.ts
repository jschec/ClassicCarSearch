import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ISearchForecastDoc } from '../interfaces/search-forecast.interfaces';
import * as searchForecastService from '../services/search-forecast.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

/**
 * Creates a new SearchForecast record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the new SearchForecast record
 */
export const createSearchForecast = catchAsync(async (req: Request, res: Response) => {
  const record = await searchForecastService.create(req.body);
  
  res.status(httpStatus.CREATED).send(record);
});

/**
 * Retrieves the specified SearchForecast record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the specified SearchForecast record
 */
export const getSearchForecast = catchAsync(async (req: Request, res: Response) => {
  if (req.params['searchForecastId']) {
    const record = await searchForecastService.getById(
      req.params['searchForecastId']
    );
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Search criteria not found');
    }
    
    res.send(record);
  }
});

/**
 * Updates the specified SearchForecast record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the updated SearchForecast record
 */
export const updateSearchForecast = catchAsync(async (req: Request, res: Response) => {
  if (req.params['searchForecastId']) {
    const record = await searchForecastService.updateById(
      req.params['searchForecastId'], req.body
    );
    
    res.send(record);
  }
});

/**
 * Deletes the specified SearchForecast record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteSearchForecast = catchAsync(async (req: Request, res: Response) => {
  if (req.params['searchForecastId']) {
    await searchForecastService.deleteById(req.params['searchForecastId']);

    res.status(httpStatus.NO_CONTENT).send();
  }
});