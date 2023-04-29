import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ICarSellerDoc } from '../interfaces/car-seller.interfaces';
import * as carSellerService from '../services/car-seller.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

/**
 * Creates a new CarSeller record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarSellerDoc>} A promise containing the new CarSeller record
 */
export const createCarSeller = catchAsync(async (req: Request, res: Response) => {
  const record = await carSellerService.create(req.body);
  
  res.status(httpStatus.CREATED).send(record);
});

/**
 * Retrieves the specified CarSeller record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarSellerDoc>} A promise containing the specified CarSeller record
 */
export const getCarSeller = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['carSellerId'] === 'string') {
    const record = await carSellerService.getById(
      new Types.ObjectId(req.params['carSellerId'])
    );
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car seller not found');
    }
    
    res.send(record);
  }
});

/**
 * Updates the specified CarSeller record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarSellerDoc>} A promise containing the updated CarSeller record
 */
export const updateCarSeller = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['carSellerId'] === 'string') {
    const record = await carSellerService.updateById(
      new Types.ObjectId(req.params['carSellerId']), req.body
    );
    
    res.send(record);
  }
});

/**
 * Deletes the specified CarSeller record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteCarSeller = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['carSellerId'] === 'string') {
    await carSellerService.deleteById(
      new Types.ObjectId(req.params['carSellerId'])
    );

    res.status(httpStatus.NO_CONTENT).send();
  }
});