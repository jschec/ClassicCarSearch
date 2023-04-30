import { Document, Model, Types } from 'mongoose';

export interface ISearch {
  searchCriteriaId: Types.ObjectId;
  resultIds: Types.ObjectId[];
  forecastIds: Types.ObjectId[];
}

export type NewSearchBody = Omit<ISearch, 'resultIds' | 'forecastIds'>;

export type UpdateSearchBody = Partial<ISearch>;

export interface ISearchDoc extends ISearch, Document {}

export interface ISearchModel extends Model<ISearchDoc> {}