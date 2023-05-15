import { Document, Model } from 'mongoose';

import { Condition } from './condition.interfaces';
import { IPagination } from './pagination.interfaces';
import { Region } from './region.interfaces';
import { ISearchDoc } from './search.interfaces';

export interface ISearchCrtieria {
  search: string | ISearchDoc;
  region: Region;
  maxMileage: number;
  maxPrice: number;
  exteriorCondition: Condition;
  mechanicalCondition: Condition;
  color: string;
  make: string;
  model: string;
};

export type NewSearchCriteriaBody = Partial<ISearchCrtieria>;

export type UpdateSearchCriteriaBody = Partial<ISearchCrtieria>;

export type SearchCriteriaRequest = Partial<Omit<ISearchCrtieria, 'searchId'>>; 

export type SearchCriteriaRequestPaginated = SearchCriteriaRequest & IPagination;

export interface ISearchCriteriaDoc extends ISearchCrtieria, Document {}

export interface ISearchCriteriaModel extends Model<ISearchCriteriaDoc> {}