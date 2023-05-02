import { Document, Model, Types } from 'mongoose';

import { Condition } from './condition.interfaces';
import { Region } from './region.interfaces';

export interface ISearchCrtieria {
  search: Types.ObjectId;
  region: Region;
  maxMileage: number;
  maxPrice: number;
  exteriorCondition: Condition;
  mechanicalCondition: Condition;
  color: string;
  make: string;
  model: string;
}

export type NewSearchCriteriaBody = ISearchCrtieria;

export type UpdateSearchCriteriaBody = Partial<ISearchCrtieria>;

export type SearchCriteriaRequest = Partial<Omit<ISearchCrtieria, 'searchId'>>; 

export interface ISearchCriteriaDoc extends ISearchCrtieria, Document {}

export interface ISearchCriteriaModel extends Model<ISearchCriteriaDoc> {}