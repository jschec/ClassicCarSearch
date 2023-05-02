import { Document, Model, Types } from 'mongoose';
import { ISearchCriteriaDoc } from './search-criteria.interfaces';

export interface ISearch {
  results: Types.ObjectId[] | ISearchDoc[];
}

export type NewSearchBody = ISearch;

export type UpdateSearchBody = Partial<ISearch>;

export interface ISearchDoc extends ISearch, Document {
  criterias: ISearchCriteriaDoc[];
}

export interface ISearchModel extends Model<ISearchDoc> {}