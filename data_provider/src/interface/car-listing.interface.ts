import { Document, Model } from 'mongoose';
import { ICarDoc } from './car.interface';

import { ICarSellerDoc } from './car-seller.interface';

export interface ICarListing {
  region: string;
  price: number;
  listDate: Date;
  saleDate: Date | null;
  seller: string | ICarSellerDoc;
  car: string | ICarDoc;
}

export type NewCarListingBody = ICarListing;

export type UpdateCarListingBody = Partial<ICarListing>;

export interface ICarListingDoc extends ICarListing, Document {}

export interface ICarListingModel extends Model<ICarListingDoc> {}