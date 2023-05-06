import { Document, Model } from 'mongoose';

import { Condition } from './condition.interfaces';
import { Region } from './region.interfaces';

export interface ISearchCrtieria {
  search: string;
  region: Region;
  maxMileage: number;
  maxPrice: number;
  exteriorCondition: Condition;
  mechanicalCondition: Condition;
  color: string;
  make: string;
  model: string;
}

export type NewSearchCriteriaBody = Partial<ISearchCrtieria>;

export type UpdateSearchCriteriaBody = Partial<ISearchCrtieria>;

export type SearchCriteriaRequest = Partial<Omit<ISearchCrtieria, 'searchId'>>; 

export interface ISearchCriteriaDoc extends ISearchCrtieria, Document {}

export interface ISearchCriteriaModel extends Model<ISearchCriteriaDoc> {}