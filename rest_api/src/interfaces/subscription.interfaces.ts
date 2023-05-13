import { Document, Model, Types } from 'mongoose';

export interface ISubscription {
  name: string;
  cost: number;
  features: string[];
}

export type NewSubscriptionBody = ISubscription;

export type UpdateSubscriptionBody = Partial<ISubscription>;

export interface ISubscriptionDoc extends ISubscription, Document {}

export interface ISubscriptionModel extends Model<ISubscriptionDoc> {
  isNameTaken(name: string, excludeRecId?: Types.ObjectId): Promise<boolean>;
}