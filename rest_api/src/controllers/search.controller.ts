import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ICarListingDoc } from '../interfaces/car-listing.interfaces';
import { IPaginationResponse } from '../interfaces/pagination.interfaces';

import { ISearchDoc } from '../interfaces/search.interfaces';
import { 
  SearchCriteriaRequest, SearchCriteriaRequestPaginated 
} from '../interfaces/search-criteria.interfaces';
import { ISearchForecastDoc } from '../interfaces/search-forecast.interfaces';
import * as carListingService from '../services/car-listing.service';
import * as searchCriteriaService from '../services/search-criteria.service';
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

  const matchingListings = await carListingService.applyQuery({
    page: 0, pageSize: -1, ...req.body
  }, false);

  const listingIds = matchingListings.records.map(listing => listing._id);

  const record = await searchService.create({
    ...req.body, results: listingIds
  });

  // Create the SearchCriteria record
  let searchCriteria: Record<string, any> = {};

  for (let [k, v] of Object.entries(req.body)) {
    if (k === "region" || k === "exteriorCondition" || k === "mechanicalCondition") {        
      searchCriteria[k] = (v as string).split(',');
    } else {
      searchCriteria[k] = v;
    }
  }

  await searchCriteriaService.create({...searchCriteria, search: record._id});

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
  if (req.params['searchId']) {
    const record = await searchService.getFullDocById(req.params['searchId']);
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Search not found');
    }
    
    res.send(record);
  }
});

/**
 * Retrieves the specified Search record
 *
 * @param {Request<SearchQueryRequest>} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc[]>} A promise containing the specified Search record
 */
export const getSearchByParam = catchAsync(async (req: Request, res: Response) => {
  const record = await searchService.getFullDocByIds(req.body.ids);
  res.send(record);
});

/**
 * Retrieves the matching CarListing records
 *
 * @param {Request<SearchCriteriaRequestPaginated>} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<IPaginationResponse<ICarListingDoc>>} A promise containing the paginated records
 */
export const applySearch = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 0;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

  const records = await carListingService.applyQuery({
    page, pageSize, ...req.query
  });

  res.send(records);
});

/**
 * Retrieves the specified Search record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the specified SearchForecast records
 */
export const getSearchForecasts = catchAsync(async (req: Request, res: Response) => {
  if (req.params['searchId']) {
    const records = await searchForecastService.getBySearchId(
      req.params['searchId']
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
  if (req.params['searchId']) {
    const record = await searchService.updateById(
      req.params['searchId'], req.body
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
  if (req.params['searchId']) {
    await searchService.deleteById(req.params['searchId']);

    res.status(httpStatus.NO_CONTENT).send();
  }
});