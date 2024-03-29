import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { IUser, IUserDoc } from '../interfaces/user.interfaces';
import * as userService from '../services/user.service';
import * as watchListService from '../services/watch-list.service';
import * as searchService from '../services/search.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import { IWatchListDoc } from '../interfaces/watch-list.interfaces';

/**
 * Creates a new User record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<IUserDoc>} A promise containing the new user record
 */
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Retrieves the specified User record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<IUserDoc>} A promise containing the specified user record
 */
export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (req.params['userId']) {

    let user: IUserDoc | null;
    const userId = req.params['userId'];

    if (req.query?.fields) {
      const fields = String(req.query.fields).split(",");
      user = await userService.getByIdWithFields(userId, fields);
    } else {
      user = await userService.getById(userId);
    }

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    
    res.send(user);
  }
});

/**
 * Retrieves the specified User record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<IWatchListDoc>} A promise containing the specified user record
 */
export const getUserWatchList = catchAsync(async (req: Request, res: Response) => {
  if (req.params['userId']) {

    const userId = req.params['userId'];
    let watchList = await watchListService.getByUserId(userId);

    if (!watchList) {
      throw new ApiError(httpStatus.NOT_FOUND, 'WatchList not found');
    }

    const searches = await searchService.getFullDocByIds(watchList.searches as string[]);
    watchList.searches = searches;

    res.send(watchList);
  }
});

/**
 * Updates the specified User record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<IUserDoc>} A promise containing the updated user record
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (req.params['userId']) {
    const user = await userService.updateById(req.params['userId'], req.body);

    // Update the session with the new subscription
    if (user && user.subscription) {
      (req.user! as IUser).subscription = user.subscription;
    }
    
    res.send(user);
  }
});

/**
 * Deletes the specified User record
 * 
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * 
 * @returns {Promise<void>} A promise indicating the success of the operation
 */ 
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (req.params['userId']) {
    await userService.deleteById(req.params['userId']);

    res.status(httpStatus.NO_CONTENT).send();
  }
});