import { Document, Model, Types } from 'mongoose';

export interface ICarListing {
  region: string;
  price: number;
  listDate: Date;
  saleDate: Date;
  seller: Types.ObjectId;
  car: Types.ObjectId;
}

export type NewCarListingBody = ICarListing;

export type UpdateCarListingBody = Partial<ICarListing>;

export interface ICarListingDoc extends ICarListing, Document {}

export interface ICarListingModel extends Model<ICarListingDoc> {}