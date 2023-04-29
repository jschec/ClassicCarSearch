import { Model, Document } from 'mongoose';

export type CarCondition = 'Excellent' | 'Good' | 'Fair' | 'Bad';

export interface ICar {
  make: string;
  model: string;
  year: number;
  exteriorCondition: CarCondition;
  mechanicalCondition: CarCondition;
  mileage: number;
  color: string;
}

export type NewCarBody = ICar;

export type UpdateCarBody = Partial<ICar>;

export interface ICarDoc extends ICar, Document {}

export interface ICarModel extends Model<ICarDoc> {}