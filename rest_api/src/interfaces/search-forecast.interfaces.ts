import { Document, Model } from 'mongoose';

import { ISearchDoc } from './search.interfaces';

export interface ISearchForecast {
  avgTimeOnMarket: number;
  avgPrice: number;
  averageMileage: number;
  ttl: number;
  priceHistory: number[];
  forecastRegion: string;
  //dateHistory: Date[];
}

export type NewSearchForecastBody = ISearchForecast;

export type UpdateSearchForecastBody = Partial<ISearchForecast>;

export interface ISearchForecastDoc extends ISearchForecast, Document {}

export interface ISearchForecastModel extends Model<ISearchForecastDoc> {}