import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ICarDoc } from '../interfaces/car.interfaces';
import * as carService from '../services/car.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

/**
 * Creates a new Car record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarDoc>} A promise containing the new Car record
 */
export const createCar = catchAsync(async (req: Request, res: Response) => {
  const record = await carService.create(req.body);
  
  res.status(httpStatus.CREATED).send(record);
});

/**
 * Retrieves the specified Car record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarDoc>} A promise containing the specified Car record
 */
export const getCar = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['carId'] === 'string') {
    const record = await carService.getById(
      new Types.ObjectId(req.params['carId'])
    );
    
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car not found');
    }
    
    res.send(record);
  }
});

/**
 * Retrieves all Car records
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarDoc>} A promise containing all Car records
 */
export const getCars = catchAsync(async (req: Request, res: Response) => {
  const records = await carService.getAll();
  
  res.send(records);
});

/**
 * Updates the specified Car record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarDoc>} A promise containing the updated Car record
 */
export const updateCar = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['carId'] === 'string') {
    const record = await carService.updateById(
      new Types.ObjectId(req.params['carId']), req.body
    );
    
    res.send(record);
  }
});

/**
 * Deletes the specified Car record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteCar = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['carId'] === 'string') {
    await carService.deleteById(
      new Types.ObjectId(req.params['carId'])
    );

    res.status(httpStatus.NO_CONTENT).send();
  }
});