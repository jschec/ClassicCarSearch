import httpStatus from 'http-status';
import mongoose from 'mongoose';

import { 
  NewUserBody, 
  UpdateUserBody, 
  IUserDoc 
} from '../interfaces/user.interfaces';
import User from '../models/user.model';
import ApiError from '../utils/ApiError';

/**
 * Creates a new User record
 * 
 * @param {NewUserBody} userBody The request body supplied by the client
 * @returns {Promise<IUserDoc>} A promise containing the new User record
 */
export const create = async (userBody: NewUserBody): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  return User.create(userBody);
};

/**
 * Retrieves the specified User record
 * 
 * @param {mongoose.Types.ObjectId} id The identifier of the User to retrieve
 * @returns {Promise<IUserDoc | null>} A promise containing the specified User record
 */
export const getById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

/**
 * Updates the specified User record
 * 
 * @param {mongoose.Types.ObjectId} userId The identifier of the User to update
 * @param {UpdateUserBody} updateBody The request body supplied by the client
 * @returns {Promise<IUserDoc | null>} A promise containing the updated User record
 */
export const updateById = async (
  userId: mongoose.Types.ObjectId, updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getById(userId);
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  Object.assign(user, updateBody);
  
  await user.save();
  
  return user;
};

/**
 * Deletes the User record with the sought identifier.
 * 
 * @param {mongoose.Types.ObjectId} userId  The identifier of the user to delete.
 * @returns {Promise<IUserDoc | null>} A promise containing the deleted user record.
 */
export const deleteById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getById(userId);
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await user.deleteOne();
  return user;
};