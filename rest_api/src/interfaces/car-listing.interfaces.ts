import mongoose, { Model, Document } from 'mongoose';

export interface ICarListing {
  region: string;
  year: number;
  price: number;
  listDate: Date;
  saleDate: Date;
  sellerId: mongoose.Types.ObjectId;
  carId: mongoose.Types.ObjectId;
}

export type NewCarListingBody = ICarListing;

export type UpdateCarListingBody = Partial<ICarListing>;

export interface ICarListingDoc extends ICarListing, Document {}

export interface ICarListingModel extends Model<ICarListingDoc> {}