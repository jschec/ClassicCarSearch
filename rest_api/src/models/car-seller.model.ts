import { model, ObjectId, Schema } from 'mongoose';
import validator from 'validator';

import { 
  ICarSellerDoc, ICarSellerModel 
} from '../interfaces/car-seller.interfaces';

const carSellerSchema = new Schema<
  ICarSellerDoc, ICarSellerModel
>(
  {
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
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 120,
    },
    carListingIds: {
      type: [Schema.Types.ObjectId],
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

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

const CarSeller = model<ICarSellerDoc, ICarSellerModel>(
  'CarSeller', carSellerSchema
);

export default CarSeller;