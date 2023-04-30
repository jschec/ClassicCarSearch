import { Document, Model, Types } from 'mongoose';

import { Condition } from './condition.interfaces';
import { Region } from './region.interfaces';

export interface ISearchCrtieria {
  searchId: Types.ObjectId;
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

export interface ISearchCriteriaDoc extends ISearchCrtieria, Document {}

export interface ISearchCriteriaModel extends Model<ISearchCriteriaDoc> {}