import { model, Schema } from 'mongoose';

import { 
  ICarListingDoc, ICarListingModel 
} from '../interfaces/car-listing.interfaces';

const carListingSchema = new Schema<
  ICarListingDoc, ICarListingModel
>(
  {
    region: {
      type: String,
      required: true,
    },
    listDate: {
      type: Date,
      required: true,
      min: new Date('1885-01-01'), // First car was invented in 1885
      max: new Date(), // Can't be newer than today
    },
    // must be greater than listDate
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
carListingSchema.pre('validate', function(next) {
  if (this.listDate > this.saleDate) {
      next(new Error('Sale date must be greater than listing date'));
  } else {
      next();
  }
});

const CarListing = model<ICarListingDoc, ICarListingModel>(
  'CarListing', carListingSchema
);

export default CarListing;