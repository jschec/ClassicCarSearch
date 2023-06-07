import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import { IWatchListDoc } from '../interfaces/watch-list.interfaces';
import * as watchListService from '../services/watch-list.service';
import catchAsync from '../utils/catchAsync';
import validateAuth from '../utils/validateAuth';
import ApiError from '../utils/ApiError';

/**
 * Creates a new WatchList record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<IWatchListDoc>} A promise containing the new WatchList record
 */
export const createWatchList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  validateAuth(req, res, next);

  const record = await watchListService.create(req.body);
  
  res.status(httpStatus.CREATED).send(record);
});

/**
 * Retrieves the specified WatchList record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<IWatchListDoc>} A promise containing the specified WatchList record
 */
export const getWatchList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  validateAuth(req, res, next);

  if (req.params['watchListId']) {
    const record = await watchListService.getById(req.params['watchListId']);
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Watch list not found');
    }
    
    res.send(record);
  }
});

/**
 * Updates the specified WatchList record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<IWatchListDoc>} A promise containing the updated WatchList record
 */
export const updateWatchList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  validateAuth(req, res, next);

  if (req.params['watchListId']) {
    const record = await watchListService.updateById(
      req.params['watchListId'], req.body
    );
    
    res.send(record);
  }
});

/**
 * Deletes the specified WatchList record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteWatchList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  validateAuth(req, res, next);

  if (req.params['watchListId']) {
    await watchListService.deleteById(req.params['watchListId']);

    res.status(httpStatus.NO_CONTENT).send();
  }
});