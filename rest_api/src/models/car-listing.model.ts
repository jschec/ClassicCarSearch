import { model, Schema } from 'mongoose';

import { 
  ICarListingDoc, ICarListingModel 
} from '../interfaces/car-listing.interfaces';
import { Region } from '../interfaces/region.interfaces';
import CarSeller from './car-seller.model';
import Car from './car.model';

const carListingSchema = new Schema<
  ICarListingDoc, ICarListingModel
>(
  {
    region: {
      type: String,
      required: true,
      enum: Object.values(Region),
    },
    listDate: {
      type: Date,
      required: true,
      min: new Date('1885-01-01'), // First car was invented in 1885
      max: new Date(), // Can't be newer than today
    },
    saleDate: {
      type: Date,
      required: false,
      max: new Date(), // Can't be newer than today
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
carListingSchema.pre('validate', async function(next) {
  const carSellerExists = await CarSeller.exists({ _id: this.sellerId });
  const carExists = await Car.exists({ _id: this.carId });

  let validationMessages = [];

  // Section of validation checks
  if (this.listDate > this.saleDate) {
    validationMessages.push('Sale date must be greater than listing date');
  }

  if (!carSellerExists) {
    validationMessages.push('Car seller does not exist');
  }

  if (!carExists) {
    validationMessages.push('Car does not exist');
  }

  // Return validation errors if any
  if (validationMessages.length > 0) {
    next(new Error(validationMessages.join(', ')));
  }

  next();
});

const CarListing = model<ICarListingDoc, ICarListingModel>(
  'CarListing', carListingSchema
);

export default CarListing;