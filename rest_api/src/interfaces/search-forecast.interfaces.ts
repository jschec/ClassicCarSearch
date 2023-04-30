import { Document, Model } from 'mongoose';

export interface ISearchForecast {
  avgTimeOnMarket: number;
  avgPrice: number;
  averageMileage: number;
  ttl: number;
}

export type NewSearchForecastBody = ISearchForecast;

export type UpdateSearchForecastBody = Partial<ISearchForecast>;

export interface ISearchForecastDoc extends ISearchForecast, Document {}

export interface ISearchForecastModel extends Model<ISearchForecastDoc> {}