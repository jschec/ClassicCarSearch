import { Document, Model } from 'mongoose';

export interface ISubscription {
  name: string;
  cost: number;
}

export type NewSubscriptionBody = ISubscription;

export type UpdateSubscriptionBody = Partial<ISubscription>;

export interface ISubscriptionDoc extends ISubscription, Document {}

export interface ISubscriptionModel extends Model<ISubscriptionDoc> {
  isNameTaken(name: string, excludeRecId?: string): Promise<boolean>;
}