import { Document, Model } from 'mongoose';
import { ISubscriptionDoc } from './subscription.interfaces';
import { IWatchListDoc } from './watch-list.interfaces';

export interface IUser {
  ssoID: string;
  firstName: string;
  lastName: string;
  pictureUri: string;
  email: string;
  subscription: string | ISubscriptionDoc;
  watchList: string | IWatchListDoc;
}

export interface ISafeUser {
  ssoID?: string;
  firstName: string;
  lastName: string;
  pictureUri: string;
  email: string;
  subscription: string | ISubscriptionDoc;
  watchList: string | IWatchListDoc;
}

export type NewUserBody = Omit<IUser, 'subscription' | 'watchList'>;

export type UpdateUserBody = Partial<IUser>;

export interface IUserDoc extends IUser, Document {}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  findOrCreate(user: NewUserBody): Promise<IUserDoc>;
}