import { Document, Model, Types } from 'mongoose';

export interface IWatchList {
  searches: Types.ObjectId[];
}

export type NewWatchListBody = IWatchList;

export type UpdateWatchListBody = IWatchList;

export interface IWatchListDoc extends IWatchList, Document {}

export interface IWatchListModel extends Model<IWatchListDoc> {}