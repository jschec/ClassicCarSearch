import { Document, Model } from 'mongoose';
import { ICarDoc } from './car.interfaces';

import { ICarSellerDoc } from './car-seller.interfaces';

export interface ICarListing {
  id: string;
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