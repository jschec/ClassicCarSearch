import { Document, Model, Types } from 'mongoose';

export interface ISearch {
  watchListId: Types.ObjectId;
  resultIds: Types.ObjectId[];
}

export type NewSearchBody = ISearch;

export type UpdateSearchBody = Partial<ISearch>;

export interface ISearchDoc extends ISearch, Document {}

export interface ISearchModel extends Model<ISearchDoc> {}