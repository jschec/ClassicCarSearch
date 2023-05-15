import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ICarListingDoc } from '../interfaces/car-listing.interfaces';
import * as carListingService from '../services/car-listing.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

/**
 * Creates a new CarListing record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarListingDoc>} A promise containing the new CarListing record
 */
export const createCarListing = catchAsync(async (req: Request, res: Response) => {
  const record = await carListingService.create(req.body);
  
  res.status(httpStatus.CREATED).send(record);
});

/**
 * Retrieves the specified CarListing record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarListingDoc>} A promise containing the specified CarListing record
 */
export const getCarListing = catchAsync(async (req: Request, res: Response) => {
  if (req.params['carListingId']) {
    const record = await carListingService.getById(req.params['carListingId'], true);
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car listing not found');
    }
    
    res.send(record);
  }
});

/**
 * Retrieves all CarListing records
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarDoc[]>} A promise containing all CarListing records
 */
export const getCarListings = catchAsync(async (req: Request, res: Response) => {
  const records = await carListingService.getAll();
  
  res.send(records);
});

/**
 * Updates the specified CarListing record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarListingDoc>} A promise containing the updated CarListing record
 */
export const updateCarListing = catchAsync(async (req: Request, res: Response) => {
  if (req.params['carListingId']) {
    const record = await carListingService.updateById(
      req.params['carListingId'], req.body
    );
    
    res.send(record);
  }
});

/**
 * Deletes the specified CarListing record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteCarListing = catchAsync(async (req: Request, res: Response) => {
  if (req.params['carListingId']) {
    await carListingService.deleteById(req.params['carListingId']);

    res.status(httpStatus.NO_CONTENT).send();
  }
});