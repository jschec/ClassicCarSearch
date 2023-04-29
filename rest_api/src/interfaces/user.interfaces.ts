import mongoose, { Model, Document } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  pictureUri: string;
  email: string;
  age: number;
  watchListId: number;
  subscriptionId: number;
}

export type NewUserBody = Omit<IUser, 'watchListId' | 'subscriptionId'>;

export type UpdateUserBody = Partial<IUser>;

export interface IUserDoc extends IUser, Document {}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}