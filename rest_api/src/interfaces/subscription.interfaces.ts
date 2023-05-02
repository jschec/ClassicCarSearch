import { Model, Document } from 'mongoose';

export interface ISubscription {
  cost: number;
}

export type NewSubscriptionBody = ISubscription;

export type UpdateSubscriptionBody = Partial<ISubscription>;

export interface ISubscriptionDoc extends ISubscription, Document {}

export interface ISubscriptionModel extends Model<ISubscriptionDoc> {}