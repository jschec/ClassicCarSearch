import { Document, Model } from 'mongoose';

export interface ICarListing {
  region: string;
  price: number;
  listDate: Date;
  saleDate: Date | null;
  seller: string;
  car: string;
}

export type NewCarListingBody = ICarListing;

export type UpdateCarListingBody = Partial<ICarListing>;

export interface ICarListingDoc extends ICarListing, Document {}

export interface ICarListingModel extends Model<ICarListingDoc> {}