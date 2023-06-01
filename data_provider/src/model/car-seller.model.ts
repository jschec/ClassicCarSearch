import { randomUUID } from 'crypto';
import { model, ObjectId, Schema } from 'mongoose';
import validator from 'validator';

import { 
  ICarSellerDoc, ICarSellerModel 
} from '../interface/car-seller.interface';
import CarListing from './car-listing.model';
import toJSON from '../utils/toJson';

const carSellerSchema = new Schema<
  ICarSellerDoc, ICarSellerModel
>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

// Add plugin to convert mongoose documents to json
carSellerSchema.plugin(toJSON);

/**
 * Check if the email associated with the CarSeller is already associated with
 * another CarSeller
 * 
 * @param {string} email  The email to be checked
 * @param {ObjectId} [excludeCarSellerId]  The id of the CarSeller to be excluded
 * @returns {Promise<boolean>} Promise indicating if the email is taken or not
 */
carSellerSchema.static('isEmailTaken', async function (email: string, excludeCarSellerId: ObjectId): Promise<boolean> {
  const carSeller = await this.findOne({ email, _id: { $ne: excludeCarSellerId } });
  return !!carSeller;
});

/**
 * A pre deleteOne hook to delete all CarListings documents associated with 
 * the CarSeller document being deleted.
 */
carSellerSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await CarListing.deleteMany({ sellerId: this._id });

  next();
});

const CarSeller = model<ICarSellerDoc, ICarSellerModel>(
  'CarSeller', carSellerSchema
);

export default CarSeller;