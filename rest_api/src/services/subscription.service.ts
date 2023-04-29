import httpStatus from 'http-status';
import mongoose from 'mongoose';

import { 
  NewSubscriptionBody, 
  UpdateSubscriptionBody, 
  ISubscriptionDoc 
} from '../interfaces/subscription.interfaces';
import Subscription from '../models/subscription.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new Subscription record
 * 
 * @param {NewSubscriptionBody} reqBody The request body supplied by the client
 * @returns {Promise<ISubscriptionDoc>} A promise containing the new Subscription record
 */
export const create = async (reqBody: NewSubscriptionBody): Promise<ISubscriptionDoc> => {
  return Subscription.create(reqBody);
};

/**
 * Retrieves the specified User record
 * 
 * @param {mongoose.Types.ObjectId} id The identifier of the Subscription to retrieve
 * @returns {Promise<ISubscriptionDoc | null>} A promise containing the specified Subscription record
 */
export const getById = async (id: mongoose.Types.ObjectId): Promise<ISubscriptionDoc | null> => {
  return Subscription.findById(id);
};

/**
 * Updates the Subscription record with the sought identifier.
 * 
 * @param {mongoose.Types.ObjectId} subscriptionId The identifier of the Subscription to update
 * @param {UpdateSubscriptionBody} reqBody The request body supplied by the client
 * @returns {Promise<ISubscriptionDoc | null>} A promise containing the updated Subscription record
 */
export const updateById = async (
  subscriptionId: mongoose.Types.ObjectId, reqBody: UpdateSubscriptionBody
): Promise<ISubscriptionDoc | null> => {
  const subscription = await getById(subscriptionId);
  
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }
  
  Object.assign(subscription, reqBody);
  
  await subscription.save();
  
  return subscription;
};

/**
 * Deletes the Subscription record with the sought identifier.
 * 
 * @param {mongoose.Types.ObjectId} subscriptionId The identifier of the Subscription to update
 * @returns {Promise<IUserDoc | null>} A promise containing the deleted user record.
 */
export const deleteById = async (subscriptionId: mongoose.Types.ObjectId): Promise<ISubscriptionDoc | null> => {
  const subscription = await getById(subscriptionId);
  
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }

  await subscription.deleteOne();
  return subscription;
};