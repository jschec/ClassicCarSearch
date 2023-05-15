import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { ISubscriptionDoc } from '../interfaces/subscription.interfaces';
import * as subscriptionService from '../services/subscription.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

/**
 * Creates a new Subscription record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<ISubscriptionDoc>} A promise containing the new Subscription record
 */
export const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const subscription = await subscriptionService.create(req.body);
  
  res.status(httpStatus.CREATED).send(subscription);
});

/**
 * Retrieves the specified Subscription record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<ISubscriptionDoc>} A promise containing the specified Subscription record
 */
export const getSubscription = catchAsync(async (req: Request, res: Response) => {
  if (req.params['subscriptionId']) {
    const subscription = await subscriptionService.getById(req.params['subscriptionId']);
    
    if (!subscription) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
    }
    
    res.send(subscription);
  }
});

/**
 * Retrieves all Subscription records
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<ISubscriptionDoc>} A promise containing all Subscription records
 */
export const getSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const records = await subscriptionService.getAll();
  
  res.send(records);
});

/**
 * Updates the specified Subscription record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<ISubscriptionDoc>} A promise containing the updated Subscription record
 */
export const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  if (req.params['subscriptionId']) {
    const subscription = await subscriptionService.updateById(req.params['subscriptionId'], req.body);
    
    res.send(subscription);
  }
});

/**
 * Deletes the specified Subscription record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteSubscription = catchAsync(async (req: Request, res: Response) => {
  if (req.params['subscriptionId']) {
    await subscriptionService.deleteById(req.params['subscriptionId']);

    res.status(httpStatus.NO_CONTENT).send();
  }
});