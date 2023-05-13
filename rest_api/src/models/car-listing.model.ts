import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

import { 
  ICarListingDoc, ICarListingModel 
} from '../interfaces/car-listing.interfaces';
import { Region } from '../interfaces/region.interfaces';
import CarSeller from './car-seller.model';
import Car from './car.model';
import toJSON from '../utils/toJson';

const carListingSchema = new Schema<
  ICarListingDoc, ICarListingModel
>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
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
    seller: {
      type: Schema.Types.UUID,
      required: true,
      ref: 'CarSeller',
    },
    car: {
      type: Schema.Types.UUID,
      required: true,
      ref: 'Car',
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true }
  }
);

// Add plugin to convert mongoose documents to json
carListingSchema.plugin(toJSON);

/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
carListingSchema.pre('validate', async function(next) {
  const carSellerExists = await CarSeller.exists({ _id: this.seller });
  const carExists = await Car.exists({ _id: this.car });

  let validationMessages = [];

  // Section of validation checks
  if (this.saleDate && (this.listDate > this.saleDate)) {
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