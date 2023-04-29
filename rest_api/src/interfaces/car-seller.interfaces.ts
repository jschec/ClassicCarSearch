import { Document, Model, Types } from 'mongoose';

export interface ICarSeller {
  firstName: string;
  lastName: string;
  email: string;
}

export type NewCarSellerBody = Omit<ICarSeller, 'carListingIds'>;;

export type UpdateCarSellerBody = Partial<ICarSeller>;

export interface ICarSellerDoc extends ICarSeller, Document {}

export interface ICarSellerModel extends Model<ICarSellerDoc> {
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>;
}