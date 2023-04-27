import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import * as userService from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getById(
      new mongoose.Types.ObjectId(req.params['userId'])
    );
    
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    
    res.send(user);
  }
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateById(
      new mongoose.Types.ObjectId(req.params['userId']), req.body
    );
    
    res.send(user);
  }
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteById(new mongoose.Types.ObjectId(req.params['userId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});