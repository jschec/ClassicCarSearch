import { Document, Model } from 'mongoose';
import { ISearchDoc } from './search.interfaces';

export interface IWatchList {
  user: string;
  searches: string[] | ISearchDoc[];
}

export type NewWatchListBody = IWatchList;

export type UpdateWatchListBody = IWatchList;

export interface IWatchListDoc extends IWatchList, Document {}

export interface IWatchListModel extends Model<IWatchListDoc> {}