import { Document, Model } from 'mongoose';

import { ICarDoc } from './car.interfaces';
import { ISearchDoc } from './search.interfaces';

export interface IWatchList {
  user: string | ICarDoc;
  searches: string[] | ISearchDoc[];
}

export type NewWatchListBody = IWatchList;

export type UpdateWatchListBody = IWatchList;

export interface IWatchListDoc extends IWatchList, Document {}

export interface IWatchListModel extends Model<IWatchListDoc> {}