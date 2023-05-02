import { Document, Model, Types } from 'mongoose';
import { ISearchDoc } from './search.interfaces';

export interface IWatchList {
  user: Types.ObjectId;
  searches: Types.ObjectId[] | ISearchDoc[];
}

export type NewWatchListBody = IWatchList;

export type UpdateWatchListBody = IWatchList;

export interface IWatchListDoc extends IWatchList, Document {}

export interface IWatchListModel extends Model<IWatchListDoc> {}