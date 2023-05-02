import { Document, Model, Types } from 'mongoose';
import { ISubscriptionDoc } from './subscription.interfaces';
import { IWatchListDoc } from './watch-list.interface';

export interface IUser {
  firstName: string;
  lastName: string;
  pictureUri: string;
  email: string;
  age: number;
  subscription: Types.ObjectId | ISubscriptionDoc;
  watchList: Types.ObjectId | IWatchListDoc;
}

export type NewUserBody = Omit<IUser, 'subscription'>;

export type UpdateUserBody = Partial<IUser>;

export interface IUserDoc extends IUser, Document {}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>;
}