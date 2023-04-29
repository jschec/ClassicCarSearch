import { Document, Model, Types } from 'mongoose';

export interface ICarSeller {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  carListingIds: Types.ObjectId[];
}

export type NewCarSellerBody = ICarSeller;

export type UpdateCarBody = Partial<ICarSeller>;

export interface ICarSellerDoc extends ICarSeller, Document {}

export interface ICarSellerModel extends Model<ICarSellerDoc> {}