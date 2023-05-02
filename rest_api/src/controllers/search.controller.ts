import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ISearchDoc } from '../interfaces/search.interfaces';
import { ISearchForecastDoc } from '../interfaces/search-forecast.interfaces';
import * as carListingService from '../services/car-listing.service';
import * as searchForecastService from '../services/search-forecast.service';
import * as searchService from '../services/search.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

/**
 * Creates a new Search record
 * 
 * @param {Request<SearchCriteriaRequest>} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc>} A promise containing the new Search record
 */
export const createSearch = catchAsync(async (req: Request, res: Response) => {
  // Apply the search criteria to the CarListing records
  const matchingListings = await carListingService.applyQuery(req.body);
  const listingIds = matchingListings.map(listing => listing._id);
  
  const record = await searchService.create({
    ...req.body, results: listingIds
  });
  
  res.status(httpStatus.CREATED).send(record);
});

/**
 * Retrieves the specified Search record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc>} A promise containing the specified Search record
 */
export const getSearch = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['searchId'] === 'string') {
    const record = await searchService.getById(
      new Types.ObjectId(req.params['searchId'])
    );
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Search not found');
    }
    
    res.send(record);
  }
});

/**
 * Retrieves the specified Search record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the specified SearchForecast records
 */
export const getSearchForecasts = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['searchId'] === 'string') {
    const records = await searchForecastService.getBySearchId(
      new Types.ObjectId(req.params['searchId'])
    );

    res.send(records);
  }
});

/**
 * Updates the specified Search record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc>} A promise containing the updated Search record
 */
export const updateSearch = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['searchId'] === 'string') {
    const record = await searchService.updateById(
      new Types.ObjectId(req.params['searchId']), req.body
    );
    
    res.send(record);
  }
});

/**
 * Deletes the specified Search record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteSearch = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['searchId'] === 'string') {
    await searchService.deleteById(
      new Types.ObjectId(req.params['searchId'])
    );

    res.status(httpStatus.NO_CONTENT).send();
  }
});