import { Model, Document } from 'mongoose';
import { Condition } from './condition.interfaces';
import { ISearchForecastDoc } from './search-forecast.interfaces';

export interface ICar {
  make: string;
  model: string;
  year: number;
  exteriorCondition: Condition;
  mechanicalCondition: Condition;
  mileage: number;
  color: string;
  img: string;
  forecast: string | ISearchForecastDoc;
}

/*
export interface ISearchForecast {
  avgTimeOnMarket: number;
  avgPrice: number;
  averageMileage: number;
  ttl: number;
  priceHistory: number[];
  forecastRegion: string;
}*/

export type NewCarBody = ICar;

export type UpdateCarBody = Partial<ICar>;

export interface ICarDoc extends ICar, Document {}

export interface ICarModel extends Model<ICarDoc> {}